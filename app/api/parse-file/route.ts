import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return new NextResponse("No file uploaded.", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const name = file.name.toLowerCase();

  try {
    if (name.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      return NextResponse.json({ text: data.text || "" });
    }

    if (name.endsWith(".docx") || name.endsWith(".doc")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      return NextResponse.json({ text: result.value || "" });
    }

    const text = buffer.toString("utf-8");
    return NextResponse.json({ text });
  } catch (e) {
    console.error("File parse error", e);
    return new NextResponse(
      "Failed to parse file. Please paste text manually.",
      { status: 400 }
    );
  }
}

