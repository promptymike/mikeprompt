"use client";

import { useState } from "react";

type Lang = "en" | "pl";

interface UseCase {
  icon: string;
  titleEn: string;
  titlePl: string;
  categoryEn: string;
  categoryPl: string;
  steps: { en: string; pl: string }[];
  resultEn: string;
  resultPl: string;
  savingEn: string;
  savingPl: string;
  prompt: string;
}

const USE_CASES: UseCase[] = [
  // Finance & FP&A
  {
    icon: "🧑‍💼",
    titleEn: "Finance Manager prepares board report",
    titlePl: "Dyrektor finansowy przygotowuje raport zarządu",
    categoryEn: "Finance",
    categoryPl: "Finanse",
    steps: [
      { en: 'Paste "prepare board report" into Mike', pl: 'Wklej "przygotuj raport zarządu" do Mike\'a' },
      { en: "Mike adds structure — audience, KPIs, format, constraints", pl: "Mike dodaje strukturę — odbiorcę, KPI, format, ograniczenia" },
      { en: "Copy polished prompt into Claude", pl: "Skopiuj wypolerowany prompt do Claude" },
      { en: "Get a professional board-ready report in 30 seconds", pl: "Otrzymaj profesjonalny raport zarządu w 30 sekund" },
    ],
    resultEn: "What took 2 hours now takes 5 minutes",
    resultPl: "To, co zajmowało 2 godziny, teraz trwa 5 minut",
    savingEn: "2h → 5min",
    savingPl: "2h → 5 min",
    prompt: "prepare board report",
  },
  {
    icon: "📈",
    titleEn: "FP&A analyst builds cash flow forecast",
    titlePl: "Analityk FP&A buduje prognozę przepływów pieniężnych",
    categoryEn: "Finance",
    categoryPl: "Finanse",
    steps: [
      { en: 'Paste "build cash flow forecast" into Mike', pl: 'Wklej "zbuduj prognozę przepływów pieniężnych" do Mike\'a' },
      { en: "Mike adds assumptions, time horizon, scenario labels", pl: "Mike dodaje założenia, horyzont czasowy, etykiety scenariuszy" },
      { en: "Copy into ChatGPT", pl: "Skopiuj do ChatGPT" },
      { en: "Get a 3-scenario forecast model in minutes", pl: "Otrzymaj model prognozy 3-scenariuszowej w minuty" },
    ],
    resultEn: "3-scenario forecast ready before the coffee cools",
    resultPl: "Prognoza 3-scenariuszowa gotowa zanim ostygnie kawa",
    savingEn: "3h → 15min",
    savingPl: "3h → 15 min",
    prompt: "build 3-scenario cash flow forecast for Q3",
  },
  {
    icon: "💸",
    titleEn: "CFO drafts budget variance commentary",
    titlePl: "CFO pisze komentarz do odchyleń budżetowych",
    categoryEn: "Finance",
    categoryPl: "Finanse",
    steps: [
      { en: 'Paste "explain budget variance" into Mike', pl: 'Wklej "wyjaśnij odchylenie budżetowe" do Mike\'a' },
      { en: "Mike adds variance %, root cause structure, tone for stakeholders", pl: "Mike dodaje % odchylenia, strukturę analizy przyczyn, ton dla interesariuszy" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get crisp, executive-ready commentary", pl: "Otrzymaj zwięzły komentarz gotowy dla zarządu" },
    ],
    resultEn: "From raw numbers to executive story in 4 minutes",
    resultPl: "Od surowych liczb do narracji zarządowej w 4 minuty",
    savingEn: "90min → 4min",
    savingPl: "90 min → 4 min",
    prompt: "write budget variance commentary for executive team",
  },

  // Accounting & Audit
  {
    icon: "📊",
    titleEn: "Accountant builds month-end checklist",
    titlePl: "Księgowy tworzy listę kontrolną zamknięcia miesiąca",
    categoryEn: "Accounting",
    categoryPl: "Księgowość",
    steps: [
      { en: 'Paste "month end closing checklist"', pl: 'Wklej "lista kontrolna zamknięcia miesiąca"' },
      { en: "Mike adds role, company type, timeline, common errors", pl: "Mike dodaje rolę, typ firmy, harmonogram, typowe błędy" },
      { en: "Copy into ChatGPT or Claude", pl: "Skopiuj do ChatGPT lub Claude" },
      { en: "Get a complete, customized checklist", pl: "Otrzymaj kompletną, dostosowaną listę kontrolną" },
    ],
    resultEn: "Never miss a step again",
    resultPl: "Nigdy więcej pominięcia żadnego kroku",
    savingEn: "2h → 8min",
    savingPl: "2h → 8 min",
    prompt: "summarize month-end closing checklist",
  },
  {
    icon: "🔍",
    titleEn: "Auditor writes management letter finding",
    titlePl: "Audytor pisze ustalenie do listu do zarządu",
    categoryEn: "Accounting",
    categoryPl: "Księgowość",
    steps: [
      { en: 'Paste "write audit finding" into Mike', pl: 'Wklej "napisz ustalenie audytowe" do Mike\'a' },
      { en: "Mike adds IPPF structure, risk rating, recommendation format", pl: "Mike dodaje strukturę IPPF, ocenę ryzyka, format rekomendacji" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get a professional finding ready to present", pl: "Otrzymaj profesjonalne ustalenie gotowe do prezentacji" },
    ],
    resultEn: "Audit-quality findings at 5× the speed",
    resultPl: "Ustalenia jakości audytowej 5× szybciej",
    savingEn: "45min → 8min",
    savingPl: "45 min → 8 min",
    prompt: "write internal audit finding with recommendation",
  },

  // Sales
  {
    icon: "🤝",
    titleEn: "Sales rep writes cold outreach",
    titlePl: "Handlowiec pisze cold outreach",
    categoryEn: "Sales",
    categoryPl: "Sprzedaż",
    steps: [
      { en: 'Paste "email CFO about our product"', pl: 'Wklej "email do CFO o naszym produkcie"' },
      { en: "Mike adds personalization, social proof, soft CTA, word limit", pl: "Mike dodaje personalizację, social proof, miękkie CTA, limit słów" },
      { en: "Copy into Gemini or ChatGPT", pl: "Skopiuj do Gemini lub ChatGPT" },
      { en: "Get an email that actually gets replies", pl: "Otrzymaj email, który rzeczywiście dostaje odpowiedzi" },
    ],
    resultEn: "From spam folder to meeting booked",
    resultPl: "Ze spamu do umówionego spotkania",
    savingEn: "30min → 3min",
    savingPl: "30 min → 3 min",
    prompt: "prepare cold outreach message for CFO",
  },
  {
    icon: "📋",
    titleEn: "Account manager prepares discovery call questions",
    titlePl: "Account manager przygotowuje pytania na rozmowę discovery",
    categoryEn: "Sales",
    categoryPl: "Sprzedaż",
    steps: [
      { en: 'Paste "discovery call questions for SaaS prospect"', pl: 'Wklej "pytania na rozmowę discovery dla klienta SaaS"' },
      { en: "Mike adds pain-point framework, MEDDIC structure, follow-up hooks", pl: "Mike dodaje framework bólu, strukturę MEDDIC, haczyki do follow-up" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get 15 laser-focused discovery questions", pl: "Otrzymaj 15 precyzyjnych pytań discovery" },
    ],
    resultEn: "Walk into every call fully prepared",
    resultPl: "Wejdź na każdą rozmowę w pełni przygotowany",
    savingEn: "1h → 5min",
    savingPl: "1h → 5 min",
    prompt: "write discovery call questions for B2B SaaS prospect",
  },

  // Admin & Operations
  {
    icon: "📧",
    titleEn: "Admin sends difficult supplier email",
    titlePl: "Asystent wysyła trudny email do dostawcy",
    categoryEn: "Admin",
    categoryPl: "Administracja",
    steps: [
      { en: 'Paste "email supplier about late delivery"', pl: 'Wklej "email do dostawcy o opóźnionej dostawie"' },
      { en: "Mike adds tone, context, negotiation framework", pl: "Mike dodaje ton, kontekst, ramy negocjacyjne" },
      { en: "Copy into any AI chat", pl: "Skopiuj do dowolnego chatu AI" },
      { en: "Send a professional email that gets results", pl: "Wyślij profesjonalny email, który przynosi efekty" },
    ],
    resultEn: "From awkward to professional in one click",
    resultPl: "Od niezręcznego do profesjonalnego jednym kliknięciem",
    savingEn: "25min → 2min",
    savingPl: "25 min → 2 min",
    prompt: "write email to supplier about late delivery",
  },
  {
    icon: "🗂️",
    titleEn: "Operations manager creates SOP document",
    titlePl: "Kierownik operacyjny tworzy dokument SOP",
    categoryEn: "Admin",
    categoryPl: "Administracja",
    steps: [
      { en: 'Paste "write SOP for invoice approval process"', pl: 'Wklej "napisz SOP dla procesu zatwierdzania faktur"' },
      { en: "Mike adds step format, responsibility matrix, exception handling", pl: "Mike dodaje format kroków, macierz odpowiedzialności, obsługę wyjątków" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get a complete SOP ready to share with the team", pl: "Otrzymaj kompletne SOP gotowe do udostępnienia zespołowi" },
    ],
    resultEn: "Processes documented in minutes, not days",
    resultPl: "Procesy udokumentowane w minuty, nie dni",
    savingEn: "3h → 12min",
    savingPl: "3h → 12 min",
    prompt: "write SOP for invoice approval process",
  },

  // HR & People
  {
    icon: "💼",
    titleEn: "Manager writes performance review",
    titlePl: "Menedżer pisze ocenę pracowniczą",
    categoryEn: "HR",
    categoryPl: "HR",
    steps: [
      { en: 'Paste "write performance review"', pl: 'Wklej "napisz ocenę pracowniczą"' },
      { en: "Mike adds SMART goals, specific behaviors, development areas", pl: "Mike dodaje cele SMART, konkretne zachowania, obszary rozwoju" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get a review that actually develops people", pl: "Otrzymaj ocenę, która naprawdę rozwija ludzi" },
    ],
    resultEn: "Fair, specific, and takes 10 minutes instead of 2 hours",
    resultPl: "Rzetelna, konkretna i zajmuje 10 minut zamiast 2 godzin",
    savingEn: "2h → 10min",
    savingPl: "2h → 10 min",
    prompt: "write performance review for team member",
  },
  {
    icon: "📝",
    titleEn: "HR writes job description",
    titlePl: "HR pisze opis stanowiska pracy",
    categoryEn: "HR",
    categoryPl: "HR",
    steps: [
      { en: 'Paste "job description for senior accountant"', pl: 'Wklej "opis stanowiska dla starszego księgowego"' },
      { en: "Mike adds responsibilities, must-haves vs. nice-to-haves, salary band hint, inclusive language", pl: "Mike dodaje obowiązki, wymagania obowiązkowe vs. dodatkowe, wskazówkę o wynagrodzeniu, inkluzywny język" },
      { en: "Copy into ChatGPT or Claude", pl: "Skopiuj do ChatGPT lub Claude" },
      { en: "Get a job ad that attracts top candidates", pl: "Otrzymaj ogłoszenie przyciągające najlepszych kandydatów" },
    ],
    resultEn: "Better hires start with better job ads",
    resultPl: "Lepsze rekrutacje zaczynają się od lepszych ogłoszeń",
    savingEn: "90min → 8min",
    savingPl: "90 min → 8 min",
    prompt: "write job description for senior accountant role",
  },

  // Career & Students
  {
    icon: "🎓",
    titleEn: "Student writes cover letter for internship",
    titlePl: "Student pisze list motywacyjny na staż",
    categoryEn: "Career",
    categoryPl: "Kariera",
    steps: [
      { en: 'Paste "write cover letter for finance internship"', pl: 'Wklej "napisz list motywacyjny na staż w finansach"' },
      { en: "Mike adds hook, skills-to-role mapping, specific company angle, CTA", pl: "Mike dodaje hak, mapowanie umiejętności do roli, kąt specyficzny dla firmy, CTA" },
      { en: "Copy into Claude", pl: "Skopiuj do Claude" },
      { en: "Get a letter that actually gets interviews", pl: "Otrzymaj list, który rzeczywiście zdobywa rozmowy kwalifikacyjne" },
    ],
    resultEn: "From generic to memorable — instantly",
    resultPl: "Od ogólnego do niezapomnianego — natychmiast",
    savingEn: "2h → 7min",
    savingPl: "2h → 7 min",
    prompt: "write cover letter for finance internship application",
  },
];

const ALL_CATEGORY_EN = "All";
const ALL_CATEGORY_PL = "Wszystkie";

const CATEGORIES_EN = [ALL_CATEGORY_EN, "Finance", "Accounting", "Sales", "Admin", "HR", "Career"];
const CATEGORIES_PL = [ALL_CATEGORY_PL, "Finanse", "Księgowość", "Sprzedaż", "Administracja", "HR", "Kariera"];

interface UseCasesProps {
  lang: Lang;
  onTryNow: (prompt: string) => void;
}

export default function UseCases({ lang, onTryNow }: UseCasesProps) {
  const [activeCatEn, setActiveCatEn] = useState(ALL_CATEGORY_EN);

  const categories = lang === "pl" ? CATEGORIES_PL : CATEGORIES_EN;

  const filtered = activeCatEn === ALL_CATEGORY_EN
    ? USE_CASES
    : USE_CASES.filter((uc) => uc.categoryEn === activeCatEn);

  const headerText = lang === "pl"
    ? "Realne scenariusze. Realne efekty. Zobacz jak ludzie używają Mike'a każdego dnia."
    : "Real workflows. Real results. See how people use Mike every day.";
  const tryNow = lang === "pl" ? "Wypróbuj →" : "Try this →";

  // Stats
  const avgSaving = "73%";
  const statsLabel = lang === "pl"
    ? `📊 ${USE_CASES.length} scenariuszy · Śr. oszczędność czasu: ${avgSaving} · Działa z każdym AI`
    : `📊 ${USE_CASES.length} real workflows · Avg time saved: ${avgSaving} · Works with any AI`;

  return (
    <div>
      {/* Stats banner */}
      <div style={{
        background: "rgba(255,110,64,0.07)",
        border: "1px solid rgba(255,110,64,0.18)",
        borderRadius: 12, padding: "10px 18px",
        marginBottom: 20, textAlign: "center",
        fontSize: 13, fontWeight: 600, color: "#FF6E40",
      }}>
        {statsLabel}
      </div>

      <p style={{
        textAlign: "center", fontSize: 15, color: "var(--c-text2)",
        maxWidth: 520, margin: "0 auto 20px", lineHeight: 1.6,
      }}>
        {headerText}
      </p>

      {/* Category filter */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 24 }}>
        {categories.map((cat, i) => {
          const enCat = CATEGORIES_EN[i];
          const active = activeCatEn === enCat;
          return (
            <button
              key={enCat}
              onClick={() => setActiveCatEn(enCat)}
              style={{
                padding: "6px 16px", borderRadius: 100,
                border: active ? "1px solid #FF8A65" : "1px solid var(--c-chip-border)",
                background: active ? "linear-gradient(135deg, #FF6E40, #FF8A65)" : "var(--c-chip-bg)",
                color: active ? "white" : "var(--c-chip-color)",
                fontSize: 13, fontWeight: active ? 600 : 400,
                cursor: "pointer", transition: "all 0.18s",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {filtered.map((uc) => (
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
              display: "flex", alignItems: "center", justifyContent: "space-between",
              gap: 10,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>{uc.icon}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "var(--c-text1)", letterSpacing: "-0.3px" }}>
                  {lang === "pl" ? uc.titlePl : uc.titleEn}
                </span>
              </div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#FF6E40",
                background: "rgba(255,110,64,0.1)", borderRadius: 6,
                padding: "3px 9px", whiteSpace: "nowrap", flexShrink: 0,
              }}>
                {lang === "pl" ? uc.savingPl : uc.savingEn}
              </div>
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
