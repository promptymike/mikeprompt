import { NextRequest } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { anonymizeText } from "@/lib/anonymize";

const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

const SYSTEM_PROMPT_OPTIMIZE = `You are Mike, an expert prompt engineer. Your job is to take a vague, incomplete prompt and transform it into one that gets excellent results from any AI.

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

OUTPUT FORMAT — respond ONLY with raw JSON. No markdown, no backticks, no \`\`\`json fences.
Start your response with { and end with }. Nothing before or after the JSON object.
{
  "optimized": "improved prompt here"
}`;

const MIKE_AGENT_SYSTEM_PROMPT_PL = `Jesteś Mike – elitarny polski agent AI wyspecjalizowany w administracji, księgowości i komunikacji biznesowej. Jesteś prawą ręką asystentek, księgowych i managerów w Polsce.

ZASADY:
1. JĘZYK: Piszesz perfekcyjną, profesjonalną polszczyzną. Unikasz angielskich zapożyczeń. Jesteś uprzejmy i konkretny.
2. KONTEKST: Znasz polskie realia — VAT, PIT, CIT, ZUS, KAS, KSH. Pisma do urzędów formatujesz poprawnie (miejscowość, data, nagłówek).
3. BEZPIECZEŃSTWO: Gdy widzisz dane wrażliwe (NIP, PESEL, kwoty klientów) — przypominasz o anonimizacji.
4. STYL: Jeśli prośba jest niejasna — zadajesz maksymalnie 2 pytania pomocnicze.
5. ZAKRES: Twoja domena to biuro. Jeśli ktoś prosi o coś niezwiązanego z pracą, grzecznie wracasz do tematu.
6. FORMAT: Długie dokumenty formatujesz z nagłówkami i akapitami. Krótkie odpowiedzi piszesz bez zbędnego formatowania.
7. DAWAJ GOTOWCE: Nie pytaj 'Czy mam przygotować pismo?'. Po prostu je napisz. Użytkownik chce gotowego tekstu do skopiowania jednym kliknięciem — nie propozycji pomocy.

KOMPETENCJE:
- Maile profesjonalne, windykacyjne, urzędowe
- Pisma do ZUS, KAS, US
- Protokoły ze spotkań
- Raporty i podsumowania
- Tabele i struktury do Excela
- Tłumaczenia biznesowe PL/EN

Jesteś Mike. Pomagasz wyjść z biura o 16:00.`;

const MIKE_AGENT_SYSTEM_PROMPT_EN = `You are Mike – an elite AI agent specializing in business administration, accounting, and professional communication. You are the right hand of assistants, accountants, and finance managers.

RULES:
1. LANGUAGE: Write in professional, precise English. Be polite but concrete.
2. CONTEXT: You understand business realities — invoices, contracts, formal correspondence, financial reports.
3. SAFETY: When you see sensitive data (tax IDs, amounts, client names) — remind the user about anonymization.
4. STYLE: If a request is unclear — ask maximum 2 clarifying questions.
5. SCOPE: Your domain is the office. If someone asks for something unrelated to work, politely redirect.
6. FORMAT: Long documents use proper headers and paragraphs. Short answers are concise.
7. DELIVER IMMEDIATELY: Don't ask 'Shall I prepare this for you?'. Just do it. The user wants ready-to-copy text, not an offer to help.

SKILLS: Professional emails, formal letters, meeting minutes, reports, Excel structures, PL/EN business translation.

You are Mike. You help people leave the office at 5pm.`;

function buildProfileContext(profile: Record<string, unknown>): string {
  const parts: string[] = [];
  if (typeof profile.name === "string" && profile.name) parts.push(`Name: ${profile.name}`);
  if (typeof profile.role === "string" && profile.role) parts.push(`Role: ${profile.role}`);
  if (typeof profile.industry === "string" && profile.industry) parts.push(`Industry: ${profile.industry}`);
  if (typeof profile.usage === "string" && profile.usage) parts.push(`Uses AI for: ${profile.usage}`);
  if (typeof profile.challenge === "string" && profile.challenge) parts.push(`Biggest challenge: ${profile.challenge}`);
  if (typeof profile.aiLevel === "string" && profile.aiLevel) parts.push(`AI experience level: ${profile.aiLevel}`);
  if (Array.isArray(profile.apps) && profile.apps.length > 0) parts.push(`Works in: ${(profile.apps as string[]).join(", ")}`);
  return parts.length > 0 ? `\n\nUser context: ${parts.join(", ")}.` : "";
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  const { allowed } = checkRateLimit(ip, 20, 60_000);
  if (!allowed) {
    return new Response(JSON.stringify({ error: "ratelimit" }), {
      status: 429,
      headers: { "Content-Type": "application/json", "Retry-After": "60" },
    });
  }

  const { messages, profile, lang, anonymize } = await req.json() as {
    messages: { role: string; content: string }[];
    profile?: Record<string, unknown>;
    lang?: string;
    anonymize?: boolean;
  };

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "Invalid messages" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // ── Step A: Silently polish the last user message ──────────────────────────
  const lastUserIdx = [...messages].reverse().findIndex((m) => m.role === "user");
  const lastUserMessage = lastUserIdx >= 0 ? messages[messages.length - 1 - lastUserIdx] : null;

  let polishedContent = lastUserMessage?.content ?? "";

  if (lastUserMessage) {
    try {
      let textToPolish = lastUserMessage.content;
      if (anonymize) {
        const { anonymized } = anonymizeText(textToPolish);
        textToPolish = anonymized;
      }

      const optimizeResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 400,
          system: SYSTEM_PROMPT_OPTIMIZE,
          messages: [{ role: "user", content: textToPolish }],
        }),
      });

      if (optimizeResp.ok) {
        const data = await optimizeResp.json() as { content?: { text: string }[] };
        const raw = data.content?.[0]?.text ?? "";
        const clean = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
        const parsed = JSON.parse(clean) as { optimized?: string };
        if (parsed.optimized) polishedContent = parsed.optimized;
      }
    } catch {
      // graceful fallback — use original
    }
  }

  // Replace last user message with polished version
  const agentMessages = messages.map((m, i) =>
    i === messages.length - 1 - (lastUserIdx >= 0 ? 0 : -1) &&
    m === lastUserMessage
      ? { ...m, content: polishedContent }
      : m
  );

  // ── Step B: Stream the agent response ─────────────────────────────────────
  const isPL = lang === "pl";
  const baseSystemPrompt = isPL ? MIKE_AGENT_SYSTEM_PROMPT_PL : MIKE_AGENT_SYSTEM_PROMPT_EN;
  const profileCtx = profile ? buildProfileContext(profile) : "";
  const agentSystemPrompt = baseSystemPrompt + profileCtx;

  // Filter only user/assistant messages (no thinking role)
  const filteredMessages = agentMessages.filter(
    (m) => m.role === "user" || m.role === "assistant"
  );

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      const streamResp = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 1500,
          stream: true,
          system: agentSystemPrompt,
          messages: filteredMessages,
        }),
      });

      if (!streamResp.ok || !streamResp.body) {
        const errText = await streamResp.text();
        console.error("[chat] Anthropic stream error:", streamResp.status, errText);
        await writer.write(encoder.encode("data: [DONE]\n\n"));
        await writer.close();
        return;
      }

      const reader = streamResp.body.getReader();
      const dec = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = dec.decode(value);
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const evt = JSON.parse(data) as {
              type: string;
              delta?: { type: string; text: string };
            };
            if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
              // Encode text: escape newlines so SSE lines stay intact
              const text = evt.delta.text;
              await writer.write(encoder.encode(`data: ${encodeURIComponent(text)}\n\n`));
            }
          } catch {
            // skip malformed SSE lines
          }
        }
      }
    } catch (err) {
      console.error("[chat] stream error:", err);
    } finally {
      await writer.write(encoder.encode("data: [DONE]\n\n"));
      await writer.close();
    }
  })();

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
