import { PrismaClient } from "../../app/generated/prisma/client";

const databaseUrl = process.env["DATABASE_URL"];

if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL environment variable.");
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const isAccelerateUrl =
  databaseUrl.startsWith("prisma://") ||
  databaseUrl.startsWith("prisma+postgres://");

const prisma =
  globalThis.prisma ||
  (isAccelerateUrl
    ? new PrismaClient({ accelerateUrl: databaseUrl })
    : (() => {
        throw new Error(
          "Direct PostgreSQL connection strings require a Prisma adapter. Install @prisma/adapter-pg and initialize PrismaClient with { adapter: new PrismaPg({ connectionString: DATABASE_URL }) }.",
        );
      })());

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

export default prisma;
