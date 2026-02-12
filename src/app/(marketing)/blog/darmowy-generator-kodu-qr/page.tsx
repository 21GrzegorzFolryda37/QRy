import { Metadata } from 'next'
import Link from 'next/link'
import { ArticleFAQ } from './_components/article-faq'

export const metadata: Metadata = {
  title: 'Darmowy Generator Kodu QR vs Płatny - Który Wybrać? [2025]',
  description:
    'Darmowy generator kodu QR bez rejestracji + płatne funkcje Pro: dynamiczne kody, analityka skanów, branding. Zacznij za darmo, rozwijaj profesjonalnie z QRenixy.',
  keywords: [
    'darmowy generator qr',
    'generator kodu qr',
    'kod qr',
    'qr code generator',
    'generator kodów qr online',
    'tworzenie kodów qr',
  ],
  alternates: {
    canonical: 'https://qrenixy.com/blog/darmowy-generator-kodu-qr',
  },
  openGraph: {
    title: 'Darmowy Generator Kodu QR vs Płatny - Który Wybrać? [2025]',
    description:
      'Darmowy generator kodu QR bez rejestracji + płatne funkcje Pro: dynamiczne kody, analityka skanów, branding.',
    type: 'article',
    locale: 'pl_PL',
    url: 'https://qrenixy.com/blog/darmowy-generator-kodu-qr',
    siteName: 'QRenixy',
    publishedTime: '2025-01-28T00:00:00Z',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Darmowy Generator Kodu QR vs Płatny - Który Wybrać?',
    description:
      'Darmowy generator kodu QR bez rejestracji + płatne funkcje Pro: dynamiczne kody, analityka skanów, branding.',
  },
}

const faqStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Czy darmowy generator QR w QRenixy ma ograniczenia czasowe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nie, kody QR wygenerowane za darmo w QRenixy działają bez limitu czasu. Możesz ich używać tak długo jak potrzebujesz — nie ma żadnych ukrytych opłat ani dat wygaśnięcia.',
      },
    },
    {
      '@type': 'Question',
      name: 'Czy muszę się rejestrować żeby użyć darmowego generatora kodów QR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Nie musisz zakładać konta. Wystarczy że podasz adres email na który wyślemy gotowy kod QR. Cały proces zajmuje około 30 sekund.',
      },
    },
    {
      '@type': 'Question',
      name: 'Ile kosztuje przejście na wersję Pro generatora QR?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Plan Starter kosztuje 29 PLN miesięcznie i zawiera 10 dynamicznych kodów QR z podstawową analityką. Plan Pro to 69 PLN miesięcznie z nieograniczoną liczbą kodów i pełną analityką.',
      },
    },
    {
      '@type': 'Question',
      name: 'Czy mogę zmienić link w kodzie QR po wydrukowaniu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Z darmowym, statycznym kodem QR nie możesz zmienić linku po wygenerowaniu. Jednak kody dynamiczne w planach Starter i Pro pozwalają zmieniać docelowy URL bez konieczności drukowania nowego kodu.',
      },
    },
    {
      '@type': 'Question',
      name: 'Jakie dane pokazuje analityka kodów QR w QRenixy?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Analityka w planach płatnych pokazuje: liczbę skanów w czasie rzeczywistym, lokalizację geograficzną użytkowników (mapa Polski), typ urządzenia (iOS/Android), przeglądarkę, oraz wzorce czasowe skanowania z możliwością eksportu do CSV.',
      },
    },
  ],
}

const articleStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Darmowy Generator Kodu QR - Zacznij Za Darmo, Rozwijaj Profesjonalnie',
  description:
    'Darmowy generator kodu QR bez rejestracji + płatne funkcje Pro: dynamiczne kody, analityka skanów, branding.',
  datePublished: '2025-01-28T00:00:00Z',
  dateModified: '2025-01-28T00:00:00Z',
  author: {
    '@type': 'Organization',
    name: 'QRenixy',
    url: 'https://qrenixy.com',
  },
  publisher: {
    '@type': 'Organization',
    name: 'QRenixy',
    url: 'https://qrenixy.com',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': 'https://qrenixy.com/blog/darmowy-generator-kodu-qr',
  },
  inLanguage: 'pl',
}

const breadcrumbStructuredData = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Strona główna',
      item: 'https://qrenixy.com',
    },
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Blog',
      item: 'https://qrenixy.com/blog',
    },
    {
      '@type': 'ListItem',
      position: 3,
      name: 'Darmowy Generator Kodu QR',
      item: 'https://qrenixy.com/blog/darmowy-generator-kodu-qr',
    },
  ],
}

export default function DarmowyGeneratorKoduQRPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <div className="bg-[var(--background)] py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 text-sm text-[var(--foreground-subtle)]">
              <li>
                <Link href="/" className="hover:text-[var(--foreground)] transition-colors">
                  Strona główna
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link href="/blog" className="hover:text-[var(--foreground)] transition-colors">
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--foreground)]">Darmowy Generator Kodu QR</li>
            </ol>
          </nav>

          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-display text-[var(--foreground)]">
              Darmowy Generator Kodu QR — Zacznij Za Darmo, Rozwijaj Profesjonalnie
            </h1>
            <div className="mt-4 flex items-center gap-4 text-sm text-[var(--foreground-subtle)]">
              <time dateTime="2025-01-28">28 stycznia 2025</time>
              <span className="inline-flex items-center rounded-full bg-[var(--background-surface)] border border-[var(--border)] px-3 py-0.5 text-xs font-medium text-[var(--foreground-muted)]">
                ~8 min czytania
              </span>
            </div>
          </header>

          {/* Article Body */}
          <article className="space-y-6 text-base sm:text-lg leading-relaxed text-[var(--foreground-muted)]">
            <p>
              Szukasz <strong>darmowego generatora kodów QR</strong>? Świetnie trafiłeś. W{' '}
              <Link href="/" className="text-[#6d28d9] font-medium hover:underline">
                QRenixy.com
              </Link>{' '}
              możesz stworzyć swój pierwszy kod QR w 30 sekund, bez rejestracji i bez żadnych opłat.
              Ale jeśli planujesz coś więcej niż jednorazową wizytówkę — jeśli prowadzisz biznes,
              organizujesz kampanię marketingową czy zarządzasz restauracją — to ten artykuł pokaże
              Ci, dlaczego darmowy generator to dopiero początek Twojej podróży z kodami QR.
            </p>

            {/* Section: Jak Działa */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] mt-12 mb-4 scroll-mt-20"
                id="jak-dziala"
              >
                Jak Działa Darmowy Generator QR w QRenixy
              </h2>
              <p>Nasz generator to najprostsze narzędzie jakie możesz sobie wyobrazić:</p>
              <ol className="list-decimal pl-6 space-y-2 mt-4">
                <li>
                  Wchodzisz na{' '}
                  <Link href="/" className="text-[#6d28d9] font-medium hover:underline">
                    QRenixy.com
                  </Link>
                </li>
                <li>Wpisujesz link lub tekst</li>
                <li>Dostajesz kod QR na email w kilkanaście sekund</li>
              </ol>
              <p className="mt-4">
                Żadnej rejestracji. Żadnych ukrytych kosztów. Żadnych limitów czasowych. Po prostu
                generujesz kod i używasz go gdzie chcesz — na wizytówkach, plakatach, ulotkach czy
                w social mediach.
              </p>
              <p className="mt-4">
                To idealne rozwiązanie na szybkie, jednorazowe potrzeby. Organizujesz wydarzenie i
                potrzebujesz QR do rejestracji? Gotowe. Chcesz udostępnić link do swojego portfolio?
                Bez problemu. Testujesz pomysł na kampanię? Śmiało.
              </p>
              <p className="mt-4 font-medium text-[var(--foreground)]">Ale...</p>
            </section>

            {/* Section: Kiedy Przestaje Wystarczać */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] mt-12 mb-4 scroll-mt-20"
                id="kiedy-przestaje-wystarczac"
              >
                Kiedy Darmowy Generator Kodów QR Przestaje Wystarczać
              </h2>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                1. &ldquo;Ile osób naprawdę zeskanowało mój kod?&rdquo;
              </h3>
              <p>
                Wydrukowałeś 500 ulotek z kodem QR. Rozdałeś je na targach. I co dalej? Kompletna
                cisza. Nie masz pojęcia czy ktokolwiek użył tego kodu, skąd pochodzili Twoi klienci,
                ani czy warto powtórzyć akcję.
              </p>
              <p className="mt-4">
                Z darmowym generatorem strzelasz w ciemno. Z QRenixy Pro widzisz dokładnie:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Ile skanów zarejestrował kod (w czasie rzeczywistym)</li>
                <li>Z jakich miast i województw pochodzą użytkownicy</li>
                <li>Jakie urządzenia używają (iOS, Android, desktop)</li>
                <li>Kiedy najczęściej skanują (godziny szczytu)</li>
              </ul>
              <p className="mt-4">
                Jedna restauracja w Krakowie odkryła dzięki tym danym, że 70% skanów ich menu QR
                dzieje się między 18:00 a 20:00. Zoptymalizowali grafik obsługi i zaoszczędzili na
                kosztach pracy.
              </p>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                2. &ldquo;Muszę zmienić link, ale kod już wydrukowany...&rdquo;
              </h3>
              <p>
                To klasyczny scenariusz: wydrukowałeś 1000 plakatów z kodem QR prowadzącym do oferty
                świątecznej. Drukowanie kosztowało 2000 PLN. W styczniu oferta się kończy, ale
                plakaty wiszą w 20 lokalach przez cały rok.
              </p>
              <p className="mt-4">Z darmowym, statycznym kodem masz dwie opcje:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Wydrukuj wszystko od nowa (kolejne 2000 PLN)</li>
                <li>Zostaw nieaktualny link (strata wizerunku)</li>
              </ul>
              <p className="mt-4">
                Z dynamicznym QR w QRenixy zmieniasz docelowy link w 10 sekund, bez zmiany samego
                kodu. Ten sam kod QR może przez rok prowadzić do:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Oferty świątecznej (grudzień)</li>
                <li>Wyprzedaży zimowej (styczeń–luty)</li>
                <li>Promocji wiosennej (marzec–maj)</li>
                <li>Oferty letniej (czerwiec–sierpień)</li>
              </ul>
              <p className="mt-4">
                Jeden kod, nieskończone możliwości. Zwrot z inwestycji? Od pierwszej zmiany.
              </p>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                3. &ldquo;Czarno-biały kwadrat nie pasuje do mojej marki&rdquo;
              </h3>
              <p>
                Budujesz markę premium. Dbasz o każdy detal — od logo, przez kolorystykę, po
                czcionki. A potem wklejasz w materiały marketingowe... czarno-biały, generyczny kod
                QR który wygląda jak wszystkie inne.
              </p>
              <p className="mt-4">W wersji Pro dostosowujesz kod QR do swojej marki:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Dodajesz logo w centrum kodu</li>
                <li>Zmieniasz kolory na firmowe</li>
                <li>Zaokrąglasz rogi dla miękkiego wyglądu</li>
                <li>
                  Używasz własnej domeny w linkach (twojamarka.pl/menu zamiast qrenixy.com/abc123)
                </li>
              </ul>
              <p className="mt-4">
                Efekt? Kod QR który wzmacnia Twoją markę zamiast ją osłabiać.
              </p>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                4. &ldquo;Skąd przychodzą moi klienci?&rdquo;
              </h3>
              <p>
                Prowadzisz kampanię w trzech miastach: Warszawa, Kraków, Wrocław. Używasz kodów QR
                na plakatach w każdym z nich. Po miesiącu widzisz 500 skanów total.
              </p>
              <p className="mt-4">
                Pytanie: które miasto generuje najlepsze wyniki? Gdzie warto zwiększyć budżet, a
                gdzie ograniczyć?
              </p>
              <p className="mt-4">Z darmowym generatorem: nie masz pojęcia.</p>
              <p className="mt-4">
                Z QRenixy Pro: widzisz mapę Polski z dokładnymi danymi. Odkrywasz, że Kraków
                generuje 60% ruchu mimo 33% budżetu. Przerzucasz zasoby i zwiększasz ROI o 40%.
              </p>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                5. &ldquo;Mam 20 kodów do zarządzania...&rdquo;
              </h3>
              <p>
                Restauracja z QR kodami przy każdym stoliku. Sklep z kodami na każdym produkcie.
                Agencja z kodami w 10 kampaniach dla 5 klientów.
              </p>
              <p className="mt-4">
                Z darmowym generatorem każdy kod to osobny plik, osobny email, chaos w folderach.
                Który kod jest który? Który działa, a który można usunąć?
              </p>
              <p className="mt-4">QRenixy Pro to centrum kontroli wszystkich Twoich kodów:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Dashboard z wszystkimi kodami w jednym miejscu</li>
                <li>Foldery i tagi do organizacji</li>
                <li>Szybkie wyszukiwanie</li>
                <li>Masowe operacje</li>
                <li>Historia zmian i backupy</li>
              </ul>
            </section>

            {/* Mid-article CTA */}
            <div className="my-12 rounded-2xl border border-[#6d28d9]/20 bg-gradient-to-br from-[#6d28d9]/5 to-[#6d28d9]/10 p-6 sm:p-8 text-center">
              <p className="text-lg font-semibold text-[var(--foreground)] mb-2">
                Gotowy na więcej niż darmowy generator?
              </p>
              <p className="text-[var(--foreground-muted)] mb-6">
                Przetestuj QRenixy Pro przez 7 dni za darmo — bez karty kredytowej.
              </p>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6] shadow-lg shadow-[#6d28d9]/25 h-12 px-8 text-base font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
              >
                Wypróbuj za darmo
              </Link>
            </div>

            {/* Section: Funkcje Płatnego Generatora */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] mt-12 mb-4 scroll-mt-20"
                id="funkcje-pro"
              >
                Funkcje Płatnego Generatora QR — Co Zyskujesz w QRenixy Pro
              </h2>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                Zaawansowana Analityka Skanowania Kodów QR
              </h3>
              <p>Każdy skan to dane. W QRenixy Pro przekształcamy te dane w wiedzę:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Mapa geograficzna</strong> pokazuje dokładnie z jakich regionów Polski (i
                  świata) pochodzą Twoi użytkownicy. Planujesz expansion? Widzisz gdzie jest popyt.
                </li>
                <li>
                  <strong>Wykres czasowy</strong> ujawnia wzorce zachowań. Sklep z elektroniką
                  odkrył, że 80% skanów ich kodów dzieje się w weekendy. Zoptymalizowali harmonogram
                  promocji.
                </li>
                <li>
                  <strong>Analiza urządzeń</strong> (iOS vs Android, desktop vs mobile) pomaga
                  dostosować docelową stronę. Jeśli 90% skanów to iPhone&apos;y, wiesz że Twoja
                  landing page musi idealnie działać na Safari.
                </li>
                <li>
                  <strong>Eksport do CSV</strong> pozwala ciągnąć dane do Google Sheets, Excel czy
                  systemów CRM. Pełna kontrola nad własnymi danymi.
                </li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                Dynamiczne Kody QR — Zmień Treść Bez Ponownego Drukowania
              </h3>
              <p>To feature który najszybciej się zwraca. Policzmy:</p>
              <p className="mt-4">
                <strong>Scenariusz:</strong> Restauracja z menu QR przy 15 stolikach.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Koszt wydrukowania jednej tabliczki: 15 PLN</li>
                <li>Koszt kompletu (15 szt): 225 PLN</li>
                <li>Średnio zmian menu rocznie: 6</li>
              </ul>
              <p className="mt-4">
                <strong>Z darmowym, statycznym QR:</strong> 6 wymian &times; 225 PLN ={' '}
                <strong>1&nbsp;350 PLN rocznie</strong>
              </p>
              <p className="mt-2">
                <strong>Z QRenixy Pro (69 PLN/miesiąc):</strong> 12 miesięcy &times; 69 PLN ={' '}
                <strong>828 PLN rocznie</strong> + nieograniczona liczba zmian menu
              </p>
              <p className="mt-2 text-[var(--foreground)] font-semibold">
                Oszczędność: 522 PLN rocznie
              </p>
              <p className="mt-4">I to tylko na druku. Do tego dochodzą:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Oszczędność czasu (zmiana w 30 sekund vs wymiana wszystkich tabliczek)</li>
                <li>Brak przestojów (klienci zawsze widzą aktualne menu)</li>
                <li>Możliwość A/B testowania ofert</li>
              </ul>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                Branding i Profesjonalny Wizerunek
              </h3>
              <p>Porównajmy co widzą Twoi klienci:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>
                  <strong>Darmowy QR:</strong> Czarno-biały kwadrat + link
                  &ldquo;qrenixy.com/x7k2p9&rdquo; (wygląda jak phishing)
                </li>
                <li>
                  <strong>QRenixy Pro:</strong> Kod QR w kolorach firmy + logo w centrum + link
                  &ldquo;twoja-restauracja.pl/menu&rdquo; (wygląda profesjonalnie i bezpiecznie)
                </li>
              </ul>
              <p className="mt-4">Różnica? Zaufanie. Konwersja. Skuteczność kampanii.</p>

              <h3 className="text-xl font-semibold text-[var(--foreground)] mt-8 mb-3">
                Organizacja i Skalowalność
              </h3>
              <p>
                Gdy masz jeden kod QR, zarządzanie jest proste. Ale biznes rośnie — restauracja
                dodaje QR przy każdym stoliku, sklep umieszcza kody na każdym produkcie, agencja
                prowadzi 20 kampanii jednocześnie.
              </p>
              <p className="mt-4">QRenixy Pro skaluje się z Tobą:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Nieograniczona liczba kodów</li>
                <li>Foldery i tagi (np. &ldquo;Kampania Q1 2025&rdquo;, &ldquo;Menu&rdquo;, &ldquo;Produkty&rdquo;)</li>
                <li>Wyszukiwarka pełnotekstowa</li>
                <li>Grupowe operacje (zmień cel dla 10 kodów jednocześnie)</li>
              </ul>
            </section>

            {/* Section: Cennik */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] mt-12 mb-4 scroll-mt-20"
                id="cennik"
              >
                Ile Kosztuje Generator Kodów QR? Cennik QRenixy
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[var(--border)] bg-[var(--background-surface)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Plan Starter</h3>
                  <p className="text-2xl font-bold text-[var(--foreground)] mt-2">
                    29 PLN<span className="text-sm font-normal text-[var(--foreground-muted)]">/miesiąc</span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-4 text-sm text-[var(--foreground-muted)]">
                    <li>10 dynamicznych kodów QR</li>
                    <li>Podstawowa analityka</li>
                    <li>Branding (kolory, logo)</li>
                    <li>Idealne na start</li>
                  </ul>
                </div>
                <div className="rounded-xl border-2 border-[#6d28d9] bg-[var(--background-surface)] p-6 relative">
                  <span className="absolute -top-3 left-4 bg-[#6d28d9] text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Popularny
                  </span>
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">Plan Pro</h3>
                  <p className="text-2xl font-bold text-[var(--foreground)] mt-2">
                    69 PLN<span className="text-sm font-normal text-[var(--foreground-muted)]">/miesiąc</span>
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 mt-4 text-sm text-[var(--foreground-muted)]">
                    <li>Nieograniczone kody QR</li>
                    <li>Pełna analityka z mapami</li>
                    <li>Zaawansowany branding</li>
                    <li>Własna domena</li>
                    <li>Eksport danych</li>
                    <li>Priority support</li>
                  </ul>
                </div>
              </div>

              <p className="mt-6">
                To mniej niż kawa dziennie. Ale w przeciwieństwie do kawy, kod QR pracuje dla
                Ciebie 24/7 przez cały rok. Sprawdź{' '}
                <Link href="/pricing" className="text-[#6d28d9] font-medium hover:underline">
                  szczegóły planów cenowych
                </Link>
                .
              </p>
            </section>

            {/* Section: Twoja Ścieżka */}
            <section>
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] mt-12 mb-4 scroll-mt-20"
                id="twoja-sciezka"
              >
                Twoja Ścieżka: Od Darmowego do Profesjonalnego
              </h2>
              <p>Nie musisz od razu decydować. Naturalna ścieżka wygląda tak:</p>
              <ol className="list-decimal pl-6 space-y-4 mt-4">
                <li>
                  <strong>Zacznij za darmo</strong> — Przetestuj jak działają kody QR w Twoim
                  biznesie. Wygeneruj pierwszy kod, zobacz reakcje klientów.
                </li>
                <li>
                  <strong>Odkryj potrzebę</strong> — Potrzebujesz zmienić link? Chcesz wiedzieć ile
                  osób skanuje? Martwisz się wizerunkiem marki?
                </li>
                <li>
                  <strong>Spróbuj Pro przez 7 dni za darmo</strong> — Bez karty kredytowej. Bez
                  zobowiązań. Pełny dostęp do wszystkich funkcji.
                </li>
                <li>
                  <strong>Podejmij decyzję opartą na danych</strong> — Po tygodniu wiesz czy
                  analityka, dynamiczne kody i branding mają sens w Twoim biznesie.
                </li>
              </ol>
            </section>

            {/* FAQ */}
            <ArticleFAQ />

            {/* Final CTA */}
            <section className="mt-16">
              <h2
                className="text-2xl sm:text-3xl font-bold font-display text-[var(--foreground)] mt-12 mb-4 scroll-mt-20"
                id="zacznij"
              >
                Zacznij Dziś — Darmowo
              </h2>
              <p>
                Masz pomysł na kampanię? Planujesz event? Budujesz menu dla restauracji? Każda
                podróż z kodami QR zaczyna się od pierwszego wygenerowanego kodu.
              </p>
              <p className="mt-4">
                A gdy będziesz gotowy na więcej — na analitykę która pokazuje skąd pochodzą klienci,
                na dynamiczne kody które oszczędzają tysiące złotych rocznie, na branding który
                wzmacnia Twoją markę — przetestuj QRenixy Pro przez 7 dni za darmo.
              </p>
              <p className="mt-4 text-[var(--foreground)] font-medium">
                Darmowy generator to świetny start. Profesjonalne narzędzie to sposób na rozwój
                biznesu.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-lg bg-[#6d28d9] text-white hover:bg-[#5b21b6] shadow-lg shadow-[#6d28d9]/25 h-12 px-8 text-base font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Stwórz darmowy kod QR
                </Link>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center rounded-lg border border-[var(--border)] bg-transparent text-[var(--foreground)] hover:bg-[var(--background-surface)] hover:border-[var(--border-hover)] h-12 px-8 text-base font-medium transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
                >
                  Zobacz cennik
                </Link>
              </div>
            </section>
          </article>
        </div>
      </div>
    </>
  )
}
