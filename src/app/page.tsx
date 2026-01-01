import Link from "next/link";
import { Star, Tent, Sun, Waves, TreePine, ChevronRight, Search } from "lucide-react";

// Popular countries for camping
const popularCountries = [
  { name: "Nederland", slug: "nederland", flag: "🇳🇱", campings: 2500 },
  { name: "Frankrijk", slug: "frankrijk", flag: "🇫🇷", campings: 8500 },
  { name: "Spanje", slug: "spanje", flag: "🇪🇸", campings: 4200 },
  { name: "Italië", slug: "italie", flag: "🇮🇹", campings: 3800 },
  { name: "Duitsland", slug: "duitsland", flag: "🇩🇪", campings: 3100 },
  { name: "Kroatië", slug: "kroatie", flag: "🇭🇷", campings: 1800 },
  { name: "Oostenrijk", slug: "oostenrijk", flag: "🇦🇹", campings: 1200 },
  { name: "Portugal", slug: "portugal", flag: "🇵🇹", campings: 1100 },
];

// Feature highlights
const features = [
  { icon: Tent, title: "10.000+ Campings", description: "De grootste database van campings in Europa" },
  { icon: Star, title: "Echte Reviews", description: "Beoordelingen van echte kampeerders" },
  { icon: Waves, title: "Alle Faciliteiten", description: "Filter op zwembad, wifi, restaurant en meer" },
  { icon: Sun, title: "Altijd Actueel", description: "Dagelijks bijgewerkte informatie" },
];

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-green-800 text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/camping-pattern.svg')] opacity-10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Vind de Perfecte Camping
          </h1>
          <p className="text-xl md:text-2xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Ontdek duizenden campings door heel Europa. Vergelijk faciliteiten, 
            bekijk reviews en boek je ideale kampeerervaring.
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Waar wil je kamperen? (bijv. Frankrijk, Côte d'Azur...)"
                className="w-full px-6 py-4 pl-14 rounded-xl text-gray-900 text-lg shadow-xl focus:ring-4 focus:ring-emerald-300 focus:outline-none"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Zoeken
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <Link 
              href="/campings?zwembad=true" 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🏊 Met zwembad
            </Link>
            <Link 
              href="/campings?huisdieren=true" 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🐕 Huisdieren welkom
            </Link>
            <Link 
              href="/campings?type=familie" 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              👨‍👩‍👧‍👦 Familiecampings
            </Link>
            <Link 
              href="/campings?strand=true" 
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🏖️ Aan het strand
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map((feature, i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-emerald-100 rounded-xl mb-4">
                  <feature.icon className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                Campings per Land
              </h2>
              <p className="text-gray-500 mt-1">Ontdek campings in je favoriete vakantiebestemming</p>
            </div>
            <Link 
              href="/campings" 
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center gap-1"
            >
              Alle landen
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularCountries.map((country) => (
              <Link
                key={country.slug}
                href={`/campings/${country.slug}`}
                className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{country.flag}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      {country.name}
                    </h3>
                    <p className="text-sm text-gray-500">{country.campings.toLocaleString()} campings</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Regions */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
            Populaire Regio&apos;s
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Côte d'Azur", country: "Frankrijk", slug: "frankrijk/cote-d-azur", image: "/regions/cote-azur.jpg" },
              { name: "Toscane", country: "Italië", slug: "italie/toscane", image: "/regions/toscane.jpg" },
              { name: "Costa Brava", country: "Spanje", slug: "spanje/costa-brava", image: "/regions/costa-brava.jpg" },
              { name: "Veluwe", country: "Nederland", slug: "nederland/veluwe", image: "/regions/veluwe.jpg" },
              { name: "Istrië", country: "Kroatië", slug: "kroatie/istrie", image: "/regions/istrie.jpg" },
              { name: "Beieren", country: "Duitsland", slug: "duitsland/beieren", image: "/regions/beieren.jpg" },
            ].map((region) => (
              <Link
                key={region.slug}
                href={`/campings/${region.slug}`}
                className="group relative h-48 rounded-xl overflow-hidden bg-gray-200"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <p className="text-sm text-emerald-300">{region.country}</p>
                  <h3 className="text-xl font-bold group-hover:text-emerald-300 transition-colors">
                    {region.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <TreePine className="w-12 h-12 mx-auto mb-4 text-emerald-200" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Klaar om te kamperen?
          </h2>
          <p className="text-emerald-100 mb-8 max-w-2xl mx-auto">
            Vind vandaag nog de perfecte camping voor jouw volgende avontuur. 
            Filter op faciliteiten, lees reviews en plan je vakantie!
          </p>
          <Link 
            href="/zoeken" 
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-3 rounded-lg font-semibold hover:bg-emerald-50 transition-colors"
          >
            <Search className="w-5 h-5" />
            Start je zoektocht
          </Link>
        </div>
      </section>
    </main>
  );
}
