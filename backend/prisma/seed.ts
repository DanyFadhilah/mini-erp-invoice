import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: {
      name: 'ADMIN',
    },
    update: {},
    create: {
      name: 'ADMIN',
    },
  });

  const staffRole = await prisma.role.upsert({
    where: {
      name: 'STAFF',
    },
    update: {},
    create: {
      name: 'STAFF',
    },
  });

  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@mail.com',
    },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@mail.com',
      password: adminPassword,
      roleId: adminRole.id,
    },
  });

  await prisma.user.upsert({
    where: {
      email: 'staff@mail.com',
    },
    update: {},
    create: {
      name: 'Staff',
      email: 'staff@mail.com',
      password: staffPassword,
      roleId: staffRole.id,
    },
  });

  console.log('Seed success');
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
