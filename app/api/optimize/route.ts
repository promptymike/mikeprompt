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

const CHAT_INSTRUCTIONS: Record<string, string> = {
  ChatGPT:
    "ChatGPT tends to be verbose, so add 'Be concise' constraints. It responds well to step-by-step instructions.",
  Claude:
    "Claude is excellent at following structured prompts with XML tags. Add format constraints. Remind it to not over-explain.",
  Gemini:
    "Gemini is prone to hallucination, so add 'Only use verified information' and 'If unsure, say so'. It benefits from very specific questions.",
  Copilot:
    "Copilot is slow and has limited context, so make the prompt ultra-concise and specific. Break complex tasks into smaller chunks.",
};

const PRODUCT_INSTRUCTIONS: Record<string, string> = {
  Email:
    "The output is an email — the prompt should specify tone, recipient, subject line, length, and call to action.",
  Excel:
    "The output is for Excel — the prompt should specify columns, data structure, formulas needed, and sample data format.",
  PowerPoint:
    "The output is for PowerPoint — the prompt should specify number of slides, audience, key message per slide, and visual style.",
  Document:
    "The output is a document — the prompt should specify sections, length, formatting, audience, and purpose.",
  General:
    "No specific output format constraints — optimize for clarity and precision.",
};

export async function POST(req: NextRequest) {
  const { prompt, role, goal, name, selectedChat, selectedProduct, lang } = await req.json();

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
    selectedChat: selectedChat || null,
    selectedProduct: selectedProduct || null,
    lang: lang || null,
  });

  const contextParts: string[] = [];
  if (role) contextParts.push(`User role: ${role}`);
  if (goal) contextParts.push(`User goal: ${goal}`);
  if (name) contextParts.push(`User name: ${name}`);

  const chat = selectedChat || "ChatGPT";
  const product = selectedProduct || "General";
  contextParts.push(`Target AI: ${chat}. ${CHAT_INSTRUCTIONS[chat] ?? ""}`);
  contextParts.push(`Output type: ${product}. ${PRODUCT_INSTRUCTIONS[product] ?? ""}`);
  if (lang === "pl") {
    contextParts.push("IMPORTANT: Respond entirely in Polish (język polski). The improved prompt should also be written in Polish.");
  }

  const contextBlock = `\n\nContext:\n${contextParts.join("\n")}`;
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
    return NextResponse.json({ result: raw, fixes: [] });
  }

  console.log("[optimize] success, fixes:", parsed.fixes);
  return NextResponse.json({ result: parsed.optimized, fixes: parsed.fixes ?? [] });
}
