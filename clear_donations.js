const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.donation.deleteMany({});
  await prisma.monthlyDonation.deleteMany({});
  console.log('Cleaned up all fake/demo donations from database.');
}

main().finally(() => prisma.$disconnect());
