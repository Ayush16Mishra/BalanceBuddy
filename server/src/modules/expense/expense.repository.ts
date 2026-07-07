import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

type DbClient = Prisma.TransactionClient | PrismaClient;

export const expenseRepository = {
  async getGroupById(groupId: string) {
  return prisma.group.findUnique({
    where: {
      id: groupId,
    },
    select: {
      id: true,
      isLocked: true,
      memberships: {
        select: {
          userId: true,
        },
      },
      _count: {
        select: {
          expenses: true,
        },
      },
    },
  });
},

  async createExpense(
    db: DbClient,
    data: Prisma.ExpenseUncheckedCreateInput
  ) {
    return db.expense.create({
      data,
    });
  },

  async createExpenseShares(
    db: DbClient,
    data: Prisma.ExpenseShareCreateManyInput[]
  ) {
    return db.expenseShare.createMany({
      data,
    });
  },

  async updateGroup(
    db: DbClient,
    groupId: string,
    data: Prisma.GroupUpdateInput
  ) {
    return db.group.update({
      where: {
        id: groupId,
      },
      data,
    });
  },

async getExpenseById(expenseId: string) {
  return prisma.expense.findUnique({
    where: {
      id: expenseId,
    },
    include: {
      group: {
        select: {
          memberships: {
            select: {
              userId: true,
            },
          },
        },
      },
    },
  });
},

async updateExpense(
  db: DbClient,
  expenseId: string,
  data: Prisma.ExpenseUpdateInput
) {
  return db.expense.update({
    where: {
      id: expenseId,
    },
    data,
  });
}

};