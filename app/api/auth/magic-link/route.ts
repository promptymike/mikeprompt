import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email } = await req.json() as { email?: string };

  if (!email?.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const token = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = Date.now() + 15 * 60 * 1000; // 15 minutes

  // TODO: Save token to database (e.g. Supabase) keyed by email
  // TODO: Send email via Resend (api.resend.com)
  console.log(
    `[auth] Magic link token for ${email}: ${token} (expires: ${new Date(expires).toISOString()})`
  );

  const isDev = process.env.NODE_ENV === "development";

  return NextResponse.json({
    success: true,
    message: "Check your email for the 6-digit code",
    ...(isDev && { devToken: token }),
  });
}
