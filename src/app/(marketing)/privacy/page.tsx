import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Polityka Prywatnosci - QRapple',
  description: 'Polityka prywatnosci serwisu QRapple - dowiedz sie jak przetwarzamy Twoje dane.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Polityka Prywatnosci
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
        </p>

        <div className="mt-10 space-y-10 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Administrator danych</h2>
            <p className="mt-4">
              Administratorem Twoich danych osobowych jest QRapple. Mozesz sie z nami skontaktowac
              poprzez formularz kontaktowy na naszej stronie lub mailowo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Jakie dane zbieramy</h2>
            <p className="mt-4">Zbieramy nastepujace rodzaje danych:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Dane konta:</strong> adres e-mail, imie (opcjonalnie) podane podczas rejestracji
              </li>
              <li>
                <strong>Dane uzytkowania:</strong> informacje o tworzonych kodach QR, statystyki skanow
              </li>
              <li>
                <strong>Dane techniczne:</strong> adres IP, typ przegladarki, system operacyjny (zbierane podczas skanowania kodow QR)
              </li>
              <li>
                <strong>Dane lokalizacyjne:</strong> przyblizzona lokalizacja na podstawie adresu IP (dla funkcji analitycznych)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Cel przetwarzania danych</h2>
            <p className="mt-4">Twoje dane przetwarzamy w celu:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Swiadczenia uslug - tworzenie i zarzadzanie kodami QR</li>
              <li>Analizy - dostarczanie statystyk skanowania kodow QR</li>
              <li>Komunikacji - wysylanie waznych informacji o koncie i usludze</li>
              <li>Rozliczen - przetwarzanie platnosci za uslugi premium</li>
              <li>Bezpieczenstwa - ochrona przed naduzyciami i nieautoryzowanym dostepem</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Podstawa prawna przetwarzania</h2>
            <p className="mt-4">Przetwarzamy Twoje dane na podstawie:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Umowy - wykonanie uslugi, na ktora sie zapisales (art. 6 ust. 1 lit. b RODO)</li>
              <li>Zgody - dla niektorych funkcji analitycznych (art. 6 ust. 1 lit. a RODO)</li>
              <li>Prawnie uzasadnionego interesu - dla celow bezpieczenstwa (art. 6 ust. 1 lit. f RODO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Udostepnianie danych</h2>
            <p className="mt-4">
              Twoje dane moga byc udostepniane nastepujacym podmiotom:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Dostawcy uslug hostingowych (Supabase, Vercel)</li>
              <li>Dostawcy uslug platniczych (Stripe)</li>
              <li>Dostawcy uslug geolokalizacyjnych (do okreslania lokalizacji skanow)</li>
            </ul>
            <p className="mt-4">
              Nie sprzedajemy Twoich danych osobowych stronom trzecim.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Okres przechowywania danych</h2>
            <p className="mt-4">
              Przechowujemy Twoje dane przez okres korzystania z naszych uslug oraz przez dodatkowy
              okres wymagany przepisami prawa (np. dla celow podatkowych). Dane analityczne skanow
              sa przechowywane przez okres 24 miesiecy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Twoje prawa</h2>
            <p className="mt-4">Przysluuja Ci nastepujace prawa:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Prawo dostepu do swoich danych</li>
              <li>Prawo do sprostowania danych</li>
              <li>Prawo do usuniecia danych (&quot;prawo do bycia zapomnianym&quot;)</li>
              <li>Prawo do ograniczenia przetwarzania</li>
              <li>Prawo do przenoszenia danych</li>
              <li>Prawo do wniesienia sprzeciwu</li>
              <li>Prawo do cofniecia zgody</li>
            </ul>
            <p className="mt-4">
              Aby skorzystac z powyzszych praw, skontaktuj sie z nami poprzez strone kontaktowa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Pliki cookies</h2>
            <p className="mt-4">
              Nasza strona korzysta z plikow cookies w celu:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Utrzymania sesji uzytkownika (cookies niezbedne)</li>
              <li>Zapamietania preferencji uzytkownika</li>
              <li>Analizy ruchu na stronie (cookies analityczne)</li>
            </ul>
            <p className="mt-4">
              Mozesz zarzadzac ustawieniami cookies w swojej przegladarce.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Bezpieczenstwo danych</h2>
            <p className="mt-4">
              Stosujemy odpowiednie srodki techniczne i organizacyjne w celu ochrony Twoich danych,
              w tym szyfrowanie SSL/TLS, bezpieczne przechowywanie hasel oraz regularne audyty bezpieczenstwa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Zmiany w polityce prywatnosci</h2>
            <p className="mt-4">
              Mozemy aktualizowac niniejsza polityka prywatnosci. O istotnych zmianach
              poinformujemy Cie mailowo lub poprzez powiadomienie w serwisie.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">11. Kontakt</h2>
            <p className="mt-4">
              Jesli masz pytania dotyczace niniejszej polityki prywatnosci lub przetwarzania
              Twoich danych, skontaktuj sie z nami poprzez{' '}
              <a href="/contact" className="text-gray-900 underline hover:text-gray-600">
                formularz kontaktowy
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
