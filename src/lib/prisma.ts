import { PrismaClient } from '@prisma/client'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import * as dotenv from 'dotenv'
dotenv.config()

let _prisma: PrismaClient | null = null

const prismaClientSingleton = () => {
  const urlStr = process.env.DB_URL
  if (!urlStr) {
    throw new Error('DB_URL is not defined')
  }

  const url = new URL(urlStr)

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: decodeURIComponent(url.password),
    database: url.pathname.substring(1),
    connectTimeout: 10000,
  })

  return new PrismaClient({ adapter })
}

declare global {
  var prismaGlobal: PrismaClient | undefined
}

// Lazy getter - only creates client when accessed
export const getPrisma = () => {
  if (!_prisma) {
    _prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
    if (process.env.NODE_ENV !== 'production') {
      globalThis.prismaGlobal = _prisma
    }
  }
  return _prisma
}

// For backwards compatibility - but will throw if DB_URL not set
export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop) => {
    const client = getPrisma()
    return (client as any)[prop]
  }
})

