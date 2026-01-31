import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const createPrismaClient = () => {
    const dbUrl = process.env.DB_URL || "mysql://user:pass@localhost:3306/db"; // Dummy fallback for build phase
    return new PrismaClient({
        datasources: {
            db: {
                url: dbUrl
            }
        },
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
