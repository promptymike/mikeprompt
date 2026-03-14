"use client";

type Lang = "en" | "pl";

interface UseCase {
  icon: string;
  titleEn: string;
  titlePl: string;
  steps: { en: string; pl: string }[];
  resultEn: string;
  resultPl: string;
  prompt: string;
}

const USE_CASES: UseCase[] = [
  {
    icon: "🧑‍💼",
    titleEn: "Finance Manager prepares board report",
    titlePl: "Dyrektor finansowy przygotowuje raport zarządu",
    steps: [
      { en: 'Paste "prepare board report" into Mike', pl: 'Wklej "przygotuj raport zarządu" do Mike\'a' },
      { en: "Mike adds structure — audience, KPIs, format, constraints", pl: "Mike dodaje strukturę — odbiorcę, KPI, format, ograniczenia" },
      { en: "Copy polished prompt into Claude", pl: "Skopiuj wypolerowany prompt do Claude" },
      { en: "Get a professional board-ready report in 30 seconds", pl: "Otrzymaj profesjonalny raport zarządu w 30 sekund" },
    ],
    resultEn: "What took 2 hours now takes 5 minutes",
    resultPl: "To, co zajmowało 2 godziny, teraz trwa 5 minut",
    prompt: "prepare board report",
  },
  {
    icon: "📧",
    titleEn: "Admin sends difficult supplier email",
    titlePl: "Asystent wysyła trudny email do dostawcy",
    steps: [
      { en: 'Paste "email supplier about late delivery"', pl: 'Wklej "email do dostawcy o opóźnionej dostawie"' },
      { en: "Mike adds tone, context, negotiation framework", pl: "Mike dodaje ton, kontekst, ramy negocjacyjne" },
      { en: "Copy into any AI chat", pl: "Skopiuj do dowolnego chatu AI" },
      { en: "Send a professional email that gets results", pl: "Wyślij profesjonalny email, który przynosi efekty" },
    ],
    resultEn: "From awkward to professional in one click",
    resultPl: "Od niezręcznego do profesjonalnego jednym kliknięciem",
    prompt: "write email to supplier about late delivery",
  },
  {
    icon: "📊",
    titleEn: "Accountant builds month-end checklist",
    titlePl: "Księgowy tworzy listę kontrolną zamknięcia miesiąca",
    steps: [
      { en: 'Paste "month end closing checklist"', pl: 'Wklej "lista kontrolna zamknięcia miesiąca"' },
      { en: "Mike adds role, company type, timeline, common errors", pl: "Mike dodaje rolę, typ firmy, harmonogram, typowe błędy" },
      { en: "Copy into ChatGPT or Claude", pl: "Skopiuj do ChatGPT lub Claude" },
      { en: "Get a complete, customized checklist", pl: "Otrzymaj kompletną, dostosowaną listę kontrolną" },
    ],
    resultEn: "Never miss a step again",
    resultPl: "Nigdy więcej pominięcia żadnego kroku",
    prompt: "summarize month-end closing checklist",
  },
  {
    icon: "🤝",
    titleEn: "Sales rep writes cold outreach",
    titlePl: "Handlowiec pisze cold outreach",
    steps: [
      { en: 'Paste "email CFO about our product"', pl: 'Wklej "email do CFO o naszym produkcie"' },
      { en: "Mike adds personalization, social proof, soft CTA, word limit", pl: "Mike dodaje personalizację, social proof, miękkie CTA, limit słów" },
      { en: "Copy into Gemini or ChatGPT", pl: "Skopiuj do Gemini lub ChatGPT" },
      { en: "Get an email that actually gets replies", pl: "Otrzymaj email, który rzeczywiście dostaje odpowiedzi" },
    ],
    resultEn: "From spam folder to meeting booked",
    resultPl: "Ze spamu do umówionego spotkania",
    prompt: "prepare cold outreach message for CFO",
  },
  {
    icon: "💼",
    titleEn: "Manager writes performance review",
    titlePl: "Menedżer pisze ocenę pracowniczą",
    steps: [
      { en: 'Paste "write performance review"', pl: 'Wklej "napisz ocenę pracowniczą"' },
      { en: "Mike adds SMART goals, specific behaviors, development areas", pl: "Mike dodaje cele SMART, konkretne zachowania, obszary rozwoju" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get a review that actually develops people", pl: "Otrzymaj ocenę, która naprawdę rozwija ludzi" },
    ],
    resultEn: "Fair, specific, and takes 10 minutes instead of 2 hours",
    resultPl: "Rzetelna, konkretna i zajmuje 10 minut zamiast 2 godzin",
    prompt: "write performance review for team member",
  },
];

interface UseCasesProps {
  lang: Lang;
  onTryNow: (prompt: string) => void;
}

export default function UseCases({ lang, onTryNow }: UseCasesProps) {
  const headerText = lang === "pl"
    ? "Realne scenariusze. Realne efekty. Zobacz jak ludzie używają Mike'a każdego dnia."
    : "Real workflows. Real results. See how people use Mike every day.";
  const tryNow = lang === "pl" ? "Wypróbuj teraz →" : "Try this now →";

  return (
    <div>
      <p style={{
        textAlign: "center", fontSize: 15, color: "var(--c-text2)",
        maxWidth: 520, margin: "0 auto 36px", lineHeight: 1.6,
      }}>
        {headerText}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {USE_CASES.map((uc) => (
          <div key={uc.prompt} style={{
            background: "var(--c-card)", borderRadius: 18,
            border: "1px solid var(--c-card-border)",
            boxShadow: "var(--c-card-sm)",
            overflow: "hidden",
          }}>
            {/* Card header */}
            <div style={{
              padding: "18px 24px 14px",
              borderBottom: "1px solid var(--c-sep)",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 22 }}>{uc.icon}</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--c-text1)", letterSpacing: "-0.3px" }}>
                {lang === "pl" ? uc.titlePl : uc.titleEn}
              </span>
            </div>

            {/* Steps */}
            <div style={{ padding: "16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
              {uc.steps.map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{
                    width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                    background: i === uc.steps.length - 1
                      ? "linear-gradient(135deg, #FF6E40, #FF8A65)"
                      : "rgba(255,110,64,0.1)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 700,
                    color: i === uc.steps.length - 1 ? "white" : "#FF6E40",
                    marginTop: 1,
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 14, color: "var(--c-prompt-text)", lineHeight: 1.55 }}>
                    {lang === "pl" ? step.pl : step.en}
                  </span>
                </div>
              ))}
            </div>

            {/* Result + CTA */}
            <div style={{
              padding: "12px 24px 16px",
              borderTop: "1px solid var(--c-sep)",
              background: "var(--c-hover)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              flexWrap: "wrap", gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 16 }}>✅</span>
                <span style={{
                  fontSize: 13, fontWeight: 600, color: "#FF6E40",
                  fontStyle: "italic",
                }}>
                  &ldquo;{lang === "pl" ? uc.resultPl : uc.resultEn}&rdquo;
                </span>
              </div>
              <button
                onClick={() => onTryNow(uc.prompt)}
                style={{
                  padding: "7px 16px", borderRadius: 10, border: "none",
                  background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                  color: "white", fontSize: 13, fontWeight: 600,
                  cursor: "pointer",
                  boxShadow: "0 3px 10px rgba(255,110,64,0.25)",
                  transition: "all 0.18s",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,110,64,0.4)")}
                onMouseOut={(e) => (e.currentTarget.style.boxShadow = "0 3px 10px rgba(255,110,64,0.25)")}
              >
                {tryNow}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
