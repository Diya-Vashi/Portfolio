import { PrismaClient } from '@prisma/client';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const setupPrisma = () => {
  const url = `${process.env.DATABASE_URL}`;
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in the environment.');
  }
  const adapter = new PrismaNeon({ connectionString: url });
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? setupPrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
