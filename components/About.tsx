"use client";

type Lang = "en" | "pl";

const T = {
  en: {
    hero_title: "Why Mike, not just ChatGPT?",
    hero_body: "Mike understands your professional context. It knows your role, your tools, and your industry — giving you prompts that actually work, not generic AI output.",
    story_label: "Our story",
    story_p1_pre: "We spent years in Big 4 audit and finance at award-winning startups. We wrote thousands of reports, emails, and analyses. When AI arrived, we saw everyone struggling with the same problem — they knew ",
    story_p1_what: "WHAT",
    story_p1_mid: " they wanted, but couldn't tell AI ",
    story_p1_how: "HOW",
    story_p1_post: " to deliver it.",
    story_p2: "Mike fixes that gap. Not by replacing you — by making you faster, sharper, and more precise.",
    story_p2_strong: "Your knowledge + Mike's prompting expertise = results that used to take hours, done in minutes.",
    for_you_label: "This is for you if…",
    for_you: [
      { icon: "🚀", title: "You want a promotion", body: "Better outputs = better visibility. Show your boss what you can do when AI actually listens." },
      { icon: "⏰", title: "You want your time back", body: "Stop spending 30 minutes fighting ChatGPT. Get it right on the first try." },
      { icon: "💪", title: "You want to stay ahead", body: "AI won't replace you. But someone using AI well might. Be that person." },
    ],
    creds_label: "Built with experience from:",
    creds_note: "These represent our team's professional background, not partnerships or endorsements.",
    promise_label: "Our promise",
    promise: "Your data is yours.",
    promise_body: " By default we save your prompt history so you can access it anytime. You can disable this anytime in your profile settings. We never train models on your input. Mike runs on Claude by Anthropic — the same AI trusted by enterprises worldwide. We charge only to keep the lights on, not to get rich off your data.",
    privacy_label: "What we collect",
    privacy_items: [
      { icon: "📧", title: "Account email", body: "Used only for login and confirmation. Never shared." },
      { icon: "📝", title: "Prompt content", body: "By default we save your polished prompts so you can access your history. You can disable this in profile settings — then we store nothing." },
      { icon: "🚫", title: "What we never do", body: "We never train AI models on your data. We never sell your data. We never share it with third parties." },
    ],
    for_all_label: "For everyone",
    for_all: "MikePrompt is for every professional who uses AI at work — finance, sales, admin, accounting, management, HR, students. We believe AI should make humans better, not replace them. Every feature we build answers one question:",
    for_all_strong: " does this help someone do their best work?",
    trust_label: "Privacy & Security",
    trust_items: [
      "✅ Data stays in EU (Supabase servers: Ireland)",
      "✅ We never train AI on your prompts",
      "✅ GDPR and AI Act compliant",
      "✅ Client data masked locally before reaching AI",
    ],
    footer: "Made with 🧡 in Warsaw, Poland. For humans everywhere.",
  },
  pl: {
    hero_title: "Dlaczego Mike, nie zwykły ChatGPT?",
    hero_body: "Mike zna polskie realia biurowe. Wie czym różni się faktura korygująca od noty, rozumie kontekst US i ZUS, i dba o RODO — bo Twoje dane klientów nie mogą wyciec do Silicon Valley.",
    story_label: "Nasza historia",
    story_p1_pre: "Spędziliśmy lata w audycie Big 4 i finansach w nagradzanych startupach. Napisaliśmy tysiące raportów, emaili i analiz. Kiedy przyszło AI, widzieliśmy, jak wszyscy borykają się z tym samym problemem — wiedzieli ",
    story_p1_what: "CO",
    story_p1_mid: " chcą, ale nie potrafili powiedzieć AI ",
    story_p1_how: "JAK",
    story_p1_post: " to dostarczyć.",
    story_p2: "Mike wypełnia tę lukę. Nie zastępując cię — ale czyniąc cię szybszym, ostrzejszym i bardziej precyzyjnym.",
    story_p2_strong: "Twoja wiedza + ekspertyza Mike'a w promptowaniu = wyniki, które kiedyś zajmowały godziny, teraz gotowe w minuty.",
    for_you_label: "To jest dla ciebie, jeśli…",
    for_you: [
      { icon: "🚀", title: "Chcesz awansu", body: "Lepsze wyniki = lepsza widoczność. Pokaż szefowi, na co cię stać, gdy AI naprawdę słucha." },
      { icon: "⏰", title: "Chcesz odzyskać czas", body: "Przestań tracić 30 minut na walkę z ChatGPT. Zrób to dobrze za pierwszym razem." },
      { icon: "💪", title: "Chcesz być o krok do przodu", body: "AI cię nie zastąpi. Ale ktoś, kto dobrze go używa, może. Bądź tą osobą." },
    ],
    creds_label: "Zbudowany z doświadczeniem z:",
    creds_note: "To odzwierciedla zawodowe doświadczenie naszego zespołu, nie partnerstwa ani rekomendacje.",
    promise_label: "Nasza obietnica",
    promise: "Twoje dane są twoje.",
    promise_body: " Domyślnie zapisujemy Twoją historię promptów — masz do niej dostęp zawsze. Możesz to wyłączyć w ustawieniach profilu. Nigdy nie trenujemy modeli na Twoich danych. Mike działa na Claude od Anthropic — tym samym AI zaufanym przez firmy na całym świecie. Pobieramy opłaty tylko po to, żeby działać, nie żeby bogacić się na Twoich danych.",
    privacy_label: "Co zbieramy",
    privacy_items: [
      { icon: "📧", title: "Email konta", body: "Używany wyłącznie do logowania i potwierdzenia. Nigdy nikomu nieudostępniany." },
      { icon: "📝", title: "Treść promptów", body: "Domyślnie zapisujemy Twoje wypolerowane prompty, abyś miał dostęp do historii. Możesz wyłączyć tę opcję w ustawieniach profilu — wtedy nie zapisujemy żadnych treści." },
      { icon: "🚫", title: "Czego nigdy nie robimy", body: "Nigdy nie trenujemy modeli AI na Twoich danych. Nigdy nie sprzedajemy danych. Nigdy nie udostępniamy ich stronom trzecim." },
    ],
    for_all_label: "Dla każdego",
    for_all: "MikePrompt jest dla każdego profesjonalisty, który używa AI w pracy — finanse, sprzedaż, administracja, księgowość, zarządzanie, HR, studenci. Wierzymy, że AI powinno czynić ludzi lepszymi, nie zastępować ich. Każda funkcja, którą budujemy, odpowiada na jedno pytanie:",
    for_all_strong: " czy to pomaga komuś wykonywać swoją najlepszą pracę?",
    trust_label: "Prywatność i bezpieczeństwo",
    trust_items: [
      "✅ Dane nie opuszczają UE (serwery Supabase: Irlandia)",
      "✅ Nie trenujemy AI na Twoich promptach",
      "✅ Zgodne z RODO i AI Act",
      "✅ Dane klientów maskowane lokalnie — zanim trafią do AI",
    ],
    footer: "Zrobione z 🧡 w Warszawie, Polska. Dla ludzi wszędzie.",
  },
};

export default function About({ lang = "en" }: { lang?: Lang }) {
  const t = T[lang];

  return (
    <div>
      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h2 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(26px, 5vw, 40px)",
          fontWeight: 700, lineHeight: 1.15, letterSpacing: "-0.8px",
          marginBottom: 16, color: "var(--c-text1)",
        }}>
          {t.hero_title}
        </h2>
        <p style={{ fontSize: 16, color: "var(--c-text2)", maxWidth: 520, margin: "0 auto", lineHeight: 1.65 }}>
          {t.hero_body}
        </p>
      </div>

      {/* Our story */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "26px 30px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6E40", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>
          {t.story_label}
        </div>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78, marginBottom: 14 }}>
          {t.story_p1_pre}<strong style={{ color: "var(--c-text1)" }}>{t.story_p1_what}</strong>{t.story_p1_mid}<strong style={{ color: "var(--c-text1)" }}>{t.story_p1_how}</strong>{t.story_p1_post}
        </p>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78 }}>
          {t.story_p2}{" "}
          <strong style={{ color: "var(--c-text1)" }}>
            {t.story_p2_strong}
          </strong>
        </p>
      </div>

      {/* This is for you if... */}
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
          textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14,
        }}>
          {t.for_you_label}
        </div>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          {t.for_you.map((card) => (
            <div key={card.title} style={{
              flex: "1 1 200px", minWidth: 180,
              background: "var(--c-card)", borderRadius: 16,
              border: "1px solid var(--c-card-border)",
              padding: "20px 22px",
            }}>
              <div style={{ fontSize: 24, marginBottom: 10 }}>{card.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--c-text1)", marginBottom: 7 }}>{card.title}</div>
              <div style={{ fontSize: 13, color: "var(--c-text2)", lineHeight: 1.62 }}>{card.body}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Credentials */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20, textAlign: "center",
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
          textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 18,
        }}>
          {t.creds_label}
        </div>
        <div style={{
          display: "flex", gap: 20, justifyContent: "center",
          alignItems: "center", flexWrap: "wrap", marginBottom: 14,
        }}>
          {["PwC", "Big 4 Audit", "Series B Startups", "ACCA Qualified", "Award-winning ConTech"].map((cred) => (
            <span key={cred} style={{
              fontSize: 14, fontWeight: 700, color: "var(--c-text4)",
              fontFamily: "'Fraunces', serif", letterSpacing: "0.2px",
            }}>
              {cred}
            </span>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "var(--c-text4)", fontStyle: "italic", margin: 0 }}>
          {t.creds_note}
        </p>
      </div>

      {/* Our promise */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#FF6E40", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12 }}>
          {t.promise_label}
        </div>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78, margin: 0 }}>
          🔒 <strong style={{ color: "var(--c-text1)" }}>{t.promise}</strong>{t.promise_body}
        </p>
      </div>

      {/* What we collect */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-text3)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 16 }}>
          {t.privacy_label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {t.privacy_items.map(item => (
            <div key={item.title} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--c-text1)", marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: "var(--c-text3)", lineHeight: 1.6 }}>{item.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* For everyone */}
      <div style={{
        background: "var(--c-card)", borderRadius: 18,
        border: "1px solid var(--c-card-border)",
        padding: "22px 30px", marginBottom: 20,
      }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "var(--c-text3)",
          textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 12,
        }}>
          {t.for_all_label}
        </div>
        <p style={{ fontSize: 15, color: "var(--c-text2)", lineHeight: 1.78, margin: 0 }}>
          {t.for_all}
          <strong style={{ color: "var(--c-text1)" }}>{t.for_all_strong}</strong>
        </p>
      </div>

      {/* GDPR trust block */}
      <div style={{
        background: "var(--c-green-bg, rgba(46,125,50,0.06))",
        border: "1px solid var(--c-green-border, rgba(46,125,50,0.18))",
        borderRadius: 18, padding: "22px 30px", marginBottom: 20,
      }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--c-green-text, #2E7D32)", textTransform: "uppercase", letterSpacing: "0.7px", marginBottom: 14 }}>
          {t.trust_label}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {t.trust_items.map((item) => (
            <div key={item} style={{ fontSize: 14, color: "var(--c-text2)", lineHeight: 1.5 }}>{item}</div>
          ))}
        </div>
      </div>

      {/* Section footer */}
      <div style={{ textAlign: "center", padding: "24px 0", color: "var(--c-text3)", fontSize: 14 }}>
        {t.footer}
      </div>
    </div>
  );
}
