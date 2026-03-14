"use client";
import { useState, useEffect } from "react";
import LegalPage from "@/components/LegalPage";

type Lang = "en" | "pl";

function PrivacyEN() {
  return <>
    <p style={{ fontSize: 13, color: "#A09890", marginBottom: 32 }}>Last updated: March 2025</p>

    <h2>1. Data Controller</h2>
    <p>
      <strong>MikePrompt</strong> (individual operator)<br />
      Warsaw, Poland<br />
      Email: <a href="mailto:hello@mikeprompt.com">hello@mikeprompt.com</a><br />
      Supervisory authority: <a href="https://uodo.gov.pl">UODO (Poland)</a>
    </p>

    <h2>2. What We Collect</h2>
    <ul>
      <li><strong>Email address</strong> — when you register, used for login and communication</li>
      <li><strong>Profile data</strong> — role, industry (optional, you provide voluntarily)</li>
      <li><strong>Prompt history</strong> — only if enabled in your profile settings</li>
      <li><strong>Technical data</strong> — IP address for abuse prevention (kept 30 days), browser, access time</li>
    </ul>

    <h2>3. What We Don&apos;t Do</h2>
    <ul>
      <li>We don&apos;t sell your data</li>
      <li>We don&apos;t train AI models on your prompts</li>
      <li>We don&apos;t use advertising cookies</li>
      <li>We don&apos;t share your email without consent</li>
    </ul>

    <h2>4. Legal Basis (GDPR)</h2>
    <ul>
      <li><strong>Contract performance</strong> (Art. 6.1.b) — account and service operation</li>
      <li><strong>Legitimate interest</strong> (Art. 6.1.f) — security and abuse prevention</li>
      <li><strong>Consent</strong> (Art. 6.1.a) — prompt history (withdraw anytime in settings)</li>
    </ul>

    <h2>5. Third-Party Processors</h2>
    <ul>
      <li><strong>Anthropic</strong> (USA) — AI processing via API. Does not train on API data. <a href="https://www.anthropic.com/privacy">Privacy policy</a></li>
      <li><strong>Supabase</strong> (EU/Ireland) — database and authentication. Data stored in EU region.</li>
      <li><strong>Vercel</strong> (USA) — hosting. <a href="https://vercel.com/legal/privacy-policy">Privacy policy</a></li>
      <li><strong>Resend</strong> (USA) — transactional emails (registration, password reset)</li>
      <li><strong>Cloudflare</strong> (USA) — DDoS protection, CDN. Processes network traffic metadata.</li>
    </ul>
    <p>All US transfers via Standard Contractual Clauses (SCC).</p>

    <h2>6. Data Retention</h2>
    <ul>
      <li>Account data — until account deletion</li>
      <li>Prompt history — until disabled or account deleted</li>
      <li>IP logs — 30 days</li>
    </ul>

    <h2>7. Your Rights (GDPR)</h2>
    <p>Access, rectification, erasure, portability, objection, withdrawal of consent.</p>
    <p>
      Email: <a href="mailto:hello@mikeprompt.com">hello@mikeprompt.com</a> — we respond within 30 days.<br />
      You may also lodge a complaint with <a href="https://uodo.gov.pl">UODO (Poland)</a> or your local DPA.
    </p>

    <h2>8. Cookies</h2>
    <p>
      We use <strong>localStorage only</strong> (no tracking cookies).
      Cloudflare may set technical security cookies.
    </p>

    <p style={{ marginTop: 32, fontSize: 13, color: "#A09890" }}>
      Contact: <a href="mailto:hello@mikeprompt.com">hello@mikeprompt.com</a>
    </p>
  </>;
}

function PrivacyPL() {
  return <>
    <p style={{ fontSize: 13, color: "#A09890", marginBottom: 32 }}>Ostatnia aktualizacja: marzec 2025</p>

    <h2>1. Administrator danych osobowych</h2>
    <p>
      <strong>MikePrompt</strong> (operator indywidualny)<br />
      Warszawa, Polska<br />
      Email: <a href="mailto:hello@mikeprompt.com">hello@mikeprompt.com</a><br />
      Organ nadzorczy: <a href="https://uodo.gov.pl">UODO — Prezes Urzędu Ochrony Danych Osobowych</a>
    </p>

    <h2>2. Jakie dane zbieramy</h2>
    <ul>
      <li><strong>Adres email</strong> — przy rejestracji, do logowania i komunikacji</li>
      <li><strong>Dane profilu</strong> — rola zawodowa, branża (dobrowolne)</li>
      <li><strong>Historia promptów</strong> — tylko jeśli włączyłeś tę opcję w ustawieniach</li>
      <li><strong>Dane techniczne</strong> — adres IP (ochrona przed nadużyciami, przechowywany 30 dni), przeglądarka, czas dostępu</li>
    </ul>

    <h2>3. Czego NIE robimy</h2>
    <ul>
      <li>Nie sprzedajemy Twoich danych osobowych</li>
      <li>Nie trenujemy modeli AI na treści Twoich promptów</li>
      <li>Nie używamy cookies reklamowych</li>
      <li>Nie udostępniamy emaila bez Twojej zgody</li>
    </ul>

    <h2>4. Podstawa prawna przetwarzania (RODO)</h2>
    <ul>
      <li><strong>Wykonanie umowy</strong> (art. 6 ust. 1 lit. b) — rejestracja i korzystanie z usługi</li>
      <li><strong>Prawnie uzasadniony interes</strong> (art. 6 ust. 1 lit. f) — bezpieczeństwo, ochrona przed nadużyciami</li>
      <li><strong>Zgoda</strong> (art. 6 ust. 1 lit. a) — historia promptów (możesz wycofać w ustawieniach)</li>
    </ul>

    <h2>5. Podmioty przetwarzające dane (Processorzy)</h2>
    <ul>
      <li><strong>Anthropic</strong> (USA) — przetwarzanie AI przez API. Nie trenuje modeli na danych z API. <a href="https://www.anthropic.com/privacy">Polityka prywatności</a></li>
      <li><strong>Supabase</strong> (UE — Irlandia) — baza danych i uwierzytelnianie. Dane w regionie EU.</li>
      <li><strong>Vercel</strong> (USA) — hosting aplikacji. <a href="https://vercel.com/legal/privacy-policy">Polityka prywatności</a></li>
      <li><strong>Resend</strong> (USA) — emaile transakcyjne (rejestracja, reset hasła)</li>
      <li><strong>Cloudflare</strong> (USA) — ochrona DDoS, CDN. Przetwarza metadane ruchu sieciowego.</li>
    </ul>
    <p>Przekazywanie danych do USA odbywa się na podstawie standardowych klauzul umownych (SCC).</p>

    <h2>6. Okres przechowywania danych</h2>
    <ul>
      <li>Dane konta — do momentu usunięcia konta</li>
      <li>Historia promptów — do wyłączenia opcji lub usunięcia konta</li>
      <li>Logi IP — 30 dni</li>
    </ul>

    <h2>7. Twoje prawa (RODO)</h2>
    <p>Dostęp, sprostowanie, usunięcie, przenoszenie, sprzeciw, wycofanie zgody.</p>
    <p>
      Email: <a href="mailto:hello@mikeprompt.com">hello@mikeprompt.com</a> — odpowiemy w ciągu 30 dni.<br />
      Możesz też wnieść skargę do <a href="https://uodo.gov.pl">UODO (Warszawa)</a>.
    </p>

    <h2>8. Cookies i localStorage</h2>
    <p>
      Używamy wyłącznie <strong>localStorage</strong> (bez cookies śledzących).
      Cloudflare może ustawiać techniczne cookies bezpieczeństwa.
    </p>

    <p style={{ marginTop: 32, fontSize: 13, color: "#A09890" }}>
      Kontakt: <a href="mailto:hello@mikeprompt.com">hello@mikeprompt.com</a>
    </p>
  </>;
}

export default function PrivacyPage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("mikeprompt_lang");
    if (stored === "pl" || stored === "en") setLang(stored);
  }, []);

  const toggle = () => setLang(l => l === "pl" ? "en" : "pl");

  const title = lang === "pl" ? "Polityka Prywatności" : "Privacy Policy";

  return (
    <LegalPage title={title} lang={lang} onToggleLang={toggle}>
      {lang === "pl" ? <PrivacyPL /> : <PrivacyEN />}
    </LegalPage>
  );
}
