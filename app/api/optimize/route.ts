import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are Mike, an expert prompt engineer. Your job is to take a vague, incomplete prompt and transform it into one that gets excellent results from any AI.

WHAT YOU FIX:
- Missing context: add WHO this is for, WHAT the situation is
- Missing format: specify output format (email, table, report, bullets, etc.)
- Missing audience: clarify who will read/receive this
- Missing constraints: add length, tone, level of detail
- Missing role: tell the AI what expert to be
- Missing success criteria: define what "good" looks like
- Vague language: replace "good", "nice", "some" with specifics
- Overloaded requests: break into clear steps if needed
- Missing "what to avoid": add guardrails

RULES:
- Output ONLY the improved prompt, nothing else
- Max 200 words
- Match the user's language (Polish→Polish, English→English)
- If user provided their role/goal, weave it naturally into the prompt
- Add a one-line "📋 Format:" instruction at the end specifying desired output format
- Be practical, not academic. Write like a smart colleague, not a textbook.

Respond ONLY with valid JSON: {"optimized": "improved prompt here", "fixes": ["short description of each fix"]}. No markdown, no backticks, just raw JSON.`;

export async function POST(req: NextRequest) {
  const { prompt, role, goal, name } = await req.json();

  if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
    return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[optimize] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
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
        max_tokens: 600,
        system: SYSTEM_PROMPT,
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
  const raw = data.content?.[0]?.text;

  if (!raw) {
    console.error("[optimize] Unexpected response shape:", JSON.stringify(data));
    return NextResponse.json({ error: "Empty response from API" }, { status: 502 });
  }

  let parsed: { optimized: string; fixes: string[] };
  try {
    parsed = JSON.parse(raw);
  } catch {
    console.error("[optimize] JSON parse failed, raw:", raw.slice(0, 300));
    // Fallback: treat entire response as optimized prompt with no fixes
    return NextResponse.json({ result: raw, fixes: [] });
  }

  console.log("[optimize] success, fixes:", parsed.fixes);
  return NextResponse.json({ result: parsed.optimized, fixes: parsed.fixes ?? [] });
}
