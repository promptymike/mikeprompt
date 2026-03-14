import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Polityka Prywatności — MikePrompt",
  description: "Informacje o przetwarzaniu danych osobowych w MikePrompt",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Polityka Prywatności">
      <p style={{ fontSize: 13, color: "#A09890", marginBottom: 32 }}>
        Ostatnia aktualizacja: marzec 2025
      </p>

      <h2>1. Administrator danych osobowych</h2>
      <p>
        Administratorem Twoich danych osobowych jest:<br /><br />
        <strong>MikePrompt</strong><br />
        ul. [TWOJA ULICA I NUMER]<br />
        [KOD POCZTOWY] Warszawa, Polska<br />
        NIP: [TWÓJ NIP]<br />
        Email: <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a>
      </p>

      <h2>2. Jakie dane zbieramy</h2>
      <p>Zbieramy wyłącznie dane niezbędne do działania usługi:</p>
      <ul>
        <li><strong>Adres email</strong> — przy rejestracji konta, do logowania i komunikacji</li>
        <li><strong>Dane profilu</strong> — rola zawodowa, branża, które AI używasz (podajesz dobrowolnie)</li>
        <li><strong>Historia promptów</strong> — treść wypolerowanych promptów, jeśli włączyłeś tę opcję w ustawieniach</li>
        <li><strong>Dane techniczne</strong> — adres IP (do ochrony przed nadużyciami), przeglądarka, czas dostępu</li>
      </ul>

      <h2>3. Czego NIE robimy</h2>
      <ul>
        <li>Nie sprzedajemy Twoich danych osobowych</li>
        <li>Nie trenujemy modeli AI na treści Twoich promptów</li>
        <li>Nie wysyłamy spamu ani nie udostępniamy emaila bez zgody</li>
        <li>Nie profilujemy użytkowników w celach reklamowych</li>
      </ul>

      <h2>4. Podstawa prawna przetwarzania</h2>
      <ul>
        <li><strong>Wykonanie umowy</strong> (art. 6 ust. 1 lit. b RODO) — rejestracja i korzystanie z usługi</li>
        <li><strong>Prawnie uzasadniony interes</strong> (art. 6 ust. 1 lit. f RODO) — bezpieczeństwo, ochrona przed nadużyciami</li>
        <li><strong>Zgoda</strong> (art. 6 ust. 1 lit. a RODO) — zapisywanie historii promptów (możesz wycofać w ustawieniach)</li>
      </ul>

      <h2>5. Podmioty przetwarzające dane (Processorzy)</h2>
      <p>Korzystamy z następujących zaufanych dostawców:</p>
      <ul>
        <li><strong>Anthropic</strong> (USA) — model AI Claude, przetwarza treść promptów w celu ich optymalizacji. Anthropic nie trenuje modeli na danych z API. <a href="https://www.anthropic.com/privacy" style={{ color: "#FF6E40" }}>Polityka prywatności Anthropic</a></li>
        <li><strong>Supabase</strong> (UE — Ireland) — baza danych i uwierzytelnianie. Dane przechowywane w regionie EU.</li>
        <li><strong>Vercel</strong> (USA) — hosting aplikacji. <a href="https://vercel.com/legal/privacy-policy" style={{ color: "#FF6E40" }}>Polityka prywatności Vercel</a></li>
        <li><strong>Resend</strong> (USA) — wysyłka emaili transakcyjnych (potwierdzenie rejestracji, reset hasła)</li>
        <li><strong>Cloudflare</strong> (USA) — ochrona przed atakami DDoS, CDN. Przetwarza metadane ruchu sieciowego.</li>
      </ul>

      <h2>6. Okres przechowywania danych</h2>
      <ul>
        <li>Dane konta — do momentu usunięcia konta</li>
        <li>Historia promptów — do momentu wyłączenia opcji lub usunięcia konta</li>
        <li>Logi techniczne (IP) — 30 dni</li>
      </ul>

      <h2>7. Twoje prawa (RODO)</h2>
      <p>Przysługują Ci następujące prawa:</p>
      <ul>
        <li><strong>Prawo dostępu</strong> — możesz zażądać kopii swoich danych</li>
        <li><strong>Prawo do sprostowania</strong> — możesz poprawić nieprawidłowe dane</li>
        <li><strong>Prawo do usunięcia</strong> — możesz usunąć konto i wszystkie dane</li>
        <li><strong>Prawo do przenoszenia</strong> — możesz otrzymać dane w formacie JSON</li>
        <li><strong>Prawo do sprzeciwu</strong> — możesz sprzeciwić się przetwarzaniu</li>
        <li><strong>Prawo do wycofania zgody</strong> — wyłącz historię promptów w ustawieniach profilu</li>
      </ul>
      <p>
        Aby skorzystać z praw, napisz na:{" "}
        <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a>.
        Odpowiemy w ciągu 30 dni.
      </p>

      <h2>8. Cookies i localStorage</h2>
      <p>
        MikePrompt używa wyłącznie <strong>localStorage</strong> (nie cookies) do przechowywania
        ustawień lokalnie (motyw, język, profil). Nie używamy cookies śledzących ani reklamowych.
        Cloudflare może ustawiać cookies techniczne niezbędne do ochrony przed atakami.
      </p>

      <h2>9. Przekazywanie danych poza UE</h2>
      <p>
        Niektórzy nasi dostawcy (Anthropic, Vercel, Resend, Cloudflare) mają siedzibę w USA.
        Przekazywanie danych odbywa się na podstawie standardowych klauzul umownych (SCC)
        zatwierdzonych przez Komisję Europejską.
      </p>

      <h2>10. Kontakt i skargi</h2>
      <p>
        W sprawach dotyczących danych osobowych: <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a><br /><br />
        Masz prawo wnieść skargę do organu nadzorczego:{" "}
        <strong>Prezes Urzędu Ochrony Danych Osobowych (UODO)</strong>, ul. Stawki 2, 00-193 Warszawa.{" "}
        <a href="https://uodo.gov.pl" style={{ color: "#FF6E40" }}>uodo.gov.pl</a>
      </p>
    </LegalPage>
  );
}
