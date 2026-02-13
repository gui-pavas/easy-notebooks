import { PrismaPg } from '@prisma/adapter-pg'
import { env } from '@/lib/config/env'
import { PrismaClient } from './generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const connectionString = env.DATABASE_URL

  const url = new URL(connectionString)
  const schema = url.searchParams.get('schema') ?? undefined
  const adapter = new PrismaPg({ connectionString }, { schema })
  return new PrismaClient({ adapter })
}

const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export default prisma
