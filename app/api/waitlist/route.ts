import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, role, goal, name } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  console.log("[waitlist] new signup", {
    timestamp: new Date().toISOString(),
    email,
    role: role || null,
    goal: goal || null,
    name: name || null,
  });

  return NextResponse.json({ success: true });
}
