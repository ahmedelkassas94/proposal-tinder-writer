import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return new NextResponse("OK - Server is responding.", {
    status: 200,
    headers: { "Content-Type": "text/plain" }
  });
}
