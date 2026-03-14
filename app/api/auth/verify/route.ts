import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, token } = await req.json() as { email?: string; token?: string };

  if (!email?.includes("@") || !token) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // TODO: Verify token against stored token in database
  // On dev: any "123456" code passes as a placeholder
  const isDev = process.env.NODE_ENV === "development";
  const isValid = isDev && token === "123456";

  if (!isValid) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  return NextResponse.json({
    success: true,
    user: { email, plan: "free", createdAt: new Date().toISOString() },
  });
}
