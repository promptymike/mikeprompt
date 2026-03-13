import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: `You are Mike, an expert prompt optimizer. Take the user's rough/vague prompt and transform it into a clear, structured, professional prompt that will get much better results from any AI model.
Rules:
- Keep the core intent but add: specific context, desired format, constraints, and quality markers
- Make it structured but natural — not robotic
- If the prompt is in Polish, respond in Polish. If in English, respond in English.
- ONLY output the optimized prompt, nothing else. No explanations, no preamble, no "Here's the optimized version:"
- Keep it concise but comprehensive — don't pad unnecessarily
User's prompt: "${prompt.replace(/"/g, '\\"')}"`,
        },
      ],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: "Upstream API error" },
      { status: 502 }
    );
  }

  const data = await response.json();
  const result = data.content?.[0]?.text ?? "Something went wrong.";
  return NextResponse.json({ result });
}
