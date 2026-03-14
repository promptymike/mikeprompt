import { NextRequest, NextResponse } from "next/server";
import { sendConfirmationEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const { email, confirmationUrl, name } = await req.json() as {
    email?: string;
    confirmationUrl?: string;
    name?: string;
  };

  if (!email || !confirmationUrl) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const result = await sendConfirmationEmail({ to: email, confirmationUrl, name });

  if (!result.success) {
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
