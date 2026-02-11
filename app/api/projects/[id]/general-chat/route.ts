import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { basicRateLimit, getRequestIp } from "@/lib/rateLimiter";
import { chatCompletion } from "@/lib/ai";

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  const messages = await prisma.chatMessage.findMany({
    where: { projectId: params.id, sectionId: null },
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
    userMessage?: string;
  } | null;

  if (!body || !body.userMessage || !body.userMessage.trim()) {
    return new NextResponse("Missing userMessage", { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id }
  });
  if (!project) {
    return new NextResponse("Project not found", { status: 404 });
  }

  const existing = await prisma.chatMessage.findMany({
    where: { projectId: project.id, sectionId: null },
    orderBy: { createdAt: "asc" }
  });

  // Persist user message first
  const userDbMessage = await prisma.chatMessage.create({
    data: {
      projectId: project.id,
      sectionId: null,
      role: "user",
      content: body.userMessage
    }
  });

  const systemPrompt =
    project.mode === "PROPOSAL"
      ? "You are an expert proposal-writing coach. You help the user define global writing style, tone, and constraints for this project. You respond concisely."
      : "You are an expert persuasive dating-message coach. You help the user define global style, tone, and constraints for this project. You respond concisely.";

  const historyForModel = existing.map((m) => ({
    role: m.role === "assistant" ? "assistant" : "user",
    content: m.content
  }));

  const assistantText = await chatCompletion({
    systemPrompt,
    userMessages: [
      ...historyForModel,
      { role: "user", content: body.userMessage }
    ],
    temperature: 0.4
  });

  const assistantDbMessage = await prisma.chatMessage.create({
    data: {
      projectId: project.id,
      sectionId: null,
      role: "assistant",
      content: assistantText
    }
  });

  return NextResponse.json({
    assistantMessage: {
      id: assistantDbMessage.id,
      role: "assistant",
      content: assistantDbMessage.content
    }
  });
}

