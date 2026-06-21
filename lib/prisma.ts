import { PrismaClient } from "../app/generated/prisma/client";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

const isAccelerateUrl =
  databaseUrl.startsWith("prisma://") ||
  databaseUrl.startsWith("prisma+postgres://");

const prisma = isAccelerateUrl
  ? new PrismaClient({ accelerateUrl: databaseUrl })
  : (() => {
      throw new Error(
        "Direct PostgreSQL connection strings require a Prisma adapter. Install @prisma/adapter-pg and initialize PrismaClient with { adapter: new PrismaPg({ connectionString: DATABASE_URL }) }.",
      );
    })();

export default prisma;
