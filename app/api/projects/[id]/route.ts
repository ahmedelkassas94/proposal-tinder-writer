import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { sections: true }
  });

  if (!project) {
    return new NextResponse("Not found", { status: 404 });
  }

  return NextResponse.json(project);
}

