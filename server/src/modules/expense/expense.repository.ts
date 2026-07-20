import { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../database/prisma.js";
import { serializeDecimal } from "../../utils/serialize.js";

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
            user: {
              select: {
                name: true,
              },
            },
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

  async createExpense(db: DbClient, data: Prisma.ExpenseUncheckedCreateInput) {
    return db.expense.create({
      data,
    });
  },

  async createExpenseShares(db: DbClient, data: Prisma.ExpenseShareCreateManyInput[]) {
    return db.expenseShare.createMany({
      data,
    });
  },

  async updateGroup(db: DbClient, groupId: string, data: Prisma.GroupUpdateInput) {
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

  async updateExpense(db: DbClient, expenseId: string, data: Prisma.ExpenseUpdateInput) {
    return db.expense.update({
      where: {
        id: expenseId,
      },
      data,
    });
  },

  async getGroupExpenses(groupId: string) {
    const expenses = await prisma.expense.findMany({
      where: {
        groupId,
      },
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        splitMethod: true,
        status: true,
        expenseDate: true,
        participantCount: true,
        paidCount: true,
        createdAt: true,

        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        paidBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        shares: {
          select: {
            id: true,
            amount: true,
            status: true,
            paidAt: true,

            debtor: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
      orderBy: {
        expenseDate: "desc",
      },
    });

    return serializeDecimal(expenses);
  },

  async getExpenseDetails(expenseId: string) {
    const expense = await prisma.expense.findUnique({
      where: {
        id: expenseId,
      },
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        splitMethod: true,
        status: true,
        expenseDate: true,
        participantCount: true,
        paidCount: true,
        createdAt: true,

        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        paidBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },

        group: {
          select: {
            memberships: {
              select: {
                userId: true,
              },
            },
          },
        },

        shares: {
          select: {
            id: true,
            amount: true,
            status: true,
            paidAt: true,

            debtor: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },

            creditor: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    return serializeDecimal(expense);
  },
};
