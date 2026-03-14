import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { checkRateLimit } from "@/lib/rateLimit";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(20, "60 s"),
  prefix: "rl:recommend",
});

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT = `You are an expert AI model advisor. Your job is to recommend the top 3 AI models for a given task from this list:

Available models:
1. Claude Sonnet 4 (Anthropic) — best for complex reasoning, long documents, confidential data, coding. Privacy-first.
2. Claude Haiku 3 (Anthropic) — best for fast, high-volume tasks, summarization, chatbots. Very cheap.
3. ChatGPT 4o (OpenAI) — best for creative writing, code, brainstorming, general use. Has web search and plugins.
4. Gemini 1.5 Pro (Google) — best for very long documents (1M context), web research, Google Workspace, multimodal.
5. Microsoft Copilot (Microsoft) — best for Microsoft 365 users: Word, Excel, Teams, Outlook. Flat-rate enterprise.
6. Perplexity Pro (Perplexity AI) — best for web research with citations, fact-checking, current events.

For each task, analyze the requirements and return your top 3 recommendations ranked by suitability.

Respond ONLY with valid JSON (no markdown, no backticks):
{
  "recommendations": [
    {
      "model": "Claude Sonnet 4",
      "score": 95,
      "reason": "one clear sentence why this is a top pick for this task",
      "keyFeature": "the single most relevant feature or capability for this task",
      "warningIfAny": "optional: mention if there is a notable limitation for this specific use case"
    }
  ],
  "taskCategory": "one of: Writing, Coding, Research, Analysis, Creative, Data, Communication, Other"
}

Rules:
- Always return exactly 3 recommendations
- Score is 0-100, the top pick should be 85+
- Keep reason and keyFeature concise (under 15 words)
- Only include warningIfAny if there's a genuinely relevant concern
- Match user's language: if task is in Polish, respond in Polish
- taskCategory must be one of the listed values

CRITICAL: Respond ONLY with raw JSON. No markdown, no backticks, no \`\`\`json fences.
Start your response with { and end with }. Nothing before or after the JSON object.`;

interface Recommendation {
  model: string;
  score: number;
  reason: string;
  keyFeature: string;
  warningIfAny?: string;
}

interface RecommendResponse {
  recommendations: Recommendation[];
  taskCategory: string;
}

interface AnthropicResponse {
  content?: { text: string }[];
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { success } = await ratelimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { error: "ratelimit", message: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const { allowed } = checkRateLimit(ip, 10, 60_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "ratelimit", message: "Too many requests. Please wait a moment." },
      { status: 429, headers: { "Retry-After": "60" } }
    );
  }

  const body = await req.json() as { task?: string; lang?: string };
  const { task, lang } = body;

  if (!task || typeof task !== "string" || !task.trim()) {
    return NextResponse.json({ error: "Invalid task" }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[recommend-model] ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const userMessage = lang === "pl"
    ? `Zadanie: ${task}\n\nOdpowiedz po polsku.`
    : `Task: ${task}`;

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
        max_tokens: 800,
        system: [
          {
            type: "text",
            text: SYSTEM_PROMPT,
            cache_control: { type: "ephemeral" },
          },
        ],
        messages: [{ role: "user", content: userMessage }],
      }),
    });
  } catch (err) {
    console.error("[recommend-model] Fetch failed:", err);
    return NextResponse.json({ error: "Network error" }, { status: 502 });
  }

  if (response.status === 429) {
    console.warn("[recommend-model] Rate limited by Anthropic API");
    return NextResponse.json({ error: "ratelimit" }, { status: 429 });
  }

  if (!response.ok) {
    const errText = await response.text();
    console.error(`[recommend-model] Anthropic API error ${response.status}:`, errText);
    console.error(`[recommend-model] Model used: ${ANTHROPIC_MODEL}`);
    return NextResponse.json(
      { error: `Upstream API error: ${response.status}` },
      { status: 502 }
    );
  }

  const data = await response.json() as AnthropicResponse;
  const raw = data.content?.[0]?.text;

  if (!raw) {
    console.error("[recommend-model] Unexpected response shape:", JSON.stringify(data));
    return NextResponse.json({ error: "Empty response from API" }, { status: 502 });
  }

  const cleanRaw = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: RecommendResponse;
  try {
    parsed = JSON.parse(cleanRaw) as RecommendResponse;
  } catch {
    console.error("[recommend-model] JSON parse failed, raw:", raw.slice(0, 300));
    return NextResponse.json({
      recommendations: [
        {
          model: "ChatGPT",
          score: 80,
          reason: "Good all-around choice for most tasks",
          keyFeature: "Versatile and widely used",
          warningIfAny: undefined,
        },
      ],
      taskCategory: "General",
    });
  }

  return NextResponse.json({
    recommendations: parsed.recommendations ?? [],
    taskCategory: parsed.taskCategory ?? "Other",
  });
}
