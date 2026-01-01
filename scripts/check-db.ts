import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.POSTGRES_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const count = await prisma.camping.count();
  console.log("Total campings:", count);

  const sample = await prisma.camping.findFirst({
    select: {
      naam: true,
      land: true,
      regio: true,
      stad: true,
      rating: true,
      aantalReviews: true,
      fotoUrl: true,
      heeftStaanplaats: true,
      heeftStacaravan: true,
    },
  });
  console.log("Sample:", JSON.stringify(sample, null, 2));

  const byCountry = await prisma.camping.groupBy({
    by: ["land"],
    _count: true,
    orderBy: { _count: { land: "desc" } },
    take: 10,
  });
  console.log("\nBy country:");
  for (const c of byCountry) {
    console.log(`  ${c.land}: ${c._count}`);
  }

  await pool.end();
}

main();
