import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, role, goal, name } = await req.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[optimize] ANTHROPIC_API_KEY is not set");
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  console.log("[optimize] request", {
    prompt: prompt.slice(0, 120),
    role: role || null,
    goal: goal || null,
    name: name || null,
  });

  const contextParts: string[] = [];
  if (role) contextParts.push(`User role: ${role}`);
  if (goal) contextParts.push(`User goal: ${goal}`);
  if (name) contextParts.push(`User name: ${name}`);
  const contextBlock =
    contextParts.length > 0
      ? `\n\nContext about the user:\n${contextParts.join("\n")}`
      : "";

  const userMessage = `${prompt}${contextBlock}`;

  let response: Response;
  try {
    response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        system:
          "You are Mike. Rewrite the user's prompt to be clear, specific and structured. Output ONLY the improved prompt. Max 150 words. Match user's language.",
        messages: [{ role: "user", content: userMessage }],
      }),
    });
  } catch (err) {
    console.error("[optimize] Fetch failed:", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[optimize] Anthropic API error ${response.status}:`, errText);
    return NextResponse.json(
      { error: `Upstream API error: ${response.status}` },
      { status: 502 }
    );
  }

  const data = await response.json();
  console.log("[optimize] response", JSON.stringify(data).slice(0, 200));

  const result = data.content?.[0]?.text;
  if (!result) {
    console.error("[optimize] Unexpected response shape:", JSON.stringify(data));
    return NextResponse.json(
      { error: "Empty response from API" },
      { status: 502 }
    );
  }

  return NextResponse.json({ result });
}
