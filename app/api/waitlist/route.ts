import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkRateLimit } from "@/lib/rateLimit";

const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");

function appendToWaitlist(entry: Record<string, string | null>) {
  let existing: Record<string, string | null>[] = [];
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      existing = JSON.parse(fs.readFileSync(WAITLIST_FILE, "utf-8"));
    }
  } catch {
    existing = [];
  }
  existing.push(entry);
  fs.writeFileSync(WAITLIST_FILE, JSON.stringify(existing, null, 2), "utf-8");
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(ip, 3, 3_600_000);
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { email, role, goal, name } = await req.json();

  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const entry = {
    timestamp: new Date().toISOString(),
    email,
    role: role || null,
    goal: goal || null,
    name: name || null,
  };

  console.log("[waitlist] new signup", entry);

  try {
    appendToWaitlist(entry);
  } catch (err) {
    console.error("[waitlist] Failed to write to file:", err);
    // Don't fail the request — signup still counted in logs
  }

  return NextResponse.json({ success: true });
}
