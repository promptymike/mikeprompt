import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Bezpieczeństwo — MikePrompt",
  description: "Jak MikePrompt chroni Twoje dane i zapewnia bezpieczeństwo",
};

export default function SecurityPage() {
  return (
    <LegalPage title="Bezpieczeństwo">
      {/* Administrator danych */}
      <div style={{
        background: "rgba(255,110,64,0.04)",
        border: "1px solid rgba(255,110,64,0.15)",
        borderRadius: 16,
        padding: "20px 24px",
        marginBottom: 32,
      }}>
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: "#FF6E40",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          marginBottom: 12,
        }}>
          Administrator danych
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.7, margin: 0 }}>
          <strong>MikePrompt</strong><br />
          Warszawa, Polska<br />
          📧 <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a><br />
          🛡️ Organ nadzorczy: <a href="https://uodo.gov.pl" style={{ color: "#FF6E40" }}>UODO</a> — Prezes Urzędu Ochrony Danych Osobowych
        </p>
      </div>

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
        Dane są przetwarzane i zwracane — nie są przechowywane przez Anthropic po zakończeniu żądania.
        Szczegóły: <a href="https://www.anthropic.com/privacy" style={{ color: "#FF6E40" }}>anthropic.com/privacy</a>
      </p>

      <h2>Historia promptów</h2>
      <p>
        Domyślnie zapisujemy Twoje wypolerowane prompty, abyś miał do nich dostęp w zakładce Historia.
        Możesz wyłączyć tę opcję w ustawieniach profilu — po wyłączeniu żadne treści nie są zapisywane.
      </p>

      <h2>Infrastruktura</h2>
      <ul>
        <li><strong>Hosting</strong> — Vercel (Edge Network, automatyczne HTTPS)</li>
        <li><strong>Baza danych</strong> — Supabase (region EU — Ireland)</li>
        <li><strong>CDN / DDoS</strong> — Cloudflare</li>
        <li><strong>Email</strong> — Resend (wyłącznie emaile transakcyjne)</li>
      </ul>

      <h2>Zgłaszanie luk bezpieczeństwa</h2>
      <p>
        Jeśli odkryłeś lukę bezpieczeństwa, prosimy o kontakt:{" "}
        <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a>.
        Odpowiemy w ciągu 48 godzin.
      </p>
    </LegalPage>
  );
}
