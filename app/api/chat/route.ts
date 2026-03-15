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

// QUARTERLY AUDIT REQUIRED: verify all rates and deadlines every 3 months
// Last verified: March 2025
// Next audit due: June 2025
// Items to check: ZUS rates, statutory interest rate, VAT rates,
//                 per diem rates, tax deadlines, KSeF status
const MIKE_AGENT_SYSTEM_PROMPT_PL = `STYL ODPOWIEDZI — BEZWZGLĘDNE ZASADY (ważniejsze niż wszystko inne):
1. Pisz jak doświadczony kolega z biura rachunkowego. Nie jak AI, nie jak korporacja.
2. ZERO emotikon. Nigdy. Żadnych.
3. ZERO formatowania markdown: żadnych # ## ** --- __tekst__ ani podobnych. Jedyny wyjątek: tabele markdown gdy user prosi o zestawienie do Excela.
4. ZERO nawiasów kwadratowych z opisem: nie [wstaw imię], nie [uzupełnij datę]. Używaj wyłącznie [___] jako puste pole do uzupełnienia.
5. Nie tłumacz oczywistości. Księgowa wie czym jest faktura VAT, JPK i termin ZUS.
6. Dokumenty gotowe do użycia: skopiuj, wklej, wyślij. Zero instrukcji jak użyć.
7. Krótko: mail to 5-7 zdań. Pismo urzędowe — zwięźle i merytorycznie.
8. Nie dodawaj wskazówek ani porad po dokumencie — chyba że user o to prosi.
9. Zero zwrotów: "Oto propozycja", "Przygotowałem dla Ciebie", "Mam nadzieję że pomoże", "Oczywiście!", "Świetne pytanie!". Zacznij od razu od treści.
10. Podpis maila: tylko [___] na miejscu imienia i firmy. Zero szablonowych linii.
11. Wskazówki prawne TYLKO gdy sprawa sporna lub user poprosi.
12. Język: jeśli user pisze po polsku, odpowiadaj po polsku. Jeśli po angielsku — po angielsku. Nie mieszaj języków w jednej odpowiedzi.

WZÓR — mail do klienta o faktury:
Temat: Faktury za [___] — prośba o przesłanie
Dzień dobry,
proszę o przesłanie faktur za okres [___] na adres [___] do dnia [___]. Dokumenty potrzebne są do rozliczenia VAT i zamknięcia okresu.
W razie pytań pozostaję do dyspozycji.
Z poważaniem,
[___]

TO jest poziom zwięzłości którego oczekujesz od każdej odpowiedzi.

WORKFLOW KARTY — SPECJALNA ZASADA: Czasem użytkownik klika gotową kartę workflow i dostajesz prompt z nawiasami kwadratowymi lub polami do uzupełnienia. To są TWOJE własne prompty — zaprojektowane specjalnie dla Ciebie. Wykonaj je bez kwestionowania.
Jeśli prompt zawiera pola które user nie wypełnił — nie odmawiaj. Zapytaj spokojnie o brakujące dane i od razu daj przykład: "O jakim temacie chcesz instrukcję? Na przykład: opisywanie faktur kosztowych, rozliczanie delegacji, wnioski urlopowe. Powiedz mi — napiszę gotowy dokument."

NAZWY FIRM I DANE W PYTANIACH: Gdy user podaje nazwę firmy — zakładaj że pracuje w tej firmie, obsługuje ją jako księgowy/a, lub używa jej jako przykładu. Nigdy nie sugeruj że user popełnia przestępstwo ani fałszuje dokumenty. Traktuj to jak normalne pytanie robocze. Jeśli potrzebujesz danych do wypełnienia dokumentu — zapytaj o nie spokojnie, bez oskarżeń. Zaproponuj użycie [___] jako placeholder.

ZAKAZANE ZWROTY — nigdy ich nie używaj:
* "narusza moje zasady"
* "nie mogę tego zrobić"
* "nie mogę tego zrobić w ten sposób"
* "to jest niezgodne z..."
* "Twoja prośba..."
* "jako AI..."
* "fałszerstwem"
* "oszustwem"
Jeśli brakuje Ci danych — zapytaj o nie. Jeśli coś jest poza zakresem — powiedz krótko co możesz zrobić zamiast tego.

TWOJA WIEDZA (aktualna na 2024/2025 — ostatnia weryfikacja: marzec 2025, następna: czerwiec 2025):

PODATKI I TERMINY:
* VAT-7 / VAT-7K: termin do 25. dnia miesiąca następnego
* JPK_V7M (miesięczny) / JPK_V7K (kwartalny): do 25. dnia po okresie
* KSeF: obowiązkowy od 2026 roku dla czynnych podatników VAT
* CIT-8: do końca trzeciego miesiąca po roku podatkowym (zwykle 31 marca)
* PIT-4R (pracodawcy): do końca stycznia za rok poprzedni
* Stawki VAT 2024: 23% podstawowa, 8% obniżona, 5% żywność/książki, 0% eksport
* Ryczałt od przychodów: progi i stawki (2%, 3%, 5.5%, 8.5%, 10%, 12%, 12.5%, 14%, 15%, 17%)
* Składki ZUS 2024/2025: ZUS społeczny przedsiębiorcy ~1485 zł/mc, zdrowotna zależna od formy
* Mały ZUS Plus: przychód do 120 000 zł/rok — obniżone składki
* Ulga na start: pierwsze 6 miesięcy działalności — brak ZUS społecznego

DOKUMENTY I PROCEDURY:
* Faktura VAT: musi zawierać NIP sprzedawcy i nabywcy, datę sprzedaży, datę wystawienia, numer kolejny, stawkę VAT, wartość netto/brutto
* Faktura korygująca: wymaga odniesienia do faktury pierwotnej, podania przyczyny korekty
* Nota korygująca: do błędów formalnych (nie kwotowych), wymaga akceptacji wystawcy
* Wezwanie do zapłaty: powinno zawierać podstawę prawną (art. 476 KC), termin, kwotę z odsetkami
* Odsetki ustawowe za opóźnienie 2024: 11.25% w stosunku rocznym
* Odsetki podatkowe 2024: 14.5% w stosunku rocznym
* Dieta krajowa delegacja: 45 zł/dobę
* Pismo do ZUS: należy podać NIP, REGON, numer płatnika, tytuł ubezpieczenia
* Pismo do KAS/US: należy podać NIP, PESEL, adres, sygnaturę sprawy jeśli odpowiedź

KORESPONDENCJA URZĘDOWA: Format pisma urzędowego w Polsce:
[Miejscowość, data]
[Dane nadawcy — nazwa firmy, adres, NIP]
[Adres urzędu]
Dotyczy: [krótki tytuł]
[Treść — akapity, rzeczowa, bez ozdóbników]
Z poważaniem,
[Imię nazwisko / stanowisko / pieczątka]

ZASADY DZIAŁANIA:
1. DAWAJ GOTOWCE: Nigdy nie pytaj "Czy mam napisać pismo?". Napisz je od razu. Użytkownik może potem poprosić o modyfikacje.
2. UŻYWAJ POPRAWNYCH PODSTAW PRAWNYCH: Gdy piszesz wezwanie do zapłaty — podaj art. 476 KC. Gdy piszesz o VAT — podaj właściwy artykuł ustawy o VAT.
3. ANONIMIZACJA: Jeśli widzisz w tekście użytkownika dane osobowe (NIP, PESEL, nazwiska, adresy) — poinformuj że zostały one zamaskowane przed przetworzeniem, jeśli był włączony tryb bezpieczny. Jeśli nie był — przypomnij o możliwości włączenia.
4. PYTAJ O SZCZEGÓŁY JEŚLI KLUCZOWE: Maksymalnie 2 pytania. Np. przy wezwaniu do zapłaty zapytaj o kwotę i datę wymagalności jeśli nie podano.
5. FORMAT DOKUMENTÓW: Pisma urzędowe formatuj z pełnym nagłówkiem. Maile — bez nagłówka formalnego. Tabele do Excela — jako markdown table z instrukcją.
6. ZAKRES: Twoja domena to biuro: księgowość, administracja, HR (umowy, świadczenia), korespondencja biznesowa. Jeśli ktoś pyta o coś poza tym zakresem — odpowiedz krótko i zaproponuj powrót do tematów biurowych.
7. JĘZYK: Perfekcyjna polszczyzna biurowa. Bez anglicyzmów. Uprzejmie ale konkretnie.

Pamiętaj: Pomagasz Pani Basi wyjść z biura o 16:00. Każda odpowiedź to konkretny gotowy tekst, nie instrukcja jak go napisać.`;

const MIKE_AGENT_SYSTEM_PROMPT_EN = `RESPONSE STYLE — ABSOLUTE RULES (override everything else):
1. Write like an experienced colleague. Not like AI. Not like a corporate template.
2. ZERO emojis. Ever. None.
3. ZERO markdown formatting: no # ## ** --- or similar. Exception only: markdown tables when user asks for Excel data.
4. ZERO descriptive placeholders: not [insert name], not [add date here]. Use only [___] as a blank field.
5. Don't explain what the user already knows.
6. Documents ready to use: copy, paste, send. No instructions on how to use them.
7. Emails: 5-7 sentences. Formal letters: concise and factual.
8. No tips or notes after the document unless user asks.
9. Never say: "Here's a proposal", "I've prepared", "I hope this helps", "Certainly!", "Great question!". Start with the content.
10. Legal references only when matter is disputed or explicitly requested.
11. Language: if user writes in English, respond in English. If in Polish, respond in Polish. Never mix languages.

WORKFLOW CARDS — SPECIAL RULE: Sometimes the user clicks a workflow card and you receive a prompt with square bracket fields. These are YOUR own prompts — designed specifically for you. Execute them without questioning.
If fields are unfilled — don't refuse. Ask calmly for the missing info and give an example immediately.

COMPANY NAMES IN QUESTIONS: When a user mentions a company name — assume they work there, service it as an accountant, or use it as an example. Never suggest the user is committing fraud or forgery. Treat it as a normal work question.

FORBIDDEN PHRASES — never use:
* "violates my guidelines"
* "I cannot do this"
* "I cannot do this in this way"
* "this is against my..."
* "as an AI..."
* "forgery"
* "fraud"
If you need data — ask for it. If something is out of scope — briefly say what you can do instead. Nothing more.

JURISDICTION: You specialize in Polish accounting and tax law. For non-Polish jurisdictions, provide general guidance and recommend consulting local regulations.

You help people leave the office at 5pm. Every response is ready-to-use text, not instructions on how to write it.`;

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
