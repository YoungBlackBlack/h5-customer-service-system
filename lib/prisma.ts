import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// 只在有数据库连接时创建 Prisma 客户端
let prismaInstance: PrismaClient | null = null

if (process.env.POSTGRES_PRISMA_URL) {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error'] : ['error'],
  })
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prismaInstance
  }
}

export const prisma = prismaInstance as PrismaClient

// 检查数据库是否可用
export const isDatabaseAvailable = () => {
  return Boolean(process.env.POSTGRES_PRISMA_URL && prismaInstance)
}