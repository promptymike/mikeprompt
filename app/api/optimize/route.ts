import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

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

ADDITIONALLY, after optimizing the prompt, always recommend the best AI tool for this specific task.

TOOL SELECTION RULES:
- Claude → structured documents, analysis, long-form writing, following complex instructions, confidential data (nothing stored)
- ChatGPT → creative writing, brainstorming, code, general questions, plugins/tools
- Gemini → research requiring current web data, Google Workspace integration, multimodal (images+text)
- Copilot → Microsoft 365 users, Word/Excel/Teams integration, corporate environment
- Perplexity → fact-checking, research with sources, current events

If the user has selected a specific tool and it differs from your recommendation, acknowledge their choice and explain why your recommendation might be better while validating their choice.

OUTPUT FORMAT — respond ONLY with raw JSON. No markdown, no backticks, no \`\`\`json fences.
Start your response with { and end with }. Nothing before or after the JSON object.
{
  "optimized": "improved prompt here",
  "fixes": ["short description of each fix"],
  "recommendation": {
    "bestTool": "Claude",
    "reason": "one sentence why this tool is best for this specific task",
    "tip": "one concrete usage tip for getting the best result",
    "alternativeTool": "ChatGPT",
    "alternativeReason": "one sentence why this is a good alternative"
  }
}`;

const CHAT_INSTRUCTIONS: Record<string, string> = {
  ChatGPT:
    "ChatGPT tends to be verbose, so add 'Be concise' constraints. It responds well to step-by-step instructions.",
  Claude:
    "Claude is excellent at following structured prompts with XML tags. Add format constraints. Remind it to not over-explain.",
  Gemini:
    "Gemini is prone to hallucination, so add 'Only use verified information' and 'If unsure, say so'. It benefits from very specific questions.",
  Copilot:
    "Copilot is slow and has limited context, so make the prompt ultra-concise and specific. Break complex tasks into smaller chunks.",
  Perplexity:
    "Perplexity excels at web research. Ask it to cite sources and specify the time range of information you need.",
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

interface ParsedResponse {
  optimized: string;
  fixes: string[];
  recommendation?: {
    bestTool: string;
    reason: string;
    tip: string;
    alternativeTool?: string;
    alternativeReason?: string;
  };
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(ip, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "ratelimit", message: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { prompt, role, goal, name, selectedChat, selectedProduct, lang, profile } = await req.json() as {
    prompt: string;
    role?: string;
    goal?: string;
    name?: string;
    selectedChat?: string;
    selectedProduct?: string;
    lang?: string;
    profile?: Record<string, unknown>;
  };

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

  // User profile context (from saved profile sidebar)
  if (profile && typeof profile === "object") {
    const parts: string[] = [];
    if (typeof profile.name === "string" && profile.name && !name) parts.push(`Name: ${profile.name}`);
    if (typeof profile.role === "string" && profile.role && !role) parts.push(`Role: ${profile.role}`);
    if (typeof profile.industry === "string" && profile.industry) parts.push(`Industry: ${profile.industry}`);
    if (typeof profile.usage === "string" && profile.usage) parts.push(`Uses AI for: ${profile.usage}`);
    if (typeof profile.challenge === "string" && profile.challenge) parts.push(`Biggest challenge: ${profile.challenge}`);
    if (typeof profile.aiLevel === "string" && profile.aiLevel) parts.push(`AI experience level: ${profile.aiLevel}`);
    if (Array.isArray(profile.apps) && profile.apps.length > 0) parts.push(`Works in: ${(profile.apps as string[]).join(", ")}`);
    if (parts.length > 0) {
      contextParts.push(`User profile context: ${parts.join(", ")}. Use this to make the optimized prompt more relevant to their specific situation.`);
    }
  }

  const chat = selectedChat || "ChatGPT";
  const product = selectedProduct || "General";
  contextParts.push(`User selected AI tool: ${chat}. ${CHAT_INSTRUCTIONS[chat] ?? ""}`);
  contextParts.push(`Output type: ${product}. ${PRODUCT_INSTRUCTIONS[product] ?? ""}`);
  if (lang === "pl") {
    contextParts.push("IMPORTANT: Respond entirely in Polish (język polski). The improved prompt should also be written in Polish. All recommendation fields (reason, tip, alternativeReason) should also be in Polish.");
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
        "anthropic-beta": "prompt-caching-2024-07-31",
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 900,
        system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
        messages: [{ role: "user", content: userMessage }],
      }),
    });
  } catch (err) {
    console.error("[optimize] Fetch failed:", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[optimize] Anthropic error ${response.status}:`, errText);

    if (response.status === 429) {
      return NextResponse.json({ error: "ratelimit" }, { status: 429 });
    }
    if (response.status === 403) {
      return NextResponse.json({ error: "region_blocked" }, { status: 403 });
    }
    if (response.status === 529 || response.status === 503) {
      return NextResponse.json({ error: "overloaded" }, { status: 503 });
    }

    return NextResponse.json(
      { error: `upstream_${response.status}` },
      { status: 502 }
    );
  }

  const data = await response.json() as { content?: { text: string }[] };
  const raw = data.content?.[0]?.text;

  if (!raw) {
    console.error("[optimize] Unexpected response shape:", JSON.stringify(data));
    return NextResponse.json({ error: "Empty response from API" }, { status: 502 });
  }

  const cleanRaw = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: ParsedResponse;
  try {
    parsed = JSON.parse(cleanRaw) as ParsedResponse;
  } catch {
    console.error("[optimize] JSON parse failed, raw:", raw.slice(0, 300));
    return NextResponse.json({ result: raw, fixes: [], recommendation: null });
  }

  console.log("[optimize] success, fixes:", parsed.fixes);
  return NextResponse.json({
    result: parsed.optimized,
    fixes: parsed.fixes ?? [],
    recommendation: parsed.recommendation ?? null,
  });
}
