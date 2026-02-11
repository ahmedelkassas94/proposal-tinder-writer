import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { basicRateLimit, getRequestIp } from "@/lib/rateLimiter";
import { rewriteSectionWithAI } from "@/lib/ai";
import { ExtractedInstructions } from "@/lib/types";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const messages = await prisma.chatMessage.findMany({
    where: { sectionId: params.id },
    orderBy: { createdAt: "asc" }
  });

  return NextResponse.json({
    messages: messages.map((m) => ({
      id: m.id,
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content
    }))
  });
}

export async function POST(req: Request, { params }: Params) {
  const ip = getRequestIp(req.headers);
  if (!basicRateLimit(ip)) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  const body = await req.json().catch(() => null) as {
    projectId?: string;
    sectionId?: string;
    userMessage?: string;
  } | null;

  if (!body || !body.projectId || !body.sectionId || !body.userMessage) {
    return new NextResponse("Missing fields", { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: body.projectId }
  });
  if (!project) return new NextResponse("Project not found", { status: 404 });

  const section = await prisma.section.findUnique({
    where: { id: body.sectionId }
  });
  if (!section) return new NextResponse("Section not found", { status: 404 });

  const extracted = project.extractedInstructionsJSON as unknown as ExtractedInstructions;
  const sectionInstruction = extracted.sections.find(
    (s) =>
      s.sectionTitle.toLowerCase() ===
      section.title.toLowerCase()
  );

  const otherSections = await prisma.section.findMany({
    where: { projectId: project.id, NOT: { id: section.id } },
    orderBy: { order: "asc" }
  });

  const otherSummaries = otherSections.map(
    (s) => `${s.title}: ${s.content.slice(0, 200)}`
  );

  // Global general-chat messages (no sectionId) become additional instructions
  const generalMessages = await prisma.chatMessage.findMany({
    where: { projectId: project.id, sectionId: null },
    orderBy: { createdAt: "asc" }
  });

  const generalText = generalMessages
    .map((m) => `${m.role === "assistant" ? "Assistant" : "User"}: ${m.content}`)
    .join("\n");

  const extraPromptParts: string[] = [];
  if (generalText) {
    extraPromptParts.push(
      "Global writing style and project-wide instructions from earlier general chat:\n" +
        generalText
    );
  }
  extraPromptParts.push(
    "Latest user message for this specific section:\n" + body.userMessage
  );
  const combinedExtraPrompt = extraPromptParts.join("\n\n");

  const userDbMessage = await prisma.chatMessage.create({
    data: {
      projectId: project.id,
      sectionId: section.id,
      role: "user",
      content: body.userMessage
    }
  });

  const newText = await rewriteSectionWithAI({
    mode: project.mode,
    sectionTitle: section.title,
    currentDraft: section.content,
    generalInstructions: extracted.generalInstructions,
    sectionInstructions: sectionInstruction,
    templateSectionGuidance: undefined,
    otherSectionsSummaries: otherSummaries,
    action: "Refine based on the latest user message and global project instructions.",
    userExtraPrompt: combinedExtraPrompt
  });

  await prisma.section.update({
    where: { id: section.id },
    data: { content: newText }
  });

  const assistantDbMessage = await prisma.chatMessage.create({
    data: {
      projectId: project.id,
      sectionId: section.id,
      role: "assistant",
      content: newText
    }
  });

  return NextResponse.json({
    assistantMessage: {
      id: assistantDbMessage.id,
      role: "assistant",
      content: assistantDbMessage.content
    },
    newSectionContent: newText
  });
}

