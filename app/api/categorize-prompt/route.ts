import { NextRequest } from "next/server";

const CATEGORIES = ["faktury", "podatki", "ZUS", "kadry", "korespondencja", "delegacje", "inne"];

export async function POST(req: NextRequest) {
  const { text } = await req.json() as { text?: string };
  if (!text) {
    return new Response(JSON.stringify({ category: "inne" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ category: "inne" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const resp = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 20,
        system: `Categorize this Polish business prompt into exactly one category. Return ONLY the category name, nothing else. Categories: ${CATEGORIES.join(", ")}`,
        messages: [{ role: "user", content: text.slice(0, 500) }],
      }),
    });

    if (resp.ok) {
      const data = await resp.json() as { content?: { text: string }[] };
      const raw = data.content?.[0]?.text?.trim().toLowerCase() ?? "";
      const matched = CATEGORIES.find((c) => raw.includes(c));
      return new Response(JSON.stringify({ category: matched ?? "inne" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch { /* fall through */ }

  return new Response(JSON.stringify({ category: "inne" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
