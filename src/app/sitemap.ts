import { MetadataRoute } from "next";
import prisma from "@/lib/prisma";

const BASE_URL = "https://campingexpert.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/campings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/zoeken`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];

  // Get all active campings
  const campings = await prisma.camping.findMany({
    where: { actief: true },
    select: {
      slug: true,
      landSlug: true,
      regioSlug: true,
      updatedAt: true,
    },
  });

  // Get unique countries
  const countries = await prisma.land.findMany({
    where: { actief: true },
    select: { slug: true },
  });

  // Country pages
  const countryPages: MetadataRoute.Sitemap = countries.map((country) => ({
    url: `${BASE_URL}/campings/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.8,
  }));

  // Get unique regions
  const regions = await prisma.regio.findMany({
    where: { actief: true },
    select: { slug: true, landSlug: true },
  });

  // Region pages
  const regionPages: MetadataRoute.Sitemap = regions.map((region) => ({
    url: `${BASE_URL}/campings/${region.landSlug}/${region.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  // Individual camping pages
  const campingPages: MetadataRoute.Sitemap = campings.map((camping) => ({
    url: `${BASE_URL}/campings/${camping.landSlug}${camping.regioSlug ? `/${camping.regioSlug}` : ''}/${camping.slug}`,
    lastModified: camping.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...countryPages,
    ...regionPages,
    ...campingPages,
  ];
}
