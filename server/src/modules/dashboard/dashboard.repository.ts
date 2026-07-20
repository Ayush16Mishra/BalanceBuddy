import { ExpenseStatus } from "@prisma/client";
import { prisma } from "../../database/prisma.js";

export const dashboardRepository = {
  async getActiveGroupCount(userId: string) {
    return prisma.groupMember.count({
      where: {
        userId,
      },
    });
  },

  async getRecentExpenses(userId: string, limit = 5) {
    return prisma.expense.findMany({
      where: {
        status: ExpenseStatus.ACTIVE,
        group: {
          memberships: {
            some: {
              userId,
            },
          },
        },
      },
      select: {
        id: true,
        title: true,
        amount: true,
        category: true,
        expenseDate: true,
        paidCount: true,
        participantCount: true,
        group: {
          select: {
            id: true,
            name: true,
          },
        },
        paidBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
      orderBy: {
        expenseDate: "desc",
      },
      take: limit,
    });
  },
};
