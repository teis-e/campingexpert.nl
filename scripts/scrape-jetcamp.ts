import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import fs from "fs";
import path from "path";

// Use direct PostgreSQL connection for scripts
const pool = new pg.Pool({
  connectionString: process.env.POSTGRES_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const BASE_URL = "https://www.jetcamp.com/nl/ajax/europa/";
const DELAY_MS = 500; // Be respectful to the API
const MAX_PAGES = 1011; // Total pages available

interface JetCampCamping {
  id: string;
  name: string;
  address_street: string | null;
  address_housenumber: string | null;
  address_postcode: string | null;
  address_city: string | null;
  address_country: string | null;
  address_gps_lat: number | null;
  address_gps_lon: number | null;
  address_phone: string | null;
  address_phone_2: string | null;
  address_email_public: string | null;
  address_website: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  customer_rating_count: number | null;
  customer_rating_average: string | null;
  official_rating: number | null;
  popularity: number | null;
  size_nr_total: number | null;
  size_nr_recreational_pitches: number | null;
  size_nr_mobilehomerentals: number | null;
  price_highseason: string | null;
  geo_tree?: {
    name: string;
    translation_fallback: string;
    breadcrumb_top_region?: {
      name: string;
      translation_fallback: string;
      translations?: Array<{
        translation: string;
        language_id: number;
      }>;
    };
  };
  main_photo?: {
    img_url: string;
    img_url_480: string;
    img_url_640: string;
    img_url_1024: string;
  };
  urls?: Array<{
    full_url: string;
    url: string;
  }>;
  facility_subs?: Array<{
    description: string;
    pivot_value: number;
    pivot_value_custom: string | null;
  }>;
}

interface JetCampApiResponse {
  paginator: {
    data: JetCampCamping[];
    last_page: number;
    total: number;
    current_page: number;
  };
}

interface JetCampResponse {
  data: JetCampCamping[];
  last_page: number;
  total: number;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractCountryFromUrl(urls: JetCampCamping["urls"]): string | null {
  if (!urls || urls.length === 0) return null;
  const url = urls[0].url;
  const parts = url.split("/");
  return parts[0] || null;
}

function extractFacilities(facilities: JetCampCamping["facility_subs"]) {
  if (!facilities) return {};

  const facilityMap: Record<string, boolean> = {};

  for (const facility of facilities) {
    const desc = facility.description;
    
    // Map facility descriptions to boolean fields
    if (desc.includes("pitch")) facilityMap.staanplaats = true;
    if (desc.includes("mobilehome")) facilityMap.stacaravan = true;
    if (desc.includes("chalet") || desc.includes("bungalow")) facilityMap.chalet = true;
    if (desc.includes("safaritent") || desc.includes("glamping")) facilityMap.glamping = true;
    if (desc.includes("furnishedtent")) facilityMap.ingerichteTent = true;
    if (desc.includes("camper")) facilityMap.camperplaats = true;
    if (desc.includes("apartment")) facilityMap.appartement = true;
  }

  return facilityMap;
}

async function fetchPage(page: number): Promise<JetCampResponse | null> {
  try {
    const response = await fetch(`${BASE_URL}?page=${page}`, {
      headers: {
        "User-Agent": "CampingExpert.nl SEO Bot (contact: info@campingexpert.nl)",
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch page ${page}: ${response.status}`);
      return null;
    }

    const apiResponse: JetCampApiResponse = await response.json();
    
    // Transform nested structure to flat structure
    return {
      data: apiResponse.paginator.data,
      last_page: apiResponse.paginator.last_page,
      total: apiResponse.paginator.total,
    };
  } catch (error) {
    console.error(`Error fetching page ${page}:`, error);
    return null;
  }
}

async function scrapeAndSave(startPage = 1, endPage = MAX_PAGES) {
  console.log(`Starting JetCamp scrape from page ${startPage} to ${endPage}...`);
  
  let totalCampings = 0;
  let savedCampings = 0;
  let skippedCampings = 0;

  for (let page = startPage; page <= endPage; page++) {
    console.log(`\nFetching page ${page}/${endPage}...`);
    
    const response = await fetchPage(page);
    if (!response) {
      console.log(`Skipping page ${page} due to fetch error`);
      continue;
    }

    for (const camping of response.data) {
      totalCampings++;

      try {
        const country = extractCountryFromUrl(camping.urls) || 
                       camping.address_country?.toLowerCase().replace(/\s+/g, "-") || 
                       "unknown";

        const region = camping.geo_tree?.breadcrumb_top_region?.translations?.[0]?.translation ||
                      camping.geo_tree?.breadcrumb_top_region?.translation_fallback ||
                      camping.geo_tree?.breadcrumb_top_region?.name || null;

        const facilities = extractFacilities(camping.facility_subs);

        // Build full address
        const addressParts = [
          camping.address_street,
          camping.address_housenumber,
        ].filter(Boolean);
        const straat = addressParts.join(" ") || null;

        // Parse rating
        const rating = camping.customer_rating_average 
          ? parseFloat(camping.customer_rating_average) 
          : null;

        // Parse price (remove € and quotes)
        let prijsVanaf: number | null = null;
        if (camping.price_highseason) {
          const priceMatch = camping.price_highseason.match(/[\d.]+/);
          if (priceMatch) {
            prijsVanaf = parseFloat(priceMatch[0]);
          }
        }

        // Generate unique slug using camping name + jetcamp id
        const baseSlug = camping.name.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-")
          .substring(0, 90);
        const slug = `${baseSlug}-${camping.id}`;

        // Upsert camping
        await prisma.camping.upsert({
          where: { jetcampId: camping.id },
          update: {
            naam: camping.name,
            slug,
            land: country,
            regio: region,
            stad: camping.geo_tree?.name || camping.address_city || null,
            postcode: camping.address_postcode,
            straat,
            latitude: camping.address_gps_lat,
            longitude: camping.address_gps_lon,
            telefoon: camping.address_phone_2 || camping.address_phone,
            email: camping.address_email_public,
            website: camping.address_website,
            facebookUrl: camping.social_facebook,
            instagramUrl: camping.social_instagram,
            rating,
            aantalReviews: camping.customer_rating_count,
            sterren: camping.official_rating,
            aantalPlaatsen: camping.size_nr_total,
            aantalStaanplaatsen: camping.size_nr_recreational_pitches,
            aantalHuuraccommodaties: camping.size_nr_mobilehomerentals,
            prijsVanaf,
            fotoUrl: camping.main_photo?.img_url,
            fotoUrl480: camping.main_photo?.img_url_480,
            fotoUrl1024: camping.main_photo?.img_url_1024,
            jetcampUrl: camping.urls?.[0]?.full_url,
            // Facilities
            heeftStaanplaats: facilities.staanplaats || false,
            heeftStacaravan: facilities.stacaravan || false,
            heeftChalet: facilities.chalet || false,
            heeftGlamping: facilities.glamping || false,
            heeftTent: facilities.ingerichteTent || false,
            heeftCamperplaats: facilities.camperplaats || false,
            updatedAt: new Date(),
          },
          create: {
            jetcampId: camping.id,
            naam: camping.name,
            slug,
            land: country,
            regio: region,
            stad: camping.geo_tree?.name || camping.address_city || null,
            postcode: camping.address_postcode,
            straat,
            latitude: camping.address_gps_lat,
            longitude: camping.address_gps_lon,
            telefoon: camping.address_phone_2 || camping.address_phone,
            email: camping.address_email_public,
            website: camping.address_website,
            facebookUrl: camping.social_facebook,
            instagramUrl: camping.social_instagram,
            rating,
            aantalReviews: camping.customer_rating_count,
            sterren: camping.official_rating,
            aantalPlaatsen: camping.size_nr_total,
            aantalStaanplaatsen: camping.size_nr_recreational_pitches,
            aantalHuuraccommodaties: camping.size_nr_mobilehomerentals,
            prijsVanaf,
            fotoUrl: camping.main_photo?.img_url,
            fotoUrl480: camping.main_photo?.img_url_480,
            fotoUrl1024: camping.main_photo?.img_url_1024,
            jetcampUrl: camping.urls?.[0]?.full_url,
            // Facilities
            heeftStaanplaats: facilities.staanplaats || false,
            heeftStacaravan: facilities.stacaravan || false,
            heeftChalet: facilities.chalet || false,
            heeftGlamping: facilities.glamping || false,
            heeftTent: facilities.ingerichteTent || false,
            heeftCamperplaats: facilities.camperplaats || false,
          },
        });

        savedCampings++;
        
        if (savedCampings % 100 === 0) {
          console.log(`  Saved ${savedCampings} campings...`);
        }
      } catch (error) {
        console.error(`Error saving camping ${camping.id} (${camping.name}):`, error);
        skippedCampings++;
      }
    }

    // Be nice to the server
    await sleep(DELAY_MS);
  }

  console.log(`\n=== Scrape Complete ===`);
  console.log(`Total campings processed: ${totalCampings}`);
  console.log(`Successfully saved: ${savedCampings}`);
  console.log(`Skipped/errors: ${skippedCampings}`);
}

// Export raw data to JSON for backup
async function exportToJson(startPage = 1, endPage = 10) {
  console.log(`Exporting pages ${startPage}-${endPage} to JSON...`);
  
  const allData: JetCampCamping[] = [];

  for (let page = startPage; page <= endPage; page++) {
    console.log(`Fetching page ${page}...`);
    const response = await fetchPage(page);
    if (response) {
      allData.push(...response.data);
    }
    await sleep(DELAY_MS);
  }

  const outputPath = path.join(__dirname, `jetcamp-export-${startPage}-${endPage}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
  console.log(`Exported ${allData.length} campings to ${outputPath}`);
}

// Parse CLI args
const args = process.argv.slice(2);
const isExport = args.includes("--export");
const isTest = args.includes("--test");
const startPage = parseInt(args.find(a => a.startsWith("--start="))?.split("=")[1] || "1");
const endPage = parseInt(args.find(a => a.startsWith("--end="))?.split("=")[1] || (isTest ? "3" : String(MAX_PAGES)));

async function main() {
  console.log("JetCamp Scraper for CampingExpert.nl");
  console.log("====================================");
  console.log(`Mode: ${isExport ? "Export to JSON" : "Save to Database"}`);
  console.log(`Pages: ${startPage} to ${endPage}`);
  console.log("");

  try {
    if (isExport) {
      await exportToJson(startPage, endPage);
    } else {
      await scrapeAndSave(startPage, endPage);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
