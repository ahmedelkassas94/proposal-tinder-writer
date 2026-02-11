import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseTemplateIntoSections } from "@/lib/sectionParsing";
import { extractInstructionsWithAI } from "@/lib/ai";
import { basicRateLimit, getRequestIp } from "@/lib/rateLimiter";
import { Mode } from "@prisma/client";

export const runtime = "nodejs";

/** Lazy-load heavy parsers only when needed so app startup stays fast. */
async function extractTextFromFile(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = file.name.toLowerCase();

  if (name.endsWith(".pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    const data = await pdfParse(buffer);
    return data.text || "";
  }

  if (name.endsWith(".docx") || name.endsWith(".doc")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  }

  return buffer.toString("utf-8");
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: Request) {
  try {
    const ip = getRequestIp(req.headers);
    if (!basicRateLimit(ip)) {
      return jsonError("Rate limit exceeded. Please wait a few minutes.", 429);
    }

    const contentType = req.headers.get("content-type") || "";

    let name = "";
    let mode: Mode = "PROPOSAL";
    let templateRaw = "";
    let callRaw = "";
    let instructionsRaw = "";

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData();

    name = (form.get("name")?.toString() || "").trim();
    mode = (form.get("mode")?.toString() === "TINDER" ? "TINDER" : "PROPOSAL") as Mode;

    const templateText = form.get("templateText")?.toString() || "";
    const callText = form.get("callText")?.toString() || "";
    const instructionsText = form.get("instructionsText")?.toString() || "";

    const templateFile = form.get("templateFile");
    const callFile = form.get("callFile");
    const instructionsFile = form.get("instructionsFile");

    const templateFileText =
      templateFile instanceof File && templateFile.size > 0
        ? await extractTextFromFile(templateFile)
        : "";
    const callFileText =
      callFile instanceof File && callFile.size > 0
        ? await extractTextFromFile(callFile)
        : "";
    const instructionsFileText =
      instructionsFile instanceof File && instructionsFile.size > 0
        ? await extractTextFromFile(instructionsFile)
        : "";

    // For backend processing we combine typed text + parsed file text.
    templateRaw = [templateText, templateFileText].filter(Boolean).join("\n\n");
    callRaw = [callText, callFileText].filter(Boolean).join("\n\n");
    instructionsRaw = [instructionsText, instructionsFileText].filter(Boolean).join("\n\n");
  } else {
    const body = await req.json().catch(() => null) as {
      name?: string;
      mode?: "PROPOSAL" | "TINDER";
      templateText?: string;
      callText?: string;
      instructionsText?: string;
    } | null;

    if (!body) {
      return jsonError("Invalid request body.", 400);
    }

    name = (body.name || "").trim();
    mode = (body.mode || "PROPOSAL") as Mode;
    templateRaw = body.templateText || "";
    callRaw = body.callText || "";
    instructionsRaw = body.instructionsText || "";
  }

  if (!name || !templateRaw.trim()) {
    return jsonError("Missing required fields: name and template are required.", 400);
  }

    const sectionDefs = parseTemplateIntoSections(templateRaw);
    const extracted = await extractInstructionsWithAI({
      callText: callRaw,
      instructionsText: instructionsRaw,
      sectionTitles: sectionDefs.map((s) => s.title)
    });

    const project = await prisma.project.create({
      data: {
        name,
        mode,
        templateRaw,
        callRaw,
        instructionsRaw,
        extractedInstructionsJSON: extracted,
        sections: {
          create: sectionDefs.map((s) => ({
            title: s.title,
            order: s.order
          }))
        }
      },
      select: { id: true }
    });

    return NextResponse.json({ id: project.id });
  } catch (err: any) {
    const message =
      err?.message ||
      (typeof err === "string" ? err : "Server error. Check the Codespace terminal for details.");
    console.error("Project creation failed:", message, err);
    return jsonError(message, 500);
  }
}

