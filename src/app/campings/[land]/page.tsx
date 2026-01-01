import Link from "next/link";
import { ChevronRight, MapPin, Tent, Star } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
// import prisma from "@/lib/prisma";

interface PageProps {
  params: Promise<{ land: string }>;
}

// Temporary data until DB is connected
const countriesData: Record<string, { name: string; flag: string; description: string }> = {
  nederland: { name: "Nederland", flag: "🇳🇱", description: "Ontdek campings in Nederland, van de Veluwe tot de kust." },
  belgie: { name: "België", flag: "🇧🇪", description: "Kamperen in België: Ardennen, Vlaanderen en meer." },
  duitsland: { name: "Duitsland", flag: "🇩🇪", description: "Duitse campings van Beieren tot de Noordzee." },
  frankrijk: { name: "Frankrijk", flag: "🇫🇷", description: "La belle France: campings aan de Côte d'Azur, in de Provence en meer." },
  spanje: { name: "Spanje", flag: "🇪🇸", description: "Spaanse campings aan de Costa Brava, Costa Blanca en Andalusië." },
  italie: { name: "Italië", flag: "🇮🇹", description: "Italiaanse campings bij de meren, in Toscane en aan de kust." },
  kroatie: { name: "Kroatië", flag: "🇭🇷", description: "Kroatische campings in Istrië en Dalmatië." },
  oostenrijk: { name: "Oostenrijk", flag: "🇦🇹", description: "Oostenrijkse campings in de Alpen en bij de meren." },
  portugal: { name: "Portugal", flag: "🇵🇹", description: "Portugese campings aan de Algarve en in het binnenland." },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { land } = await params;
  const country = countriesData[land];
  
  if (!country) return { title: "Land niet gevonden" };
  
  return {
    title: `Campings in ${country.name}`,
    description: country.description,
  };
}

export default async function LandPage({ params }: PageProps) {
  const { land } = await params;
  const country = countriesData[land];
  
  if (!country) {
    notFound();
  }

  // Placeholder regions - will come from DB
  const regions = [
    { name: "Noord-Holland", slug: "noord-holland", campings: 120 },
    { name: "Zuid-Holland", slug: "zuid-holland", campings: 95 },
    { name: "Gelderland", slug: "gelderland", campings: 180 },
    { name: "Noord-Brabant", slug: "noord-brabant", campings: 110 },
    { name: "Limburg", slug: "limburg", campings: 85 },
    { name: "Zeeland", slug: "zeeland", campings: 140 },
    { name: "Friesland", slug: "friesland", campings: 75 },
    { name: "Overijssel", slug: "overijssel", campings: 90 },
  ];

  // Placeholder campings - will come from DB
  const popularCampings = [
    { naam: "Camping De Veluwe", slug: "camping-de-veluwe", plaats: "Ermelo", rating: 4.5, reviewCount: 234 },
    { naam: "Strandcamping Groede", slug: "strandcamping-groede", plaats: "Groede", rating: 4.7, reviewCount: 567 },
    { naam: "Camping 't Veld", slug: "camping-t-veld", plaats: "Bergen", rating: 4.3, reviewCount: 189 },
  ];

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-emerald-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-2 text-emerald-100 text-sm mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/campings" className="hover:text-white">Campings</Link>
            <ChevronRight className="w-4 h-4" />
            <span>{country.name}</span>
          </nav>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">
                Campings in {country.name}
              </h1>
              <p className="text-emerald-100 mt-1">
                {country.description}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Regions */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Regio&apos;s in {country.name}
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {regions.map((region) => (
                  <Link
                    key={region.slug}
                    href={`/campings/${land}/${region.slug}`}
                    className="group bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {region.name}
                        </h3>
                        <p className="text-sm text-gray-500">{region.campings} campings</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Popular Campings */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Populaire Campings in {country.name}
              </h2>
              <div className="space-y-4">
                {popularCampings.map((camping) => (
                  <Link
                    key={camping.slug}
                    href={`/campings/${land}/${camping.slug}`}
                    className="group block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors text-lg">
                          {camping.naam}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <MapPin className="w-4 h-4" />
                          <span>{camping.plaats}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="font-medium text-gray-900">{camping.rating}</span>
                          <span className="text-gray-500 text-sm">({camping.reviewCount} reviews)</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4">
                <Tent className="w-5 h-5 inline mr-2 text-emerald-600" />
                Snel zoeken
              </h3>
              <div className="space-y-3">
                <Link 
                  href={`/campings/${land}?zwembad=true`}
                  className="block text-sm text-gray-600 hover:text-emerald-600"
                >
                  🏊 Campings met zwembad
                </Link>
                <Link 
                  href={`/campings/${land}?huisdieren=true`}
                  className="block text-sm text-gray-600 hover:text-emerald-600"
                >
                  🐕 Huisdieren welkom
                </Link>
                <Link 
                  href={`/campings/${land}?strand=true`}
                  className="block text-sm text-gray-600 hover:text-emerald-600"
                >
                  🏖️ Aan het strand
                </Link>
                <Link 
                  href={`/campings/${land}?type=familie`}
                  className="block text-sm text-gray-600 hover:text-emerald-600"
                >
                  👨‍👩‍👧‍👦 Familiecampings
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
