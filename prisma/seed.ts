import { prisma } from '../app/lib/prisma';

async function main() {
  await prisma.completedReception.create({
    data: {
      lotNumber: '12345',
      volume: 30000,
      protein: 3.3,
      fat: 3.8,
      milkType: 'bio',
      deliveryDate: new Date(),
    },
  });

  await prisma.completedCommand.create({
    data: {
      name: 'Test Command',
      status: 'Terminée',
      whiteMassKg: 1000,
      milkReceivedVolume: 1200,
      targetValue: 3.4,
      osmosedVolume: 0,
      milkType: 'bio',
      isSkyr: false,
      references: {
        create: {
          name: 'Classic Bio',
          potsQty: 1000,
          gramPerPot: 125,
        },
      },
    },
  });

  console.log('Seed executed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Cannot close pool manually via PrismaClient if adapter is used
    // but Prisma $disconnect should close the adapter implicitly
    await prisma.$disconnect();
  });
