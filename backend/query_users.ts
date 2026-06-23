import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const users = await prisma.user.findMany({
    take: 5,
    select: {
      email: true,
    }
  });
  console.log('Recent Users:', users);
  await prisma.$disconnect();
}

main().catch(console.error);
