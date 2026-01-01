import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

function createPrismaClient() {
  // Use Accelerate URL for edge/serverless, direct URL for local scripts
  return new PrismaClient({
    datasourceUrl: process.env.PRISMA_DATABASE_URL,
  }).$extends(withAccelerate());
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
