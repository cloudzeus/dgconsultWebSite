import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

const DB_PLACEHOLDER = "mysql://placeholder:placeholder@localhost:3306/db";

const createPrismaClient = () => {
    const dbUrl = process.env.DB_URL || DB_PLACEHOLDER;
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

export const isDbConfigured = () => {
    const url = process.env.DB_URL;
    if (!url) return false;
    if (url === DB_PLACEHOLDER) return false;
    return url.startsWith("mysql") || url.startsWith("postgresql");
};
