const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany();
  console.log('All products deleted');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
