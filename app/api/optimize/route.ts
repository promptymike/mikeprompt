import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("[optimize] GEMINI_API_KEY is not set");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const body = {
    system_instruction: {
      parts: [
        {
          text: "You are Mike, a prompt optimizer. Take the user's vague prompt and return ONLY an improved, structured version. Match the user's language. No explanations.",
        },
      ],
    },
    contents: [
      {
        role: "user",
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: { maxOutputTokens: 1000 },
  };

  console.log("[optimize] Calling Gemini API for prompt:", prompt.slice(0, 80));

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[optimize] Fetch failed:", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[optimize] Gemini API error ${response.status}:`, errText);
    return NextResponse.json(
      { error: `Upstream API error: ${response.status}` },
      { status: 502 }
    );
  }

  const data = await response.json();
  console.log("[optimize] Gemini response:", JSON.stringify(data).slice(0, 200));

  const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!result) {
    console.error("[optimize] Unexpected response shape:", JSON.stringify(data));
    return NextResponse.json(
      { error: "Empty response from API" },
      { status: 502 }
    );
  }

  return NextResponse.json({ result });
}
