import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "CampingExpert.nl - Vind de Beste Campings in Europa",
    template: "%s | CampingExpert.nl",
  },
  description: "Ontdek duizenden campings door heel Europa. Vergelijk faciliteiten, bekijk reviews en vind de perfecte camping voor jouw vakantie.",
  keywords: ["camping", "campings", "camping europa", "kamperen", "camping nederland", "camping frankrijk", "camping spanje", "camping italië"],
  metadataBase: new URL("https://campingexpert.nl"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXXXXXXX');
          `}
        </Script>
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-gray-50`}>
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-bold text-emerald-600">Camping</span>
                <span className="text-2xl font-bold text-gray-800">Expert</span>
                <span className="text-emerald-600 text-xl">.nl</span>
              </Link>
              
              <nav className="flex items-center gap-2 md:gap-4">
                <Link 
                  href="/campings" 
                  className="text-sm md:text-base text-gray-600 hover:text-emerald-600 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Campings
                </Link>
                <Link 
                  href="/zoeken" 
                  className="text-sm md:text-base text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Zoeken
                </Link>
              </nav>
            </div>
          </div>
        </header>

        {children}

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-4">Populaire Landen</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/campings/nederland" className="hover:text-emerald-400">Nederland</Link></li>
                  <li><Link href="/campings/frankrijk" className="hover:text-emerald-400">Frankrijk</Link></li>
                  <li><Link href="/campings/spanje" className="hover:text-emerald-400">Spanje</Link></li>
                  <li><Link href="/campings/italie" className="hover:text-emerald-400">Italië</Link></li>
                  <li><Link href="/campings/duitsland" className="hover:text-emerald-400">Duitsland</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Type Camping</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/campings?type=familie" className="hover:text-emerald-400">Familiecampings</Link></li>
                  <li><Link href="/campings?type=luxe" className="hover:text-emerald-400">Luxe campings</Link></li>
                  <li><Link href="/campings?type=natuur" className="hover:text-emerald-400">Natuurcampings</Link></li>
                  <li><Link href="/campings?zwembad=true" className="hover:text-emerald-400">Campings met zwembad</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Over Ons</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link href="/over-ons" className="hover:text-emerald-400">Over CampingExpert</Link></li>
                  <li><Link href="/contact" className="hover:text-emerald-400">Contact</Link></li>
                  <li><Link href="/privacy" className="hover:text-emerald-400">Privacy</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">CampingExpert.nl</h3>
                <p className="text-sm text-gray-400">
                  Dé campinggids voor heel Europa. Vind en vergelijk duizenden campings.
                </p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} CampingExpert.nl - Alle rechten voorbehouden
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
