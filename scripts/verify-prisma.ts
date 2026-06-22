import 'dotenv/config';
import { prisma } from '../app/lib/prisma';

async function main() {
  try {
    // Perform one read
    const receptions = await prisma.completedReception.findMany({ take: 1 });
    console.log('✅ Connected');
  } catch (error) {
    console.error('Connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
