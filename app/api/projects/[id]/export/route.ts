import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";

type Params = { params: { id: string } };

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: Params) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { sections: { orderBy: { order: "asc" } }, exportLogs: true }
  });

  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, "0");
  const d = String(today.getDate()).padStart(2, "0");

  const lastTrial =
    project.exportLogs.length > 0
      ? Math.max(...project.exportLogs.map((e) => e.trialNumber))
      : 0;
  const trialNumber = lastTrial + 1;

  const projectNameSanitized = project.name.replace(/\s+/g, "");
  const filename = `${projectNameSanitized}_${y}-${m}-${d}_rev${trialNumber}.docx`;

  const sections = project.sections;

  const templateHasPlaceholders = /\{\{[^}]+\}\}/.test(project.templateRaw);

  let docSections: Paragraph[] = [];

  if (templateHasPlaceholders) {
    let text = project.templateRaw;
    for (const s of sections) {
      const placeholder = `{{${s.title}}}`;
      if (text.includes(placeholder)) {
        text = text.replace(placeholder, s.content || "");
      }
    }
    docSections = text.split(/\r?\n/).map(
      (line) =>
        new Paragraph({
          children: [new TextRun({ text: line })]
        })
    );
  } else {
    for (const s of sections) {
      docSections.push(
        new Paragraph({
          text: s.title,
          heading: HeadingLevel.HEADING_1
        })
      );
      const lines = (s.content || "").split(/\r?\n/);
      for (const line of lines) {
        docSections.push(
          new Paragraph({
            children: [new TextRun({ text: line })]
          })
        );
      }
      docSections.push(new Paragraph({ text: "" }));
    }
  }

  const doc = new Document({
    sections: [
      {
        children: docSections
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);

  await prisma.exportLog.create({
    data: {
      projectId: project.id,
      trialNumber,
      filename
    }
  });

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`
    }
  });
}

