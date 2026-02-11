import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
  const body = await req.json().catch(() => null) as { content?: string } | null;
  if (!body || typeof body.content !== "string") {
    return new NextResponse("Invalid body", { status: 400 });
  }

  await prisma.section.update({
    where: { id: params.id },
    data: { content: body.content }
  });

  return NextResponse.json({ ok: true });
}

export async function GET(_req: Request, { params }: Params) {
  const section = await prisma.section.findUnique({
    where: { id: params.id }
  });

  if (!section) return new NextResponse("Not found", { status: 404 });

  return NextResponse.json(section);
}

