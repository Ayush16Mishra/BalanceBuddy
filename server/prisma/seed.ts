import { PrismaClient, AuthProvider } from "../src/generated/prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.user.deleteMany();
  const hashedPassword = await bcrypt.hash("password", 10);
  // Users
  const ayush = await prisma.user.create({
    data: {
      name: "Ayush",
      email: "ayush@example.com",
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
    },
  });

  const rahul = await prisma.user.create({
    data: {
      name: "Rahul",
      email: "rahul@example.com",
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
    },
  });

  const john = await prisma.user.create({
    data: {
      name: "John",
      email: "john@example.com",
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
    },
  });

  const priya = await prisma.user.create({
    data: {
      name: "Priya",
      email: "priya@example.com",
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
    },
  });

  // Groups
  const goa = await prisma.group.create({
    data: {
      name: "Goa Trip",
      description: "Goa vacation",
    },
  });

  const flat = await prisma.group.create({
    data: {
      name: "Flatmates",
    },
  });

  // Memberships
  await prisma.groupMember.createMany({
    data: [
      { groupId: goa.id, userId: ayush.id },
      { groupId: goa.id, userId: rahul.id },
      { groupId: goa.id, userId: john.id },
      { groupId: goa.id, userId: priya.id },

      { groupId: flat.id, userId: ayush.id },
      { groupId: flat.id, userId: rahul.id },
      { groupId: flat.id, userId: priya.id },
    ],
  });

  console.log("🌱 Database seeded successfully!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });