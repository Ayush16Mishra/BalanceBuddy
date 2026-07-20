import { ExpenseShareStatus, ExpenseStatus, Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

type DbClient = Prisma.TransactionClient | PrismaClient;

export const expenseSharesRepository = {
  async getShareById(shareId: string) {
    return prisma.expenseShare.findUnique({
      where: {
        id: shareId,
      },
      select: {
        id: true,

        expenseId: true,
        debtorId: true,
        creditorId: true,
        status: true,

        debtor: {
          select: {
            name: true,
          },
        },

        expense: {
          select: {
            id: true,
            title: true,
            groupId: true,
            status: true,
            paidCount: true,
            participantCount: true,
          },
        },
      },
    });
  },

  async updateShare(db: DbClient, shareId: string, data: Prisma.ExpenseShareUpdateInput) {
    return db.expenseShare.update({
      where: {
        id: shareId,
      },
      data,
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

  async getPendingShares(userId: string, groupId?: string) {
    const expenseFilter: Prisma.ExpenseWhereInput = {
      status: ExpenseStatus.ACTIVE,
    };

    if (groupId !== undefined) {
      expenseFilter.groupId = groupId;
    }

    return prisma.expenseShare.findMany({
      where: {
        status: ExpenseShareStatus.PENDING,
        expense: expenseFilter,
        OR: [
          {
            debtorId: userId,
          },
          {
            creditorId: userId,
          },
        ],
      },
      select: {
        id: true,
        amount: true,
        debtorId: true,
        creditorId: true,
        expenseId: true,
        expense: {
          select: {
            title: true,
            category: true,
            expenseDate: true,
          },
        },
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
      orderBy: {
        expense: {
          expenseDate: "desc",
        },
      },
    });
  },

  async getPendingSharesBetweenUsers(groupId: string, currentUserId: string, otherUserId: string) {
    return prisma.expenseShare.findMany({
      where: {
        status: ExpenseShareStatus.PENDING,
        expense: {
          groupId,
          status: ExpenseStatus.ACTIVE,
        },
        OR: [
          {
            debtorId: currentUserId,
            creditorId: otherUserId,
          },
          {
            debtorId: otherUserId,
            creditorId: currentUserId,
          },
        ],
      },
      select: {
        id: true,
        expenseId: true,
        expense: {
          select: {
            paidCount: true,
            participantCount: true,
          },
        },
      },
    });
  },
};
