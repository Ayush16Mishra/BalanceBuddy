import {
  PrismaClient,
  AuthProvider,
  Category,
  ExpenseShareStatus,
  ExpenseStatus,
  SplitMethod,
} from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

type ShareInput = {
  debtorId: string;
  amount: number;
  status?: ExpenseShareStatus;
};

type CreateExpenseInput = {
  title: string;
  amount: number;
  groupId: string;
  createdByUserId: string;
  paidByUserId: string;
  category: Category;
  splitMethod: SplitMethod;
  status?: ExpenseStatus;
  expenseDate?: Date;
  shares: ShareInput[];
};

async function createExpenseWithShares({
  title,
  amount,
  groupId,
  createdByUserId,
  paidByUserId,
  category,
  splitMethod,
  status = ExpenseStatus.ACTIVE,
  expenseDate = new Date(),
  shares,
}: CreateExpenseInput) {
  const participantIds = new Set([paidByUserId, ...shares.map((share) => share.debtorId)]);

  const participantCount = participantIds.size;

  const paidShareCount = shares.filter((share) => share.status === ExpenseShareStatus.PAID).length;

  // Payer is always considered paid
  const paidCount = 1 + paidShareCount;

  const finalStatus = paidCount === participantCount ? ExpenseStatus.SETTLED : status;

  const expense = await prisma.expense.create({
    data: {
      title,
      amount,
      category,
      splitMethod,
      status: finalStatus,
      expenseDate,
      participantCount,
      paidCount,
      groupId,
      createdByUserId,
      paidByUserId,
    },
  });

  for (const share of shares) {
    await prisma.expenseShare.create({
      data: {
        expenseId: expense.id,
        creditorId: paidByUserId,
        debtorId: share.debtorId,
        amount: share.amount,
        status: share.status ?? ExpenseShareStatus.PENDING,
        paidAt: share.status === ExpenseShareStatus.PAID ? expenseDate : null,
      },
    });
  }

  return expense;
}

async function main() {
  // ---------------- Cleanup ----------------

  await prisma.expenseShare.deleteMany();
  await prisma.expense.deleteMany();
  await prisma.invite.deleteMany();
  await prisma.groupMember.deleteMany();
  await prisma.group.deleteMany();
  await prisma.verificationToken.deleteMany();
  await prisma.passwordResetToken.deleteMany();
  await prisma.user.deleteMany();

  // ---------------- Password ----------------

  const hashedPassword = await bcrypt.hash("password", 10);

  // ---------------- Users ----------------

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

  const neha = await prisma.user.create({
    data: {
      name: "Neha",
      email: "neha@example.com",
      password: hashedPassword,
      authProvider: AuthProvider.LOCAL,
      emailVerified: true,
    },
  });

  // ---------------- Groups ----------------

  const goa = await prisma.group.create({
    data: {
      name: "Goa Trip",
      description: "Goa vacation",
      lastActivityAt: new Date(),
    },
  });

  const flat = await prisma.group.create({
    data: {
      name: "Flatmates",
      description: "Apartment expenses",
      lastActivityAt: new Date(),
    },
  });

  // ---------------- Memberships ----------------

  await prisma.groupMember.createMany({
    data: [
      { groupId: goa.id, userId: ayush.id },
      { groupId: goa.id, userId: rahul.id },
      { groupId: goa.id, userId: john.id },
      { groupId: goa.id, userId: priya.id },
      { groupId: goa.id, userId: neha.id },
    ],
  });

  await prisma.groupMember.createMany({
    data: [
      { groupId: flat.id, userId: ayush.id },
      { groupId: flat.id, userId: rahul.id },
      { groupId: flat.id, userId: priya.id },
      { groupId: flat.id, userId: neha.id },
    ],
  });

  // ---------------- Expenses ----------------
  // We'll add these next.

  await createExpenseWithShares({
    title: "Hotel",
    amount: 10000,
    groupId: goa.id,
    createdByUserId: ayush.id,
    paidByUserId: ayush.id,
    category: Category.ACCOMMODATION,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: rahul.id,
        amount: 2000,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: john.id,
        amount: 2000,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: priya.id,
        amount: 2000,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: neha.id,
        amount: 2000,
        status: ExpenseShareStatus.PAID,
      },
    ],
  });
  await createExpenseWithShares({
    title: "Lunch",
    amount: 2500,
    groupId: goa.id,
    createdByUserId: rahul.id,
    paidByUserId: rahul.id,
    category: Category.FOOD,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 500,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: john.id,
        amount: 500,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: priya.id,
        amount: 500,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: neha.id,
        amount: 500,
        status: ExpenseShareStatus.PENDING,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Taxi",
    amount: 1200,
    groupId: goa.id,
    createdByUserId: john.id,
    paidByUserId: john.id,
    category: Category.TRAVEL,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 300,
      },
      {
        debtorId: rahul.id,
        amount: 300,
      },
      {
        debtorId: priya.id,
        amount: 300,
      },
      {
        debtorId: neha.id,
        amount: 300,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Parasailing",
    amount: 5000,
    groupId: goa.id,
    createdByUserId: priya.id,
    paidByUserId: priya.id,
    category: Category.ENTERTAINMENT,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 1000,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: rahul.id,
        amount: 1000,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: john.id,
        amount: 1000,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: neha.id,
        amount: 1000,
        status: ExpenseShareStatus.PAID,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Fuel",
    amount: 1500,
    groupId: goa.id,
    createdByUserId: ayush.id,
    paidByUserId: ayush.id,
    category: Category.TRAVEL,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: rahul.id,
        amount: 375,
      },
      {
        debtorId: john.id,
        amount: 375,
      },
      {
        debtorId: priya.id,
        amount: 375,
      },
      {
        debtorId: neha.id,
        amount: 375,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Snacks",
    amount: 800,
    groupId: goa.id,
    createdByUserId: neha.id,
    paidByUserId: neha.id,
    category: Category.FOOD,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 200,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: rahul.id,
        amount: 200,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: john.id,
        amount: 200,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: priya.id,
        amount: 200,
        status: ExpenseShareStatus.PAID,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Dinner",
    amount: 3000,
    groupId: goa.id,
    createdByUserId: rahul.id,
    paidByUserId: rahul.id,
    category: Category.FOOD,
    splitMethod: SplitMethod.EQUAL,
    status: ExpenseStatus.CANCELLED,
    shares: [
      {
        debtorId: ayush.id,
        amount: 750,
      },
      {
        debtorId: john.id,
        amount: 750,
      },
      {
        debtorId: priya.id,
        amount: 750,
      },
      {
        debtorId: neha.id,
        amount: 750,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Electricity Bill",
    amount: 4200,
    groupId: flat.id,
    createdByUserId: rahul.id,
    paidByUserId: rahul.id,
    category: Category.UTILITIES,
    splitMethod: SplitMethod.EXACT,
    shares: [
      {
        debtorId: ayush.id,
        amount: 1400,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: priya.id,
        amount: 1200,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: neha.id,
        amount: 1600,
        status: ExpenseShareStatus.PENDING,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Internet",
    amount: 2400,
    groupId: flat.id,
    createdByUserId: ayush.id,
    paidByUserId: ayush.id,
    category: Category.UTILITIES,
    splitMethod: SplitMethod.EXACT,
    shares: [
      {
        debtorId: rahul.id,
        amount: 800,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: priya.id,
        amount: 700,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: neha.id,
        amount: 900,
        status: ExpenseShareStatus.PAID,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Groceries",
    amount: 3200,
    groupId: flat.id,
    createdByUserId: priya.id,
    paidByUserId: priya.id,
    category: Category.FOOD,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 800,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: rahul.id,
        amount: 800,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: neha.id,
        amount: 800,
        status: ExpenseShareStatus.PENDING,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Cleaning Supplies",
    amount: 1200,
    groupId: flat.id,
    createdByUserId: neha.id,
    paidByUserId: neha.id,
    category: Category.SHOPPING,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 300,
        status: ExpenseShareStatus.PENDING,
      },
      {
        debtorId: rahul.id,
        amount: 300,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: priya.id,
        amount: 300,
        status: ExpenseShareStatus.PENDING,
      },
    ],
  });

  await createExpenseWithShares({
    title: "Rent Deposit",
    amount: 12000,
    groupId: flat.id,
    createdByUserId: rahul.id,
    paidByUserId: rahul.id,
    category: Category.ACCOMMODATION,
    splitMethod: SplitMethod.EQUAL,
    shares: [
      {
        debtorId: ayush.id,
        amount: 3000,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: priya.id,
        amount: 3000,
        status: ExpenseShareStatus.PAID,
      },
      {
        debtorId: neha.id,
        amount: 3000,
        status: ExpenseShareStatus.PAID,
      },
    ],
  });
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
