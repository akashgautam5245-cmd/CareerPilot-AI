import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

export const prisma = new PrismaClient();

export async function connectPrisma() {
  try {
    await prisma.$connect();
    logger.info('Connected to PostgreSQL via Prisma ORM.');
  } catch (error) {
    logger.warn('PostgreSQL database connection pending or unconfigured. Application starting with Prisma client fallback mode.');
  }
}
