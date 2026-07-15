import { PrismaClient } from "@prisma/client";

// ─────────────────────────────────────────────────────────────────────────────
// Prisma Client Singleton
//
// In development, Next.js hot-reload creates new module instances on every
// file change. Without this pattern, each reload opens a new DB connection
// pool and exhausts the database's connection limit quickly.
//
// Solution: attach the PrismaClient instance to `globalThis` so it survives
// hot-reloads. In production, always create a fresh instance.
// ─────────────────────────────────────────────────────────────────────────────

const prismaClientSingleton = () => {
  return new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
