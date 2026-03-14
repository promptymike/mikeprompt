"use client";

type Lang = "en" | "pl";

const T = {
  en: {
    hero_title: "Built by people who actually do the work.",
    hero_body: "MikePrompt was created by senior auditors, financial controllers, and startup operators who got tired of wasting time on bad AI prompts.",
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
    promise_body: " We don't store your prompts. We don't train models on your input. Mike runs on Claude by Anthropic — the same AI trusted by enterprises worldwide. We charge only to keep the lights on, not to get rich off your data.",
    for_all_label: "For everyone",
    for_all: "MikePrompt is for every professional who uses AI at work — finance, sales, admin, accounting, management, HR, students. We believe AI should make humans better, not replace them. Every feature we build answers one question:",
    for_all_strong: " does this help someone do their best work?",
    footer: "Made with 🧡 in Warsaw, Poland. For humans everywhere.",
  },
  pl: {
    hero_title: "Stworzony przez ludzi, którzy naprawdę tę pracę wykonują.",
    hero_body: "MikePrompt powstał dzięki starszym audytorom, kontrolerom finansowym i operatorom startupów, którzy mieli dość marnowania czasu na słabe prompty AI.",
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
    promise_body: " Nie przechowujemy twoich promptów. Nie trenujemy modeli na twoich danych. Mike działa na Claude od Anthropic — tym samym AI zaufanym przez firmy na całym świecie. Pobieramy opłaty tylko po to, żeby działać, nie żeby bogacić się na twoich danych.",
    for_all_label: "Dla każdego",
    for_all: "MikePrompt jest dla każdego profesjonalisty, który używa AI w pracy — finanse, sprzedaż, administracja, księgowość, zarządzanie, HR, studenci. Wierzymy, że AI powinno czynić ludzi lepszymi, nie zastępować ich. Każda funkcja, którą budujemy, odpowiada na jedno pytanie:",
    for_all_strong: " czy to pomaga komuś wykonywać swoją najlepszą pracę?",
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

      {/* Section footer */}
      <div style={{ textAlign: "center", padding: "24px 0", color: "var(--c-text3)", fontSize: 14 }}>
        {t.footer}
      </div>
    </div>
  );
}
