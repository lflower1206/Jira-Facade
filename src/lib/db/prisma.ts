import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function ensureDirExists(url: string) {
  if (url.startsWith("file:")) {
    const filePath = url.slice("file:".length);
    const resolvedDir = path.dirname(path.resolve(process.cwd(), filePath));
    if (!fs.existsSync(resolvedDir)) {
      fs.mkdirSync(resolvedDir, { recursive: true });
    }
  }
}

export function createPrismaClient(databaseUrl?: string) {
  const url = databaseUrl ?? process.env.DATABASE_URL ?? "file:./data/jira-facade.db";
  ensureDirExists(url);
  const adapter = new PrismaBetterSqlite3({ url });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
