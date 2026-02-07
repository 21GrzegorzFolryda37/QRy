import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Regulamin - QRenixy',
  description: 'Regulamin korzystania z serwisu QRenixy.',
}

export default function TermsPage() {
  return (
    <div className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Regulamin
        </h1>
        <p className="mt-4 text-sm text-gray-500">
          Ostatnia aktualizacja: {new Date().toLocaleDateString('pl-PL')}
        </p>

        <div className="mt-10 space-y-10 text-gray-600">
          <section>
            <h2 className="text-xl font-semibold text-gray-900">1. Postanowienia ogolne</h2>
            <p className="mt-4">
              Niniejszy regulamin okresla zasady korzystania z serwisu QRenixy, dostepnego pod
              adresem engageqr.com. Korzystajac z serwisu, akceptujesz ponizsze warunki.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">2. Definicje</h2>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Serwis</strong> - platforma QRenixy dostepna pod adresem engageqr.com
              </li>
              <li>
                <strong>Uzytkownik</strong> - osoba korzystajaca z Serwisu
              </li>
              <li>
                <strong>Konto</strong> - indywidualne konto Uzytkownika w Serwisie
              </li>
              <li>
                <strong>Kod QR</strong> - dynamiczny kod QR utworzony w Serwisie
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">3. Rejestracja i konto</h2>
            <p className="mt-4">
              Aby korzystac z pelnej funkcjonalnosci Serwisu, nalezy utworzyc konto. Uzytkownik zobowiazuje sie do:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Podania prawdziwych danych podczas rejestracji</li>
              <li>Zachowania poufnosci danych logowania</li>
              <li>Niezwlocznego powiadomienia o nieautoryzowanym dostepe do konta</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">4. Uslugi i plany cenowe</h2>
            <p className="mt-4">
              Serwis oferuje rozne plany cenowe, w tym plan darmowy z ograniczonymi funkcjami
              oraz plany platne z rozszerzonym dostepem. Szczegoly planow dostepne sa na stronie cennika.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>
                <strong>Plan darmowy:</strong> ograniczona liczba kodow QR i skanow
              </li>
              <li>
                <strong>Plany platne:</strong> wiecej kodow, skanow i dodatkowe funkcje
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">5. Platnosci</h2>
            <p className="mt-4">
              Platnosci za plany platne sa realizowane poprzez Stripe. Subskrypcje sa odnawiane
              automatycznie, chyba ze zostaną anulowane przed koncem okresu rozliczeniowego.
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Ceny podane sa w PLN i zawieraja podatek VAT</li>
              <li>Faktury sa dostepne w panelu uzytkownika</li>
              <li>Zwroty realizowane zgodnie z obowiazujacym prawem</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">6. Zasady korzystania z Serwisu</h2>
            <p className="mt-4">Uzytkownik zobowiazuje sie do:</p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Korzystania z Serwisu zgodnie z prawem</li>
              <li>Niepublikowania tresci niezgodnych z prawem, oszukančych lub szkodliwych</li>
              <li>Niestosowania Serwisu do spamu lub phishingu</li>
              <li>Niepodejmowania dzialań mogacych zaklocic dzialanie Serwisu</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">7. Zabronione tresci</h2>
            <p className="mt-4">
              Zabrania sie tworzenia kodow QR prowadzacych do:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Tresci niezgodnych z prawem</li>
              <li>Malware lub stron phishingowych</li>
              <li>Tresci pornograficznych z udzialem nieletnich</li>
              <li>Tresci promujacych przemoc lub nienawisc</li>
              <li>Naruszen praw autorskich</li>
            </ul>
            <p className="mt-4">
              Zastrzegamy sobie prawo do usuniecia kodow QR naruszajacych te zasady oraz zawieszenia
              konta Uzytkownika.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">8. Wlasnosc intelektualna</h2>
            <p className="mt-4">
              Serwis i jego zawartosc (oprócz tresci Uzytkownikow) sa chronione prawem autorskim.
              Uzytkownik zachowuje prawa do swoich tresci, ale udziela Serwisowi licencji na ich
              przechowywanie i przetwarzanie w celu swiadczenia uslugi.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">9. Odpowiedzialnosc</h2>
            <p className="mt-4">
              Serwis swiadczony jest &quot;tak jak jest&quot;. Nie gwarantujemy nieprzerwanego
              dzialania uslugi. Nie ponosimy odpowiedzialnosci za:
            </p>
            <ul className="mt-4 list-disc pl-6 space-y-2">
              <li>Szkody wynikle z przerw w dzialaniu Serwisu</li>
              <li>Utrate danych spowodowana dzialaniem osob trzecich</li>
              <li>Dzialania Uzytkownikow naruszajace regulamin</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">10. Rozwiazanie umowy</h2>
            <p className="mt-4">
              Uzytkownik moze w kazdej chwili usunac swoje konto. Zastrzegamy sobie prawo do
              zawieszenia lub usuniecia konta w przypadku naruszenia regulaminu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">11. Zmiany regulaminu</h2>
            <p className="mt-4">
              Mozemy wprowadzac zmiany w regulaminie. O istotnych zmianach poinformujemy
              Uzytkownikow mailowo z co najmniej 14-dniowym wyprzedzeniem.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">12. Prawo wlasciwe</h2>
            <p className="mt-4">
              Niniejszy regulamin podlega prawu polskiemu. Wszelkie spory beda rozstrzygane
              przez sady wlasciwe dla siedziby administratora Serwisu.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-900">13. Kontakt</h2>
            <p className="mt-4">
              W sprawach zwiazanych z regulaminem prosimy o kontakt poprzez{' '}
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
