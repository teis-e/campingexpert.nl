import Link from "next/link";
import { ChevronRight, MapPin, Tent } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Alle Campings in Europa",
  description: "Ontdek campings in heel Europa. Kies je land en vind de perfecte camping voor jouw vakantie.",
};

// Countries data (will be fetched from DB later)
const countries = [
  { name: "Nederland", slug: "nederland", flag: "🇳🇱", campings: 2500, regions: 12 },
  { name: "België", slug: "belgie", flag: "🇧🇪", campings: 800, regions: 5 },
  { name: "Duitsland", slug: "duitsland", flag: "🇩🇪", campings: 3100, regions: 16 },
  { name: "Frankrijk", slug: "frankrijk", flag: "🇫🇷", campings: 8500, regions: 22 },
  { name: "Spanje", slug: "spanje", flag: "🇪🇸", campings: 4200, regions: 17 },
  { name: "Portugal", slug: "portugal", flag: "🇵🇹", campings: 1100, regions: 7 },
  { name: "Italië", slug: "italie", flag: "🇮🇹", campings: 3800, regions: 20 },
  { name: "Kroatië", slug: "kroatie", flag: "🇭🇷", campings: 1800, regions: 8 },
  { name: "Slovenië", slug: "slovenie", flag: "🇸🇮", campings: 400, regions: 4 },
  { name: "Oostenrijk", slug: "oostenrijk", flag: "🇦🇹", campings: 1200, regions: 9 },
  { name: "Zwitserland", slug: "zwitserland", flag: "🇨🇭", campings: 600, regions: 6 },
  { name: "Denemarken", slug: "denemarken", flag: "🇩🇰", campings: 500, regions: 5 },
  { name: "Zweden", slug: "zweden", flag: "🇸🇪", campings: 900, regions: 8 },
  { name: "Noorwegen", slug: "noorwegen", flag: "🇳🇴", campings: 700, regions: 7 },
  { name: "Griekenland", slug: "griekenland", flag: "🇬🇷", campings: 1500, regions: 13 },
  { name: "Tsjechië", slug: "tsjechie", flag: "🇨🇿", campings: 600, regions: 6 },
];

export default function CampingsPage() {
  const totalCampings = countries.reduce((sum, c) => sum + c.campings, 0);
  const totalCountries = countries.length;

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <span>Campings</span>
          </nav>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Tent className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Alle Campings in Europa
              </h1>
              <p className="text-emerald-100 mt-1">
                {totalCampings.toLocaleString()} campings in {totalCountries} landen
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Kies een land
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {countries.map((country) => (
              <Link
                key={country.slug}
                href={`/campings/${country.slug}`}
                className="group bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                      {country.name}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Tent className="w-4 h-4" />
                        <span>{country.campings.toLocaleString()} campings</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{country.regions} regio&apos;s</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Content */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-lg max-w-none">
            <h2>Campings in Europa: Jouw Complete Gids</h2>
            <p>
              Europa biedt ongelooflijk diverse kampeerbestemmingen, van de zonnige stranden 
              van de Middellandse Zee tot de groene wouden van Scandinavië. Of je nu op zoek 
              bent naar een luxe glamping met alle faciliteiten of een authentieke 
              natuurcamping in de bergen, bij CampingExpert vind je de perfecte plek.
            </p>
            
            <h3>Populaire Kampeerbestemmingen</h3>
            <p>
              <strong>Frankrijk</strong> is met ruim 8.500 campings de absolute kampioen, 
              met populaire regio&apos;s als de Côte d&apos;Azur, de Ardèche en de Dordogne. 
              <strong>Spanje</strong> en <strong>Italië</strong> volgen met prachtige 
              campings aan de Costa Brava, in Toscane en bij de Italiaanse meren.
            </p>
            
            <h3>Dichter bij Huis</h3>
            <p>
              Ook in <strong>Nederland</strong>, <strong>België</strong> en 
              <strong>Duitsland</strong> zijn er fantastische campings te vinden. 
              Van de Veluwe tot de Ardennen en van het Zwarte Woud tot de Moezel.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
