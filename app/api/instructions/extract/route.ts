import { NextResponse } from "next/server";
import { extractInstructionsWithAI } from "@/lib/ai";
import { basicRateLimit, getRequestIp } from "@/lib/rateLimiter";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = getRequestIp(req.headers);
  if (!basicRateLimit(ip)) {
    return new NextResponse("Rate limit exceeded", { status: 429 });
  }

  const body = await req.json().catch(() => null) as {
    callText?: string;
    instructionsText?: string;
    sectionTitles?: string[];
  } | null;

  if (!body) {
    return new NextResponse("Invalid JSON body", { status: 400 });
  }

  const extracted = await extractInstructionsWithAI({
    callText: body.callText || "",
    instructionsText: body.instructionsText || "",
    sectionTitles: body.sectionTitles || []
  });

  return NextResponse.json(extracted);
}

