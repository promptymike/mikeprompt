"use client";
import { useState, useEffect } from "react";
import LegalPage from "@/components/LegalPage";

type Lang = "en" | "pl";

export default function SecurityPage() {
  const [lang, setLang] = useState<Lang>("en");

  useEffect(() => {
    const stored = localStorage.getItem("mikeprompt_lang");
    if (stored === "pl" || stored === "en") setLang(stored);
  }, []);

  const toggle = () => setLang(l => l === "pl" ? "en" : "pl");
  const title = lang === "pl" ? "Bezpieczeństwo" : "Security";

  return (
    <LegalPage title={title} lang={lang} onToggleLang={toggle}>

      {/* Data controller box */}
      <div style={{
        background: "rgba(255,110,64,0.04)",
        border: "1px solid rgba(255,110,64,0.15)",
        borderRadius: 16, padding: "20px 24px", marginBottom: 32,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#FF6E40", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 12 }}>
          {lang === "pl" ? "Administrator danych" : "Data Controller"}
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          <strong>MikePrompt</strong><br />
          {lang === "pl" ? "Warszawa, Polska" : "Warsaw, Poland"}<br />
          📧 <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a><br />
          🛡️ {lang === "pl"
            ? <>Organ nadzorczy: <a href="https://uodo.gov.pl" style={{ color: "#FF6E40" }}>UODO</a> — Prezes Urzędu Ochrony Danych Osobowych</>
            : <>Supervisory authority: <a href="https://uodo.gov.pl" style={{ color: "#FF6E40" }}>UODO (Poland)</a></>}
        </p>
      </div>

      {lang === "pl" ? <>
        <h2>Jak chronimy Twoje dane</h2>
        <ul>
          <li><strong>Szyfrowanie w tranzycie</strong> — całość ruchu przez HTTPS/TLS 1.3</li>
          <li><strong>Szyfrowanie w spoczynku</strong> — dane w bazie Supabase szyfrowane AES-256</li>
          <li><strong>Brak cookies śledzących</strong> — używamy wyłącznie localStorage, bez trackerów</li>
          <li><strong>Rate limiting</strong> — ochrona przed automatycznym nadużywaniem API</li>
          <li><strong>Izolacja danych</strong> — każdy użytkownik widzi tylko swoje dane (Row Level Security)</li>
        </ul>

        <h2>Co wysyłamy do AI (Anthropic)</h2>
        <p>
          Twój prompt jest przesyłany do API Anthropic Claude w celu optymalizacji.
          Anthropic <strong>nie trenuje modeli</strong> na danych przesyłanych przez API.
          Szczegóły: <a href="https://www.anthropic.com/privacy" style={{ color: "#FF6E40" }}>anthropic.com/privacy</a>
        </p>

        <h2>Historia promptów</h2>
        <p>
          Domyślnie zapisujemy Twoje wypolerowane prompty — masz do nich dostęp w zakładce Historia.
          Możesz wyłączyć tę opcję w ustawieniach profilu — po wyłączeniu żadne treści nie są zapisywane.
        </p>

        <h2>Infrastruktura</h2>
        <ul>
          <li><strong>Hosting</strong> — Vercel (Edge Network, automatyczne HTTPS)</li>
          <li><strong>Baza danych</strong> — Supabase (region EU — Irlandia)</li>
          <li><strong>CDN / DDoS</strong> — Cloudflare</li>
          <li><strong>Email</strong> — Resend (wyłącznie emaile transakcyjne)</li>
        </ul>

        <h2>Zgłaszanie luk bezpieczeństwa</h2>
        <p>
          Jeśli odkryłeś lukę bezpieczeństwa, napisz na{" "}
          <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a>.
          Odpowiemy w ciągu 48 godzin.
        </p>
      </> : <>
        <h2>How We Protect Your Data</h2>
        <ul>
          <li><strong>Encryption in transit</strong> — all traffic over HTTPS/TLS 1.3</li>
          <li><strong>Encryption at rest</strong> — Supabase database encrypted with AES-256</li>
          <li><strong>No tracking cookies</strong> — localStorage only, no trackers</li>
          <li><strong>Rate limiting</strong> — protection against automated API abuse</li>
          <li><strong>Data isolation</strong> — each user sees only their own data (Row Level Security)</li>
        </ul>

        <h2>What We Send to AI (Anthropic)</h2>
        <p>
          Your prompt is sent to the Anthropic Claude API for optimization.
          Anthropic <strong>does not train models</strong> on API data.
          Details: <a href="https://www.anthropic.com/privacy" style={{ color: "#FF6E40" }}>anthropic.com/privacy</a>
        </p>

        <h2>Prompt History</h2>
        <p>
          By default we save your polished prompts so you can access them in the History tab.
          You can disable this in profile settings — once disabled, nothing is stored.
        </p>

        <h2>Infrastructure</h2>
        <ul>
          <li><strong>Hosting</strong> — Vercel (Edge Network, automatic HTTPS)</li>
          <li><strong>Database</strong> — Supabase (EU region — Ireland)</li>
          <li><strong>CDN / DDoS</strong> — Cloudflare</li>
          <li><strong>Email</strong> — Resend (transactional only)</li>
        </ul>

        <h2>Reporting Security Issues</h2>
        <p>
          If you discover a security vulnerability, contact us at{" "}
          <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a>.
          We respond within 48 hours.
        </p>
      </>}
    </LegalPage>
  );
}
