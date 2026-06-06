const { PrismaClient, UserRole } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

export async function userSeeders() {
  console.log('🌱 Seeding users...');


  const users = [
    {
      name: 'Andy Widianto',
      email: 'andy@evolve.id',
      password: "andy1234567&",
      role: UserRole.admin,
      username: "andy124",
      updatedAt: new Date(), 
    },
    {
      name: 'Budi Santoso',
      email: 'budi@admin.go.id',
      password: "budy12345678$",
      role: UserRole.admin,
      username: "budy1234",
      updatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000), // Inaktif (2 hari lalu)
    },
    {
      name: 'Siti Aminah',
      email: 'siti@admin.go.id',
      password: "password1234",
      role: UserRole.admin,
      username: "siti123",
      updatedAt: new Date(),
    },
    {
      name: 'Admin admin',
      email: 'admin@admin.go.id',
      password: "admin09876545&",
      role: UserRole.admin,
      username: "admin1234",
      updatedAt: new Date(),
    },
    {
      name: 'User Testing',
      email: 'test@example.com',
      password: "testing1239654&",
      role: UserRole.admin,
      username: "test1234",
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Review',
      email: 'review@example.com',
      password: "preview1234",
      role: UserRole.review,
      username: "reviewer",
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'andy',
      email: 'andywidianto56@gmail.com',
      password: "developer1234&",
      role: UserRole.super_admin,
      username: "andywidianto",
      updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const user of users) {
    const hashPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: {
        ...user,
        password: hashPassword
      },
    });
  }

  console.log('✅ User seeding completed.');
}