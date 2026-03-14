import LegalPage from "@/components/LegalPage";

export const metadata = {
  title: "Regulamin — MikePrompt",
};

export default function TermsPage() {
  return (
    <LegalPage title="Regulamin usługi">
      <p style={{ fontSize: 13, color: "#A09890", marginBottom: 32 }}>
        Ostatnia aktualizacja: marzec 2025
      </p>

      <h2>1. Postanowienia ogólne</h2>
      <p>
        Niniejszy Regulamin określa zasady korzystania z serwisu MikePrompt
        dostępnego pod adresem mikeprompt.com, prowadzonego przez:<br /><br />
        <strong>MikePrompt</strong><br />
        ul. [TWOJA ULICA]<br />
        [KOD] Warszawa, Polska<br />
        Email: hello@mikeprompt.com
      </p>

      <h2>2. Definicje</h2>
      <ul>
        <li><strong>Serwis</strong> — aplikacja MikePrompt dostępna pod mikeprompt.com</li>
        <li><strong>Użytkownik</strong> — osoba korzystająca z Serwisu</li>
        <li><strong>Prompt</strong> — polecenie tekstowe wysyłane do systemów AI</li>
        <li><strong>Plan Free</strong> — bezpłatny dostęp do 5 polerów dziennie</li>
        <li><strong>Plan Pro</strong> — płatny dostęp bez limitów (w przygotowaniu)</li>
      </ul>

      <h2>3. Zasady korzystania</h2>
      <p>Użytkownik zobowiązuje się do:</p>
      <ul>
        <li>Korzystania z Serwisu zgodnie z prawem i dobrymi obyczajami</li>
        <li>Nieprzetwarzania danych osobowych osób trzecich bez ich zgody</li>
        <li>Niegenerowania treści nielegalnych, obraźliwych lub szkodliwych</li>
        <li>Nieautomatyzowania zapytań w celu obejścia limitów</li>
        <li>Nieodsprzedawania dostępu do Serwisu</li>
      </ul>

      <h2>4. Zakres usługi</h2>
      <p>
        MikePrompt to narzędzie do optymalizacji promptów AI. Serwis:
      </p>
      <ul>
        <li>Przetwarza wprowadzony tekst i zwraca ulepszoną wersję promptu</li>
        <li>Nie gwarantuje jakości wyników generowanych przez zewnętrzne systemy AI</li>
        <li>Nie ponosi odpowiedzialności za treści wygenerowane przez ChatGPT, Claude, Gemini i inne AI</li>
        <li>Może zmieniać funkcje i limity z zachowaniem 14-dniowego okresu powiadomienia</li>
      </ul>

      <h2>5. Konto użytkownika</h2>
      <ul>
        <li>Rejestracja jest dobrowolna i bezpłatna</li>
        <li>Jedno konto na jedną osobę</li>
        <li>Użytkownik odpowiada za bezpieczeństwo swojego hasła</li>
        <li>Konto można usunąć w dowolnym momencie pisząc na hello@mikeprompt.com</li>
      </ul>

      <h2>6. Płatności (Plan Pro)</h2>
      <p>
        Plan Pro jest w przygotowaniu. Szczegółowe warunki płatności zostaną
        opublikowane przed jego uruchomieniem. Użytkownicy na liście oczekujących
        otrzymają powiadomienie emailem.
      </p>

      <h2>7. Odpowiedzialność</h2>
      <ul>
        <li>MikePrompt nie ponosi odpowiedzialności za przerwy w działaniu zewnętrznych API (Anthropic, OpenAI)</li>
        <li>MikePrompt dokłada starań aby Serwis był dostępny 24/7 ale nie gwarantuje 100% uptime</li>
        <li>Użytkownik korzysta z Serwisu na własne ryzyko w zakresie dopuszczalnym przez prawo</li>
      </ul>

      <h2>8. Własność intelektualna</h2>
      <p>
        Kod, design i nazwa MikePrompt są własnością MikePrompt.
        Użytkownik zachowuje prawa do treści które wprowadza do Serwisu.
      </p>

      <h2>9. Postanowienia końcowe</h2>
      <ul>
        <li>Regulamin podlega prawu polskiemu</li>
        <li>Spory rozstrzyga sąd właściwy dla Warszawy</li>
        <li>W sprawach nieuregulowanych stosuje się przepisy Kodeksu Cywilnego</li>
        <li>Zmiany Regulaminu publikowane są na mikeprompt.com/terms z 14-dniowym wyprzedzeniem</li>
      </ul>

      <p>
        Kontakt: <a href="mailto:hello@mikeprompt.com" style={{ color: "#FF6E40" }}>hello@mikeprompt.com</a>
      </p>
    </LegalPage>
  );
}
