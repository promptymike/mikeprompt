"use client";

import { useState, useEffect, useRef } from "react";
import PromptLibrary from "./PromptLibrary";
import UseCases from "./UseCases";
import About from "./About";
import UserProfile, { type Profile, EMPTY_PROFILE } from "./UserProfile";
import ModelComparison from "./ModelComparison";
import SavedPrompts from "./SavedPrompts";
import AnonymizeTool from "./AnonymizeTool";
import CookieBanner from "./CookieBanner";
import { loadProfile, saveProfile as persistProfile } from "@/lib/profile";
import { supabase, hasSupabase } from "@/lib/supabase";

type Lang = "en" | "pl";

const T = {
  en: {
    tagline: "AI for humans",
    tab_polish: "✨ Polish",
    tab_anonymize: "🔒 Anonymize",
    tab_library: "📚 Library",
    tab_usecases: "💡 Use Cases",
    tab_models: "🧠 Models",
    tab_history: "📂 History",
    tab_about: "👋 About",
    polished_today_plural: "prompts polished today",
    polished_today_single: "prompt polished today",
    free_left: "free polishes left",
    sign_up_more: "Sign up for more",
    headline_pre: "AI that makes ",
    headline_accent: "YOU",
    headline_post: " better.",
    subheadline: "Not another chatbot. Mike polishes your prompts so every AI gives you better answers.",
    works_with: "Works with ChatGPT · Claude · Gemini · Copilot · any AI",
    stat: "The average worker wastes 23 min/day retrying AI prompts.",
    try_example: "Try an example:",
    placeholder: "Type or paste your prompt here…",
    optimize_for: "Optimize for:",
    output_for: "Output for:",
    trust_badge: "",
    chars_hint: (n: number) => `${n} chars`,
    paste_hint: "Paste anything — Mike handles the rest",
    polish_btn: "🔧 Polish it",
    thinking: "Mike is thinking...",
    personalise: "🎯 Personalise for better results",
    your_role: "Your role",
    select_role: "Select role…",
    your_goal: "Your goal",
    goal_placeholder: "e.g. save time on reports",
    your_name: "Your name",
    name_placeholder: "e.g. Anna",
    used_all: (n: number) => `You've used all ${n} free polishes. Drop your email to unlock more.`,
    unlock: "Unlock more",
    network_error: "Something went wrong. Please try again.",
    rate_limit_error: "Mike is very busy right now — please wait a moment and try again.",
    geo_blocked_error: "MikePrompt is not available in your region. If you're using a VPN, try disabling it.",
    err_ratelimit: "Slow down! Max 10 polishes per minute. Try again in a moment. ⏳",
    err_region: "Mike isn't available in your region or via this VPN. Try disabling your VPN. 🌍",
    err_overloaded: "Claude is very busy right now. Try again in 30 seconds. 🔥",
    err_network: "Something went wrong. Please try again.",
    mikes_version: "Mike's polished version",
    copy_prompt: "📋 Copy prompt",
    more_precise: (n: number) => `✨ Mike made your prompt ${n}% more precise`,
    what_fixed: "What Mike fixed",
    pro_tip_label: "Pro tip: ",
    was_helpful: "Was this helpful?",
    thanks_feedback: "Thanks for feedback!",
    like_mike: "🧡 Like Mike? Join the waitlist for Pro features.",
    join: "Join",
    on_list: "🎉 You're on the list! Mike will be in touch.",
    footer: "Made in Warsaw 🇵🇱 · Works with every AI chat · ",
  },
  pl: {
    tagline: "AI dla ludzi",
    tab_polish: "✨ Poleruj",
    tab_anonymize: "🔒 Anonimizuj",
    tab_library: "📚 Biblioteka",
    tab_usecases: "💡 Zastosowania",
    tab_models: "🧠 Modele",
    tab_history: "📂 Historia",
    tab_about: "👋 O nas",
    polished_today_plural: "promptów wypolerowanych dziś",
    polished_today_single: "prompt wypolerowany dziś",
    free_left: "darmowych polerów",
    sign_up_more: "Zarejestruj się po więcej",
    headline_pre: "AI, które sprawia że jesteś ",
    headline_accent: "LEPSZY",
    headline_post: ".",
    subheadline: "To nie kolejny chatbot. Mike szlifuje Twoje prompty żeby każde AI dawało lepsze odpowiedzi.",
    works_with: "Działa z ChatGPT · Claude · Gemini · Copilot · każdym AI",
    stat: "Przeciętny pracownik traci 23 min/dzień na ponowne próby z AI.",
    try_example: "Wypróbuj przykład:",
    placeholder: "Wpisz lub wklej swój prompt tutaj…",
    optimize_for: "Optymalizuj dla:",
    output_for: "Wynik dla:",
    trust_badge: "",
    chars_hint: (n: number) => `${n} znaków`,
    paste_hint: "Wklej cokolwiek — Mike zajmie się resztą",
    polish_btn: "🔧 Wypoleruj",
    thinking: "Mike myśli...",
    personalise: "🎯 Personalizuj dla lepszych wyników",
    your_role: "Twoja rola",
    select_role: "Wybierz rolę…",
    your_goal: "Twój cel",
    goal_placeholder: "np. oszczędzaj czas na raportach",
    your_name: "Twoje imię",
    name_placeholder: "np. Anna",
    used_all: (n: number) => `Wykorzystałeś wszystkie ${n} darmowe polery. Podaj email, żeby odblokować więcej.`,
    unlock: "Odblokuj więcej",
    network_error: "Coś poszło nie tak. Spróbuj ponownie.",
    rate_limit_error: "Mike jest teraz bardzo zajęty — poczekaj chwilę i spróbuj ponownie.",
    geo_blocked_error: "MikePrompt nie jest dostępny w Twoim regionie. Jeśli używasz VPN, spróbuj go wyłączyć.",
    err_ratelimit: "Za szybko! Max 10 polerów na minutę. Spróbuj za chwilę. ⏳",
    err_region: "Mike nie jest dostępny w Twoim regionie lub przez ten VPN. Spróbuj wyłączyć VPN. 🌍",
    err_overloaded: "Claude jest teraz bardzo zajęty. Spróbuj za 30 sekund. 🔥",
    err_network: "Coś poszło nie tak. Spróbuj ponownie.",
    mikes_version: "Wypolerowana wersja Mike'a",
    copy_prompt: "📋 Kopiuj prompt",
    more_precise: (n: number) => `✨ Mike sprawił, że Twój prompt jest o ${n}% precyzyjniejszy`,
    what_fixed: "Co Mike poprawił",
    pro_tip_label: "Pro tip: ",
    was_helpful: "Czy to było pomocne?",
    thanks_feedback: "Dzięki za opinię!",
    like_mike: "🧡 Podoba Ci się Mike? Dołącz do listy oczekujących na Pro.",
    join: "Dołącz",
    on_list: "🎉 Jesteś na liście! Mike się odezwie.",
    footer: "Made in Warsaw 🇵🇱 · Działa z każdym AI · ",
  },
};

const estimateTokens = (text: string) => Math.ceil(text.length / 4);

const TOOL_DESCRIPTIONS: Record<string, { en: string; pl: string; icon: string }> = {
  ChatGPT: { en: "Best all-rounder", pl: "Najlepszy ogólnie", icon: "🟢" },
  Claude:  { en: "Documents & privacy", pl: "Dokumenty i prywatność", icon: "🟠" },
  Gemini:  { en: "Best with Google apps", pl: "Integracja z Google", icon: "🔵" },
  Copilot: { en: "Best for Office 365", pl: "Dla Office 365", icon: "🟣" },
};

const TOOL_ICONS: Record<string, string> = {
  "Claude": "🟠",
  "ChatGPT": "🟢",
  "Gemini": "🔵",
  "Copilot": "🟣",
  "Perplexity": "⚫",
};

type Recommendation = {
  bestTool: string;
  reason: string;
  tip: string;
  alternativeTool?: string;
  alternativeReason?: string;
};

const EXAMPLE_CHIPS = {
  en: [
    { icon: "📊", label: "budget report", prompt: "write a budget report" },
    { icon: "📧", label: "supplier email", prompt: "write email to supplier about late delivery" },
    { icon: "📋", label: "meeting agenda", prompt: "prepare meeting agenda for Monday" },
    { icon: "🧮", label: "invoice issue", prompt: "explain this invoice discrepancy to client" },
    { icon: "💼", label: "performance review", prompt: "write performance review for team member" },
    { icon: "🤝", label: "cold outreach to CFO", prompt: "prepare cold outreach message for CFO" },
    { icon: "📊", label: "quarterly costs", prompt: "analyze quarterly costs" },
    { icon: "💼", label: "project update", prompt: "create project status update for stakeholders" },
  ],
  pl: [
    { icon: "📊", label: "raport budżetowy", prompt: "napisz raport budżetowy" },
    { icon: "📧", label: "email do dostawcy", prompt: "napisz email do dostawcy o opóźnionej dostawie" },
    { icon: "📋", label: "agenda spotkania", prompt: "przygotuj agendę spotkania na poniedziałek" },
    { icon: "🧮", label: "problem z fakturą", prompt: "wyjaśnij rozbieżność na fakturze klientowi" },
    { icon: "💼", label: "ocena pracownicza", prompt: "napisz ocenę pracowniczą dla członka zespołu" },
    { icon: "🤝", label: "cold email do CFO", prompt: "przygotuj wiadomość cold outreach do CFO" },
    { icon: "📊", label: "koszty kwartalne", prompt: "przeanalizuj koszty kwartalne" },
    { icon: "💼", label: "aktualizacja projektu", prompt: "utwórz aktualizację statusu projektu dla interesariuszy" },
  ],
};

const ROLES = ["Finance", "Admin", "Accounting", "Sales", "Management", "HR", "Other"];

const PRO_TIPS = [
  "Always specify your audience — AI writes differently for a CEO than for a colleague",
  "Add 'Format as...' at the end to control output structure",
  "Tell AI what to avoid — it's as important as what to include",
  "Break complex tasks into numbered steps for better results",
  "Specify tone: formal, casual, technical, friendly — don't leave it to chance",
  "Include an example of what good output looks like",
  "Set a word/page limit — without it AI tends to over-explain",
  "Start with a role: 'Act as a senior financial analyst...' changes everything",
  "If asking for analysis, specify what data points matter most",
  "Ask for pros AND cons — AI defaults to positive if you don't",
  "Specify the time period — 'recent' means different things to different AIs",
  "One prompt, one task. Split complex requests into separate prompts",
  "Add context about what you already know to avoid basic explanations",
  "Tell AI your experience level so it calibrates depth appropriately",
  "End with 'Before you start, ask me 3 clarifying questions' for complex tasks",
];

const PRO_TIPS_PL = [
  "Zawsze określ grupę docelową — AI pisze inaczej dla CEO niż dla kolegi",
  "Dodaj 'Formatuj jako...' na końcu żeby kontrolować strukturę odpowiedzi",
  "Powiedz AI czego unikać — to tak samo ważne jak co ma zrobić",
  "Podziel złożone zadania na numerowane kroki dla lepszych wyników",
  "Określ ton: formalny, swobodny, techniczny — nie zostawiaj tego przypadkowi",
  "Podaj przykład jak powinien wyglądać dobry wynik",
  "Ustaw limit słów lub stron — bez tego AI będzie się rozpisywać",
  "Zacznij od roli: 'Działaj jako starszy analityk finansowy...' — zmienia wszystko",
  "Przy analizie określ jakie dane są najważniejsze",
  "Poproś o plusy I minusy — AI domyślnie skupia się na pozytywach",
  "Podaj ramy czasowe — 'ostatni kwartał' znaczy różne rzeczy dla różnych AI",
  "Jedno zadanie, jeden prompt. Złożone prośby podziel na osobne prompty",
  "Dodaj kontekst co już wiesz — unikniesz podstawowych wyjaśnień",
  "Powiedz AI jaki masz poziom wiedzy żeby dostosował głębokość odpowiedzi",
  "Zakończ słowami 'Zanim zaczniesz, zadaj mi 3 pytania wyjaśniające' przy trudnych zadaniach",
];

const getLocalizedProTip = (englishTip: string, lang: Lang): string => {
  if (lang === "en") return englishTip;
  const index = PRO_TIPS.indexOf(englishTip);
  if (index >= 0 && index < PRO_TIPS_PL.length) return PRO_TIPS_PL[index];
  return englishTip;
};

const getFunMessage = (prompt: string, lang: Lang): string => {
  const patterns: Array<[RegExp, string, string]> = [
    [/auto|samoch|fura|car|vehicle/i, "🚗 Szykuje się fajna fura!", "🚗 Looks like a sweet ride incoming!"],
    [/laptop|komputer|computer|mac\b|pc\b/i, "💻 Nowy sprzęt w drodze?", "💻 New gear incoming?"],
    [/email|mail|wiadom/i, "📧 Ten email trafi prosto do celu!", "📧 This email will hit the mark!"],
    [/raport|report|analiz/i, "📊 Szef będzie pod wrażeniem!", "📊 Your boss will be impressed!"],
    [/prezentac|presentation|slajd|slide/i, "🎯 Niezapomniana prezentacja!", "🎯 Unforgettable presentation!"],
    [/oferta|proposal|pitch/i, "💼 Deal w zasięgu ręki!", "💼 That deal is as good as closed!"],
    [/\bcv\b|resume|praca|job/i, "✨ Rekruter to zauważy!", "✨ The recruiter will notice!"],
    [/excel|arkusz|spreadsheet/i, "📈 Excel nigdy tak dobrze nie wyglądał!", "📈 Excel never looked this good!"],
    [/budżet|budget|finanse|finance/i, "💰 CFO będzie zadowolony!", "💰 The CFO will be pleased!"],
    [/audit|audyt|kontrola/i, "🔍 Audytor bez zarzutów!", "🔍 Audit-proof!"],
    [/\bhr\b|rekrutac|hiring/i, "👥 Znajdziesz idealnego kandydata!", "👥 Perfect candidate incoming!"],
  ];
  for (const [pattern, msgPl, msgEn] of patterns) {
    if (pattern.test(prompt)) return lang === "pl" ? msgPl : msgEn;
  }
  const defaults = lang === "pl"
    ? ["🔥 Mike dał z siebie wszystko!", "✨ Prompt na poziomie pro!", "🚀 To dopiero robota!"]
    : ["🔥 Mike gave it everything!", "✨ Pro-level prompt!", "🚀 Now that's a prompt!"];
  return defaults[Math.floor(Math.random() * defaults.length)];
};

const getSavingsEstimate = (originalLength: number, fixesCount: number, lang: Lang): string => {
  const minutesSaved = Math.min(2 + fixesCount * 3, 20);
  const moneySaved = Math.round(minutesSaved * 0.5);
  if (lang === "pl") {
    return `⏱️ Szacowana oszczędność: ~${minutesSaved} min i ${moneySaved * 4} zł dzięki lepszemu promptowi`;
  }
  return `⏱️ Estimated savings: ~${minutesSaved} min and $${moneySaved} from getting it right first try`;
};

const TODAY_KEY = () => `mikeprompt_count_${new Date().toISOString().slice(0, 10)}`;
const getStoredCount = () => {
  if (typeof window === "undefined") return 0;
  return parseInt(localStorage.getItem(TODAY_KEY()) ?? "0", 10);
};
const incrementStoredCount = () => {
  const next = getStoredCount() + 1;
  localStorage.setItem(TODAY_KEY(), String(next));
  return next;
};

const CSS_VARS = `
/* Hide scrollbar on tab row */
header div[style*="overflowX"] { scrollbar-width: none; }
header div[style*="overflowX"]::-webkit-scrollbar { display: none; }

@keyframes slideUp {
  from { opacity: 0; transform: translateX(-50%) translateY(20px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

[data-theme="light"] {
  --c-page-bg: linear-gradient(165deg, #FFF8F0 0%, #FFF1E6 30%, #FFE8D6 60%, #FFDDC1 100%);
  --c-card: white;
  --c-card-border: rgba(0,0,0,0.06);
  --c-card-shadow: 0 12px 40px rgba(0,0,0,0.05);
  --c-card-sm: 0 2px 12px rgba(0,0,0,0.03);
  --c-input: white;
  --c-input-border: rgba(0,0,0,0.08);
  --c-text1: #2D2A26;
  --c-text2: #6B6560;
  --c-text3: #A09890;
  --c-text4: #C0B8B0;
  --c-text5: #C8C0BA;
  --c-sep: rgba(0,0,0,0.04);
  --c-tab-bar: rgba(0,0,0,0.04);
  --c-tab-active: white;
  --c-tab-active-text: #2D2A26;
  --c-tab-inactive-text: #A09890;
  --c-chip-bg: rgba(255,255,255,0.8);
  --c-chip-border: rgba(0,0,0,0.08);
  --c-chip-color: #6B6560;
  --c-hover: rgba(0,0,0,0.015);
  --c-fix-bg: white;
  --c-fix-border: rgba(0,0,0,0.04);
  --c-tip-bg: rgba(255,183,77,0.04);
  --c-count-bg: rgba(0,0,0,0.04);
  --c-toggle: white;
  --c-toggle-border: rgba(0,0,0,0.08);
  --c-toggle-color: #A09890;
  --c-prompt-text: #4A4540;
  --c-stat-bg: rgba(0,0,0,0.01);
  --c-result-border: rgba(76,175,80,0.12);
  --c-green-bg: rgba(76,175,80,0.06);
  --c-green-border: rgba(76,175,80,0.12);
  --c-green-text: #2E7D32;
  --c-err-bg: #FFF5F5;
  --c-err-border: rgba(244,67,54,0.1);
  --c-overlay: rgba(0,0,0,0.4);
  --c-sidebar: white;
  --c-badge: rgba(255,110,64,0.08);
  --c-shape1: rgba(255,183,77,0.12);
  --c-shape2: rgba(255,138,101,0.08);
}
[data-theme="dark"] {
  --c-page-bg: linear-gradient(165deg, #1E1B18 0%, #1C1914 30%, #1A1710 60%, #181408 100%);
  --c-card: #252220;
  --c-card-border: rgba(255,255,255,0.07);
  --c-card-shadow: 0 12px 40px rgba(0,0,0,0.35);
  --c-card-sm: 0 2px 12px rgba(0,0,0,0.25);
  --c-input: #2C2925;
  --c-input-border: rgba(255,255,255,0.09);
  --c-text1: #E0DAD4;
  --c-text2: #9A918A;
  --c-text3: #6E6560;
  --c-text4: #4E4844;
  --c-text5: #444040;
  --c-sep: rgba(255,255,255,0.06);
  --c-tab-bar: rgba(255,255,255,0.06);
  --c-tab-active: #2C2925;
  --c-tab-active-text: #E0DAD4;
  --c-tab-inactive-text: #6E6560;
  --c-chip-bg: rgba(255,255,255,0.04);
  --c-chip-border: rgba(255,255,255,0.08);
  --c-chip-color: #7A7068;
  --c-hover: rgba(255,255,255,0.025);
  --c-fix-bg: #2C2925;
  --c-fix-border: rgba(255,255,255,0.06);
  --c-tip-bg: rgba(255,183,77,0.07);
  --c-count-bg: rgba(255,255,255,0.06);
  --c-toggle: #2C2925;
  --c-toggle-border: rgba(255,255,255,0.09);
  --c-toggle-color: #6E6560;
  --c-prompt-text: #B0A8A0;
  --c-stat-bg: rgba(255,255,255,0.02);
  --c-result-border: rgba(76,175,80,0.2);
  --c-green-bg: rgba(76,175,80,0.08);
  --c-green-border: rgba(76,175,80,0.18);
  --c-green-text: #4CAF50;
  --c-err-bg: rgba(244,67,54,0.08);
  --c-err-border: rgba(244,67,54,0.15);
  --c-overlay: rgba(0,0,0,0.65);
  --c-sidebar: #1A1714;
  --c-badge: rgba(255,110,64,0.12);
  --c-shape1: rgba(255,183,77,0.05);
  --c-shape2: rgba(255,138,101,0.04);
}
`;

const MikePromptMVP = () => {
  const [input, setInput] = useState("");
  const [optimized, setOptimized] = useState("");
  const [fixes, setFixes] = useState<string[]>([]);
  const [proTip, setProTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [usageCount, setUsageCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [userName, setUserName] = useState("");
  const [dailyCount, setDailyCount] = useState(0);
  const [feedback, setFeedback] = useState<"positive" | "negative" | null>(null);
  const [selectedChat, setSelectedChat] = useState("ChatGPT");
  const [selectedProduct, setSelectedProduct] = useState("General");
  const [activeTab, setActiveTab] = useState<"polish" | "anonymize" | "library" | "usecases" | "models" | "history" | "about">("polish");
  const [currentUser, setCurrentUser] = useState<{ id: string; email?: string } | null>(null);
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [profileOpen, setProfileOpen] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [authToast, setAuthToast] = useState<"success" | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [anonymize, setAnonymize] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const MAX_FREE = 5;

  // MUST be first — registers before other onAuthStateChange listeners
  // so the SDK emits SIGNED_IN to this handler while the hash is still in the URL
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.location.hash.includes("access_token=")) return;

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) {
          window.history.replaceState(null, "", window.location.pathname);
          setAuthToast("success");
          setTimeout(() => setAuthToast(null), 4000);
          subscription.unsubscribe();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setVisible(true);
    setDailyCount(getStoredCount());
    const storedLang = localStorage.getItem("mikeprompt_lang");
    if (storedLang === "pl" || storedLang === "en") setLang(storedLang);
    const storedDark = localStorage.getItem("mikeprompt_dark");
    if (storedDark === "1") setDark(true);
    const storedProfile = loadProfile();
    if (storedProfile) setProfile(storedProfile);

    if (hasSupabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data.user) setCurrentUser({ id: data.user.id, email: data.user.email });
      });
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setCurrentUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
      });
      return () => subscription.unsubscribe();
    }
  }, []);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("mikeprompt_onboarded");
    const hasProfile = localStorage.getItem("mikeprompt_profile_v2");
    if (!hasSeenOnboarding && !hasProfile) {
      const timer = setTimeout(() => setShowOnboarding(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const toggleLang = () => {
    const next: Lang = lang === "en" ? "pl" : "en";
    setLang(next);
    localStorage.setItem("mikeprompt_lang", next);
  };

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem("mikeprompt_dark", next ? "1" : "0");
  };

  const saveProfile = (p: Profile) => {
    setProfile(p);
    persistProfile(p);
  };

  const t = T[lang];

  const optimizePrompt = async () => {
    if (!input.trim()) return;
    if (usageCount >= MAX_FREE && !emailSubmitted) { setError("signup"); return; }
    setLoading(true); setError(""); setShowResults(false);
    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input,
          role: role || undefined,
          goal: goal || undefined,
          name: userName || undefined,
          selectedChat, selectedProduct, lang,
          profile: (profile.name || profile.role || profile.industry) ? profile : undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        const errKey = data.error;
        if (errKey === "ratelimit") { setError("ratelimit"); setLoading(false); return; }
        if (errKey === "region_blocked") { setError("region"); setLoading(false); return; }
        if (errKey === "overloaded") { setError("overloaded"); setLoading(false); return; }
        setError("network"); setLoading(false); return;
      }
      const result = data.result || "Something went wrong. Try again.";
      setOptimized(result);
      setFixes(Array.isArray(data.fixes) ? data.fixes : []);
      setRecommendation(data.recommendation ?? null);
      setProTip(PRO_TIPS[Math.floor(Math.random() * PRO_TIPS.length)]);
      setFeedback(null);
      setShowResults(true);
      setUsageCount((prev) => prev + 1);
      setDailyCount(incrementStoredCount());
      // Save to cloud (logged in) or localStorage (anonymous)
      savePromptToDB(result, data).catch(() => {});
      saveToLocalHistory({ original: input, optimized: result, chat: selectedChat, fixes: Array.isArray(data.fixes) ? data.fixes : [], timestamp: new Date().toISOString() });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    } catch { setError("network"); }
    setLoading(false);
  };

  const saveToLocalHistory = (entry: { original: string; optimized: string; chat: string; fixes: string[]; timestamp: string }) => {
    const key = "mikeprompt_history";
    const existing = JSON.parse(localStorage.getItem(key) ?? "[]") as typeof entry[];
    localStorage.setItem(key, JSON.stringify([entry, ...existing].slice(0, 20)));
  };

  const savePromptToDB = async (result: string, data: { fixes?: string[]; recommendation?: unknown }) => {
    if (!hasSupabase || !currentUser) return;
    const userConsented = profile.saveHistory ?? true;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("saved_prompts") as any).insert({
      user_id: currentUser.id,
      original_prompt: input,
      optimized_prompt: result,
      selected_chat: selectedChat,
      selected_product: selectedProduct,
      fixes: data.fixes ?? [],
      recommendation: data.recommendation ?? null,
      user_consented: userConsented,
      created_at: new Date().toISOString(),
    });
  };

  const copyText = (text: string) => navigator.clipboard.writeText(text);

  const handleFeedback = (type: "positive" | "negative") => {
    setFeedback(type);
    console.log({ timestamp: new Date().toISOString(), original_prompt: input, optimized_prompt: optimized, feedback: type });
  };

  const submitWaitlist = async (onSuccess: () => void) => {
    if (!email) return;
    await fetch("/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, role: role || undefined, goal: goal || undefined, name: userName || undefined }),
    });
    onSuccess();
  };

  const inputTokens = estimateTokens(input);
  const outputTokens = estimateTokens(optimized);
  const precisionGain = outputTokens > 0
    ? Math.abs(Math.round(((outputTokens - inputTokens) / outputTokens) * 100))
    : 0;

  const profileInitial = profile.name ? profile.name[0].toUpperCase() : null;

  const profileCompletion = [profile.name, profile.role, profile.industry, profile.usage].filter(Boolean).length;

  const profileIcon = () => {
    if (currentUser) return profileInitial ?? "✓";
    if (profileCompletion === 0) return "👤";
    if (profileCompletion < 3) return profileInitial ?? "◐";
    return profileInitial ?? "✓";
  };

  const profileTooltip = lang === "pl"
    ? profileCompletion === 0
      ? "Uzupełnij profil — Mike będzie skuteczniejszy!"
      : `Profil: ${profileCompletion * 25}% uzupełniony`
    : profileCompletion === 0
      ? "Complete your profile — Mike will be more effective!"
      : `Profile: ${profileCompletion * 25}% complete`;

  const trustBadge = profile.saveHistory !== false
    ? (lang === "pl"
        ? "🔒 Prompty zapisywane w Twojej historii · Powered by Claude · Działa z każdym AI"
        : "🔒 Prompts saved to your history · Powered by Claude · Works with every AI")
    : (lang === "pl"
        ? "🔒 Prompty nie są zapisywane · Powered by Claude · Działa z każdym AI"
        : "🔒 Prompts not stored · Powered by Claude · Works with every AI");

  const TABS = [
    ["polish", t.tab_polish],
    ["anonymize", t.tab_anonymize],
    ["library", t.tab_library],
    ["usecases", t.tab_usecases],
    ["models", t.tab_models],
    ["history", t.tab_history],
    ["about", t.tab_about],
  ] as const;

  return (
    <div
      data-theme={dark ? "dark" : "light"}
      style={{
        minHeight: "100vh",
        background: "var(--c-page-bg)",
        fontFamily: "'DM Sans', sans-serif",
        color: "var(--c-text1)",
      }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=JetBrains+Mono:wght@400;500&display=swap"
        rel="stylesheet"
      />

      {/* Floating bg shapes */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div style={{
          position: "absolute", top: "8%", right: "8%", width: 350, height: 350, borderRadius: "50%",
          background: "radial-gradient(circle, var(--c-shape1) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "15%", left: "5%", width: 250, height: 250, borderRadius: "50%",
          background: "radial-gradient(circle, var(--c-shape2) 0%, transparent 70%)",
        }} />
      </div>

      {/* Nav — two-level sticky header */}
      <header
        data-theme={dark ? "dark" : "light"}
        style={{
          position: "sticky", top: 0, zIndex: 100,
          background: "var(--c-card)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid var(--c-card-border)",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(-20px)",
          transition: "all 0.8s ease",
        }}>
        {/* Top row: Logo | Utility buttons */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: isMobile ? "12px 16px 8px" : "12px 24px 8px",
          maxWidth: 1200, margin: "0 auto",
        }}>
          {/* Logo — clickable, goes to Polish tab */}
          <button
            onClick={() => setActiveTab("polish")}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, padding: 0 }}
          >
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: "linear-gradient(135deg, #FF8A65, #FF6E40)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "white", fontWeight: 700,
              fontFamily: "'Fraunces', serif",
              boxShadow: "0 3px 10px rgba(255,110,64,0.25)",
              flexShrink: 0,
            }}>M</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.5px", fontFamily: "'Fraunces', serif", color: "var(--c-text1)" }}>
                mike<span style={{ color: "#FF6E40" }}>prompt</span>
              </div>
              <div style={{ fontSize: 10, color: "var(--c-text4)", marginTop: -2 }}>{t.tagline}</div>
            </div>
          </button>

          {/* Right: utility buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 4 : 6, flexShrink: 0 }}>
            {!isMobile && dailyCount > 0 && (
              <div style={{ fontSize: 12, color: "#FF6E40", fontWeight: 600, background: "var(--c-badge)", borderRadius: 100, padding: "3px 10px", whiteSpace: "nowrap" }}>
                🔥 {dailyCount}
              </div>
            )}
            {!isMobile && (
              <div style={{ fontSize: 12, color: "var(--c-text3)", fontWeight: 500, whiteSpace: "nowrap" }}>
                {MAX_FREE - usageCount > 0 ? `${MAX_FREE - usageCount} ${t.free_left}` : t.sign_up_more}
              </div>
            )}
            <button onClick={toggleDark} style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid var(--c-toggle-border)", background: "var(--c-toggle)", fontSize: 13, cursor: "pointer", flexShrink: 0 }}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={toggleLang} style={{ padding: "4px 8px", borderRadius: 8, border: "1px solid var(--c-toggle-border)", background: "var(--c-toggle)", fontSize: 11, fontWeight: 600, color: "var(--c-toggle-color)", cursor: "pointer", flexShrink: 0 }}>
              {lang === "en" ? "PL" : "EN"}
            </button>
            <div style={{ position: "relative", flexShrink: 0 }}>
              <button
                onClick={() => setProfileOpen(true)}
                title={profileTooltip}
                style={{
                  width: 30, height: 30, borderRadius: "50%", border: "none", cursor: "pointer",
                  background: (profileInitial || currentUser) ? "linear-gradient(135deg, #FF6E40, #FF8A65)" : "var(--c-toggle)",
                  color: (profileInitial || currentUser) ? "white" : "var(--c-toggle-color)",
                  fontSize: profileInitial ? 13 : 15, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  outline: "1px solid var(--c-toggle-border)",
                }}
              >
                {profileIcon()}
              </button>
              {profileCompletion === 0 && (
                <div style={{
                  position: "absolute", top: -2, right: -2,
                  width: 8, height: 8, borderRadius: "50%",
                  background: "#FF6E40",
                  border: "2px solid var(--c-page-bg-solid, white)",
                  pointerEvents: "none",
                }} />
              )}
            </div>
          </div>
        </div>

        {/* Bottom row: Tabs */}
        <div style={{
          padding: isMobile ? "0 12px 10px" : "0 24px 10px",
          overflowX: "auto", scrollbarWidth: "none",
        }}>
          <div style={{
            display: "flex", gap: 2,
            background: "var(--c-tab-bar)", borderRadius: 10, padding: 3,
            width: isMobile ? "max-content" : "fit-content",
            margin: isMobile ? "0" : "0 auto",
          }}>
            {TABS.map(([tab, label]) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: isMobile ? "5px 10px" : "6px 14px",
                  fontSize: isMobile ? 12 : 13,
                  borderRadius: 7, border: "none",
                  background: activeTab === tab ? "var(--c-tab-active)" : "transparent",
                  color: activeTab === tab ? "var(--c-tab-active-text)" : "var(--c-tab-inactive-text)",
                  fontWeight: activeTab === tab ? 600 : 400,
                  cursor: "pointer",
                  boxShadow: activeTab === tab ? "0 1px 4px rgba(0,0,0,0.10)" : "none",
                  transition: "all 0.18s", whiteSpace: "nowrap", flexShrink: 0,
                }}
              >{label}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Profile sidebar */}
      <UserProfile
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        onSave={saveProfile}
        initialProfile={profile}
        lang={lang}
        isMobile={isMobile}
      />

      {/* Onboarding toast */}
      {showOnboarding && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          left: isMobile ? 12 : "50%",
          right: isMobile ? 12 : "auto",
          transform: isMobile ? "none" : "translateX(-50%)",
          background: "var(--c-card)", borderRadius: 16,
          border: "1px solid rgba(255,110,64,0.2)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          padding: "16px 20px", zIndex: 200,
          display: "flex", alignItems: "center", gap: 14,
          maxWidth: isMobile ? "none" : 420,
          width: isMobile ? "auto" : "calc(100% - 48px)",
          animation: "slideUp 0.4s ease",
        }}>
          <div style={{ fontSize: 32 }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--c-text1)", marginBottom: 2 }}>
              {lang === "pl" ? "Mike będzie lepszy jeśli Cię pozna" : "Mike works better when he knows you"}
            </div>
            <div style={{ fontSize: 12, color: "var(--c-text3)" }}>
              {lang === "pl" ? "Uzupełnij rolę i branżę — 30 sekund" : "Add your role and industry — 30 seconds"}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => {
                setShowOnboarding(false);
                setProfileOpen(true);
                localStorage.setItem("mikeprompt_onboarded", "1");
              }}
              style={{
                padding: "7px 14px", borderRadius: 8, border: "none",
                background: "linear-gradient(135deg, #FF6E40, #FF8A65)",
                color: "white", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}
            >
              {lang === "pl" ? "Uzupełnij →" : "Set up →"}
            </button>
            <button
              onClick={() => {
                setShowOnboarding(false);
                localStorage.setItem("mikeprompt_onboarded", "1");
              }}
              style={{ fontSize: 11, color: "var(--c-text4)", background: "none", border: "none", cursor: "pointer" }}
            >
              {lang === "pl" ? "Później" : "Later"}
            </button>
          </div>
        </div>
      )}

      {/* Auth success toast */}
      {authToast === "success" && (
        <div style={{
          position: "fixed",
          bottom: isMobile ? 16 : 24,
          left: isMobile ? 12 : "50%",
          right: isMobile ? 12 : "auto",
          transform: isMobile ? "none" : "translateX(-50%)",
          background: "linear-gradient(135deg, #2E7D32, #388E3C)",
          borderRadius: 16,
          boxShadow: "0 8px 32px rgba(46,125,50,0.3)",
          padding: "14px 20px", zIndex: 201,
          display: "flex", alignItems: "center", gap: 12,
          maxWidth: isMobile ? "none" : 400,
          width: isMobile ? "auto" : "calc(100% - 48px)",
          animation: "slideUp 0.4s ease",
          color: "white",
        }}>
          <div style={{ fontSize: 28 }}>🎉</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>
            {lang === "pl" ? "Email potwierdzony! Jesteś zalogowany." : "Email confirmed! You're signed in."}
          </div>
        </div>
      )}

      {/* Main */}
      <main style={{
        maxWidth: 800, margin: "0 auto", padding: isMobile ? "16px 16px 60px" : "20px 24px 60px",
        position: "relative", zIndex: 5,
      }}>
        {/* About tab */}
        {activeTab === "about" && <About lang={lang} />}

        {/* Anonymize tab */}
        {activeTab === "anonymize" && <AnonymizeTool lang={lang} />}

        {/* History tab */}
        {activeTab === "history" && (
          <SavedPrompts
            lang={lang}
            currentUser={currentUser}
            userProfile={profile}
            onOpenProfile={() => setProfileOpen(true)}
            onReuse={(prompt) => {
              setInput(prompt); setActiveTab("polish");
              setShowResults(false); setOptimized(""); setFixes([]);
            }}
            onNavigate={(tab) => setActiveTab(tab as "polish" | "anonymize" | "library" | "usecases" | "models" | "history" | "about")}
          />
        )}

        {/* Models tab */}
        {activeTab === "models" && <ModelComparison lang={lang} />}

        {/* Use Cases tab */}
        {activeTab === "usecases" && (
          <UseCases
            lang={lang}
            onTryNow={(prompt) => {
              setInput(prompt); setActiveTab("polish");
              setShowResults(false); setOptimized(""); setFixes([]);
            }}
          />
        )}

        {/* Library tab */}
        {activeTab === "library" && (
          <PromptLibrary
            lang={lang}
            onPolish={(prompt) => {
              setInput(prompt); setActiveTab("polish");
              setShowResults(false); setOptimized(""); setFixes([]);
            }}
          />
        )}

        {/* Polish tab */}
        {activeTab === "polish" && (<>
          {/* Hero */}
          <div style={{
            textAlign: "center", marginBottom: 16,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.2s",
          }}>
            <h1 style={{
              fontFamily: "'Fraunces', serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(34px, 6vw, 56px)",
              fontWeight: 700, lineHeight: 1.1, marginBottom: 16, letterSpacing: "-1.5px",
              color: "var(--c-text1)",
            }}>
              {t.headline_pre}
              <span style={{ background: "linear-gradient(135deg, #FF6E40, #FF8A65)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {t.headline_accent}
              </span>
              {t.headline_post}
            </h1>
            <p style={{ fontSize: 17, color: "var(--c-text2)", maxWidth: 480, margin: "0 auto 12px", lineHeight: 1.6 }}>
              {t.subheadline}
            </p>
            <p style={{ fontSize: 13, color: "var(--c-text3)", marginBottom: 8 }}>{t.works_with}</p>
            <p style={{ fontSize: 12, color: "var(--c-text5)", fontStyle: "italic" }}>{t.stat}</p>
          </div>

          {/* Example chips */}
          <div style={{ marginBottom: 28, opacity: visible ? 1 : 0, transition: "all 0.8s ease 0.35s" }}>
            <p style={{
              fontSize: 12, fontWeight: 600, color: "var(--c-text4)",
              textTransform: "uppercase", letterSpacing: "0.6px",
              marginBottom: 10, textAlign: "center",
            }}>{t.try_example}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
              {EXAMPLE_CHIPS[lang].map((chip) => (
                <button
                  key={chip.prompt}
                  onClick={() => { setInput(chip.prompt); setShowResults(false); setOptimized(""); setFixes([]); }}
                  style={{
                    padding: isMobile ? "5px 10px" : "7px 14px", borderRadius: 100,
                    border: "1px solid var(--c-chip-border)",
                    background: "var(--c-chip-bg)",
                    fontSize: isMobile ? 12 : 13, color: "var(--c-chip-color)", cursor: "pointer",
                    transition: "all 0.18s",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#FF8A65";
                    e.currentTarget.style.color = "#FF6E40";
                    e.currentTarget.style.background = "rgba(255,110,64,0.06)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "var(--c-chip-border)";
                    e.currentTarget.style.color = "var(--c-chip-color)";
                    e.currentTarget.style.background = "var(--c-chip-bg)";
                  }}
                >
                  {chip.icon} {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input card */}
          <div style={{
            background: "var(--c-card)", borderRadius: 20,
            border: "1px solid var(--c-card-border)",
            boxShadow: "var(--c-card-shadow)",
            overflow: "hidden",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s ease 0.5s",
          }}>
            <div style={{ padding: isMobile ? "16px 16px 0" : "24px 24px 0" }}>
              <textarea
                value={input}
                onChange={(e) => { setInput(e.target.value); setShowResults(false); }}
                placeholder={t.placeholder}
                rows={4}
                style={{
                  width: "100%", border: "none", outline: "none", resize: "vertical",
                  fontSize: 16, lineHeight: 1.7, color: "var(--c-text1)",
                  fontFamily: "'DM Sans', sans-serif", background: "transparent",
                  minHeight: 100,
                }}
              />
            </div>

            {/* Selectors */}
            <div style={{ padding: "12px 24px", borderTop: "1px solid var(--c-sep)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "var(--c-text3)", fontWeight: 600, minWidth: 90 }}>{t.optimize_for}</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {Object.entries(TOOL_DESCRIPTIONS).map(([chat, desc]) => {
                    const isSelected = selectedChat === chat;
                    const isRecommended = recommendation?.bestTool === chat && selectedChat !== chat;
                    return (
                      <button
                        key={chat}
                        onClick={() => setSelectedChat(chat)}
                        style={{
                          padding: "5px 12px 5px 10px", borderRadius: 10,
                          border: isSelected ? "1px solid #FF8A65" : isRecommended ? "1px solid rgba(66,133,244,0.4)" : "1px solid var(--c-chip-border)",
                          background: isSelected ? "rgba(255,110,64,0.07)" : isRecommended ? "rgba(66,133,244,0.05)" : "var(--c-card)",
                          fontSize: 12, textAlign: "left",
                          color: isSelected ? "#FF6E40" : "var(--c-text3)",
                          fontWeight: isSelected ? 600 : 400,
                          cursor: "pointer", transition: "all 0.15s",
                          position: "relative",
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 11 }}>{desc.icon}</span>
                          <span>{chat}</span>
                          {isRecommended && (
                            <span style={{ fontSize: 9, fontWeight: 700, color: "#4285F4", background: "rgba(66,133,244,0.12)", borderRadius: 100, padding: "1px 5px", marginLeft: 2 }}>
                              ✨
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 10, color: isSelected ? "rgba(255,110,64,0.7)" : "var(--c-text4)", marginTop: 1, fontWeight: 400 }}>
                          {lang === "pl" ? desc.pl : desc.en}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, color: "var(--c-text3)", fontWeight: 600, minWidth: 90 }}>{t.output_for}</span>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {[
                    { en: "📧 Email", pl: "📧 Email", v: "Email" },
                    { en: "📊 Excel", pl: "📊 Excel", v: "Excel" },
                    { en: "📑 PowerPoint", pl: "📑 PowerPoint", v: "PowerPoint" },
                    { en: "📄 Document", pl: "📄 Dokument", v: "Document" },
                    { en: "💬 General", pl: "💬 Ogólny", v: "General" },
                  ].map(({ en: enL, pl: plL, v }) => (
                    <button
                      key={v}
                      onClick={() => setSelectedProduct(v)}
                      style={{
                        padding: "5px 12px", borderRadius: 100,
                        border: selectedProduct === v ? "1px solid #FF8A65" : "1px solid var(--c-chip-border)",
                        background: selectedProduct === v ? "rgba(255,110,64,0.07)" : "var(--c-card)",
                        fontSize: 12,
                        color: selectedProduct === v ? "#FF6E40" : "var(--c-text3)",
                        fontWeight: selectedProduct === v ? 600 : 400,
                        cursor: "pointer", transition: "all 0.15s",
                      }}
                    >{lang === "pl" ? plL : enL}</button>
                  ))}
                </div>
              </div>
              <p style={{ fontSize: 12, color: "var(--c-text4)", textAlign: "center", marginTop: 2 }}>
                {trustBadge}
              </p>
            </div>

            {/* Action bar */}
            <div style={{
              padding: isMobile ? "12px 16px" : "14px 24px", borderTop: "1px solid var(--c-sep)",
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center",
              gap: isMobile ? 10 : 12,
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                <div style={{ fontSize: 13, color: "var(--c-text4)" }}>
                  {input.length > 0 ? t.chars_hint(input.length) : t.paste_hint}
                </div>
                {/* Anonymize checkbox */}
                <label style={{
                  display: "flex", alignItems: "center", gap: 6,
                  fontSize: 12, color: "var(--c-text3)", cursor: "pointer",
                  userSelect: "none",
                  padding: "4px 8px", borderRadius: 8,
                  background: anonymize ? "rgba(255,110,64,0.06)" : "transparent",
                  border: `1px solid ${anonymize ? "rgba(255,110,64,0.2)" : "transparent"}`,
                  transition: "all 0.15s",
                }}>
                  <input
                    type="checkbox"
                    checked={anonymize}
                    onChange={e => setAnonymize(e.target.checked)}
                    style={{ width: 14, height: 14, accentColor: "#FF6E40", cursor: "pointer" }}
                  />
                  🔒 {lang === "pl" ? "Anonimizuj" : "Anonymize"}
                </label>
              </div>
              <button
                onClick={optimizePrompt}
                disabled={loading || !input.trim()}
                style={{
                  width: isMobile ? "100%" : "auto",
                  padding: isMobile ? "13px" : "11px 26px", borderRadius: 12, border: "none",
                  background: loading
                    ? "linear-gradient(135deg, #FFAB91, #FFCCBC)"
                    : input.trim()
                    ? "linear-gradient(135deg, #FF6E40, #FF8A65)"
                    : "var(--c-count-bg)",
                  color: input.trim() ? "white" : "var(--c-text4)",
                  fontSize: 15, fontWeight: 600,
                  cursor: input.trim() ? "pointer" : "default",
                  boxShadow: input.trim() ? "0 4px 16px rgba(255,110,64,0.3)" : "none",
                  transition: "all 0.3s",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                {loading ? (
                  <>
                    <span style={{
                      display: "inline-block", width: 16, height: 16,
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTopColor: "white", borderRadius: "50%",
                      animation: "spin 0.8s linear infinite",
                    }} />
                    {t.thinking}
                  </>
                ) : t.polish_btn}
              </button>
            </div>

            {/* Personalise (collapsible) */}
            <div style={{ borderTop: "1px solid var(--c-sep)" }}>
              <button
                onClick={() => setContextOpen((v) => !v)}
                style={{
                  width: "100%", padding: "10px 24px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  background: "transparent", border: "none", cursor: "pointer",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--c-text4)", fontWeight: 500 }}>{t.personalise}</span>
                <span style={{
                  fontSize: 11, color: "var(--c-text4)",
                  transform: contextOpen ? "rotate(180deg)" : "rotate(0deg)",
                  transition: "transform 0.2s", display: "inline-block",
                }}>▼</span>
              </button>
              {contextOpen && (
                <div style={{ padding: "4px 24px 20px", display: "flex", flexWrap: "wrap", gap: 12, animation: "fadeUp 0.2s ease" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 160px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--c-text4)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.your_role}</label>
                    <select
                      value={role} onChange={(e) => setRole(e.target.value)}
                      style={{
                        padding: "8px 12px", borderRadius: 10,
                        border: "1px solid var(--c-input-border)",
                        fontSize: 13, color: role ? "var(--c-text1)" : "var(--c-text4)",
                        background: "var(--c-input)", outline: "none", cursor: "pointer",
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      <option value="">{t.select_role}</option>
                      {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "2 1 200px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--c-text4)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.your_goal}</label>
                    <input
                      type="text" value={goal} onChange={(e) => setGoal(e.target.value)}
                      placeholder={t.goal_placeholder}
                      style={{
                        padding: "8px 12px", borderRadius: 10,
                        border: "1px solid var(--c-input-border)",
                        fontSize: 13, color: "var(--c-text1)", background: "var(--c-input)",
                        outline: "none", fontFamily: "'DM Sans', sans-serif",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
                    />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 5, flex: "1 1 140px" }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "var(--c-text4)", textTransform: "uppercase", letterSpacing: "0.4px" }}>{t.your_name}</label>
                    <input
                      type="text" value={userName} onChange={(e) => setUserName(e.target.value)}
                      placeholder={t.name_placeholder}
                      style={{
                        padding: "8px 12px", borderRadius: 10,
                        border: "1px solid var(--c-input-border)",
                        fontSize: 13, color: "var(--c-text1)", background: "var(--c-input)",
                        outline: "none", fontFamily: "'DM Sans', sans-serif",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#FF8A65")}
                      onBlur={(e) => (e.target.style.borderColor = "var(--c-input-border)")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Signup error */}
          {error === "signup" && (
            <div style={{
              marginTop: 16, padding: "18px 24px", borderRadius: 16,
              background: "var(--c-card)", border: "1px solid rgba(255,110,64,0.15)",
              textAlign: "center",
            }}>
              <p style={{ fontSize: 14, color: "var(--c-text2)", marginBottom: 12 }}>{t.used_all(MAX_FREE)}</p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  await submitWaitlist(() => { setEmailSubmitted(true); setError(""); setUsageCount(0); });
                }}
                style={{ display: "flex", gap: 8, justifyContent: "center", flexWrap: "wrap" }}
              >
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ padding: "10px 16px", borderRadius: 10, border: "1px solid var(--c-input-border)", fontSize: 14, outline: "none", minWidth: 220, background: "var(--c-input)", color: "var(--c-text1)" }} />
                <button type="submit" style={{ padding: "10px 20px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #FF6E40, #FF8A65)", color: "white", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t.unlock}</button>
              </form>
            </div>
          )}
          {error && error !== "signup" && (
            <div style={{
              marginTop: 16, padding: "14px 24px", borderRadius: 12,
              background: error === "region" ? "rgba(33,150,243,0.06)" : "var(--c-err-bg)",
              border: `1px solid ${error === "region" ? "rgba(33,150,243,0.2)" : "var(--c-err-border)"}`,
              fontSize: 14,
              color: error === "region" ? "#1565C0" : "#E53935",
              textAlign: "center",
            }}>
              {error === "ratelimit" && t.err_ratelimit}
              {error === "region" && t.err_region}
              {error === "overloaded" && t.err_overloaded}
              {error === "network" && t.err_network}
            </div>
          )}

          {/* Results */}
          {showResults && optimized && (
            <div ref={resultRef} style={{
              marginTop: 24, background: "var(--c-card)", borderRadius: 20,
              border: "1px solid var(--c-result-border)",
              boxShadow: "var(--c-card-shadow)",
              overflow: "hidden", animation: "fadeUp 0.5s ease",
            }}>
              {/* Header with fun message */}
              <div style={{
                padding: "12px 24px", background: "var(--c-green-bg)",
                borderBottom: "1px solid var(--c-sep)",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                flexWrap: "wrap", gap: 8,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#43A047" }}>
                    ✨ {t.mikes_version}
                  </span>
                  <span style={{
                    fontSize: 12, color: "#FF6E40", fontWeight: 500,
                    background: "rgba(255,110,64,0.08)", borderRadius: 100, padding: "2px 10px",
                  }}>
                    {getFunMessage(input, lang)}
                  </span>
                </div>
                <button
                  onClick={() => copyText(optimized)}
                  style={{ padding: "6px 14px", borderRadius: 8, border: "1px solid var(--c-card-border)", background: "var(--c-card)", fontSize: 12, color: "var(--c-text2)", cursor: "pointer", fontWeight: 500, transition: "all 0.2s" }}
                  onMouseOver={(e) => { e.currentTarget.style.borderColor = "#FF8A65"; e.currentTarget.style.color = "#FF6E40"; }}
                  onMouseOut={(e) => { e.currentTarget.style.borderColor = "var(--c-card-border)"; e.currentTarget.style.color = "var(--c-text2)"; }}
                >{t.copy_prompt}</button>
              </div>

              {/* Prompt text */}
              <div style={{ padding: "20px 24px" }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, lineHeight: 1.8, color: "var(--c-text1)", whiteSpace: "pre-wrap" }}>
                  {optimized}
                </div>
              </div>

              {/* Savings estimate */}
              <div style={{ padding: "8px 24px 10px", borderTop: "1px solid var(--c-sep)", background: "var(--c-stat-bg)" }}>
                <span style={{ fontSize: 12, color: "var(--c-text3)" }}>
                  {getSavingsEstimate(input.length, fixes.length, lang)}
                </span>
              </div>

              {/* What Mike fixed */}
              {fixes.length > 0 && (
                <div style={{ padding: "16px 24px 20px", borderTop: "1px solid var(--c-sep)", background: "rgba(255,110,64,0.02)" }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--c-text4)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.5px" }}>{t.what_fixed}</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {fixes.map((fix, i) => (
                      <div key={i} style={{ fontSize: 13, color: "var(--c-prompt-text)", lineHeight: 1.5, padding: "8px 12px", borderRadius: 10, background: "var(--c-fix-bg)", border: "1px solid var(--c-fix-border)" }}>
                        {fix}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Recommendation — clean inline section */}
              {recommendation && (
                <div style={{ padding: "14px 24px", borderTop: "1px solid var(--c-sep)", background: "rgba(255,110,64,0.02)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 18, lineHeight: 1.2, flexShrink: 0 }}>
                      {TOOL_ICONS[recommendation.bestTool] ?? "🤖"}
                    </span>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--c-text1)" }}>
                          {lang === "pl" ? "Najlepszy model do tego zadania:" : "Best model for this task:"}
                        </span>
                        <span style={{
                          fontSize: 12, fontWeight: 700, color: "#FF6E40",
                          background: "rgba(255,110,64,0.08)", borderRadius: 100, padding: "2px 10px",
                          border: "1px solid rgba(255,110,64,0.2)",
                        }}>
                          {recommendation.bestTool}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: "var(--c-text2)", marginBottom: 4 }}>{recommendation.reason}</div>
                      {recommendation.tip && (
                        <div style={{ fontSize: 12, color: "var(--c-text3)", fontStyle: "italic" }}>💡 {recommendation.tip}</div>
                      )}
                      {recommendation.alternativeTool && (
                        <div style={{ fontSize: 11, color: "var(--c-text4)", marginTop: 6 }}>
                          {lang === "pl" ? "Alternatywa:" : "Alternative:"} <strong>{recommendation.alternativeTool}</strong> — {recommendation.alternativeReason}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Pro tip — localized */}
              {proTip && (
                <div style={{ padding: "14px 24px", borderTop: "1px solid var(--c-sep)", background: "var(--c-tip-bg)" }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                    <span style={{ fontSize: 14, lineHeight: 1.4 }}>💡</span>
                    <span style={{ fontSize: 12, color: "var(--c-text2)", lineHeight: 1.6 }}>
                      <span style={{ fontWeight: 700, color: "#E65100" }}>{t.pro_tip_label}</span>
                      {getLocalizedProTip(proTip, lang)}
                    </span>
                  </div>
                </div>
              )}

              {/* Feedback */}
              <div style={{ padding: "14px 24px", borderTop: "1px solid var(--c-sep)", display: "flex", alignItems: "center", gap: 12 }}>
                {feedback ? (
                  <span style={{ fontSize: 13, color: "#43A047", fontWeight: 500 }}>{t.thanks_feedback}</span>
                ) : (
                  <>
                    <span style={{ fontSize: 13, color: "var(--c-text3)" }}>{t.was_helpful}</span>
                    {(["positive", "negative"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => handleFeedback(type)}
                        style={{ padding: "6px 14px", borderRadius: 10, border: "1px solid var(--c-chip-border)", background: "var(--c-card)", fontSize: 16, cursor: "pointer", transition: "all 0.18s" }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.borderColor = type === "positive" ? "#43A047" : "#E53935";
                          e.currentTarget.style.background = type === "positive" ? "rgba(67,160,71,0.06)" : "rgba(229,57,53,0.06)";
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.borderColor = "var(--c-chip-border)";
                          e.currentTarget.style.background = "var(--c-card)";
                        }}
                      >{type === "positive" ? "👍" : "👎"}</button>
                    ))}
                  </>
                )}
              </div>
            </div>
          )}

          {/* Waitlist */}
          {!emailSubmitted ? (
            <div style={{
              marginTop: 40, padding: "16px 20px", borderRadius: 14,
              background: "var(--c-card)", border: "1px solid var(--c-card-border)",
              display: "flex", alignItems: "center", flexWrap: "wrap", gap: 12, justifyContent: "center",
            }}>
              <span style={{ fontSize: 14, color: "var(--c-text2)" }}>{t.like_mike}</span>
              <form onSubmit={async (e) => { e.preventDefault(); await submitWaitlist(() => setEmailSubmitted(true)); }} style={{ display: "flex", gap: 8 }}>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  style={{ padding: "8px 14px", borderRadius: 10, border: "1px solid var(--c-input-border)", fontSize: 13, outline: "none", width: 180, background: "var(--c-input)", color: "var(--c-text1)", transition: "border-color 0.2s" }}
                  onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = "#FF8A65")}
                  onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = "var(--c-input-border)")}
                />
                <button type="submit" style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #FF6E40, #FF8A65)", color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{t.join}</button>
              </form>
            </div>
          ) : (
            <div style={{ marginTop: 40, padding: "14px 24px", borderRadius: 14, background: "var(--c-green-bg)", border: "1px solid var(--c-green-border)", textAlign: "center" }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--c-green-text)" }}>{t.on_list}</p>
            </div>
          )}

        </>)}

        {/* Footer — visible on all tabs */}
        <footer style={{ marginTop: 60, paddingBottom: 24, textAlign: "center", fontSize: 13, color: "var(--c-text4)" }}>
          {t.footer}
          <a href="mailto:hello@mikeprompt.com" style={{ color: "var(--c-text4)", textDecoration: "none" }}>
            hello@mikeprompt.com
          </a>
          <span style={{ margin: "0 8px" }}>·</span>
          <a href="/privacy" style={{ color: "var(--c-text4)", textDecoration: "none" }}>
            {lang === "pl" ? "Prywatność" : "Privacy"}
          </a>
          <span style={{ margin: "0 8px" }}>·</span>
          <a href="/terms" style={{ color: "var(--c-text4)", textDecoration: "none" }}>
            {lang === "pl" ? "Regulamin" : "Terms"}
          </a>
          <span style={{ margin: "0 8px" }}>·</span>
          <a href="/security" style={{ color: "var(--c-text4)", textDecoration: "none" }}>
            {lang === "pl" ? "Bezpieczeństwo" : "Security"}
          </a>
        </footer>
      </main>

      <style>{`
        ${CSS_VARS}
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        * { margin: 0; padding: 0; box-sizing: border-box; }
        textarea::placeholder, input::placeholder { color: var(--c-text4); }
        select option { color: #2D2A26; background: white; }
        [data-theme="dark"] select option { color: #E0DAD4; background: #2C2925; }
      `}</style>
      <CookieBanner lang={lang} />
    </div>
  );
};

export default MikePromptMVP;
