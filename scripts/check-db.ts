import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });
dotenv.config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const commands = await prisma.completedCommand.findMany({ include: { references: true } });
  console.log('Commands in DB:', JSON.stringify(commands, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
