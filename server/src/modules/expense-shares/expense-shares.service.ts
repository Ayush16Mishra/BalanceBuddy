import { ExpenseShareStatus, ExpenseStatus } from "@prisma/client";
import { prisma } from "../../database/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { expenseSharesRepository } from "./expense-shares.repository.js";

export const expenseSharesService = {
  async markSharePaid(userId: string, shareId: string) {
    const share = await expenseSharesRepository.getShareById(shareId);

    if (!share) {
      throw new ApiError(404, "Expense share not found.");
    }

    if (share.expense.status !== ExpenseStatus.ACTIVE) {
      throw new ApiError(
        400,
        "Cannot settle a cancelled expense."
      );
    }

    if (share.status === ExpenseShareStatus.PAID) {
      throw new ApiError(
        409,
        "Expense share is already paid."
      );
    }

    if (share.debtorId !== userId) {
      throw new ApiError(
        403,
        "You can only settle your own expense share."
      );
    }

    return prisma.$transaction(async (tx) => {
      const updatedShare = await expenseSharesRepository.updateShare(
        tx,
        shareId,
        {
          status: ExpenseShareStatus.PAID,
        }
      );

      const newPaidCount = share.expense.paidCount + 1;

      const expenseData = {
        paidCount: {
          increment: 1,
        },
        status:
          newPaidCount === share.expense.participantCount
            ? ExpenseStatus.SETTLED
            : ExpenseStatus.ACTIVE,
      };

      await expenseSharesRepository.updateExpense(
        tx,
        share.expenseId,
        expenseData
      );

      return updatedShare;
    });
  },

 async getOutstandingBalances(userId: string, groupId?: string) {
  const shares = await expenseSharesRepository.getPendingShares(
    userId,
    groupId
  );

  const balances = new Map<
    string,
    {
      user: {
        id: string;
        name: string;
        avatarUrl: string | null;
      };
      netAmount: number;
      shares: {
        shareId: string;
        expenseId: string;
        title: string;
        category: string;
        expenseDate: Date;
        amount: number;
        direction: "YOU_OWE" | "OWED_TO_YOU";
      }[];
    }
  >();

  for (const share of shares) {
    const amount = Number(share.amount);

    const isDebtor = share.debtorId === userId;

    const otherUser = isDebtor ? share.creditor : share.debtor;
    const otherUserId = isDebtor
      ? share.creditorId
      : share.debtorId;

    let balance = balances.get(otherUserId);

    if (!balance) {
      balance = {
        user: {
          id: otherUser.id,
          name: otherUser.name,
          avatarUrl: otherUser.avatarUrl,
        },
        netAmount: 0,
        shares: [],
      };

      balances.set(otherUserId, balance);
    }

    balance.netAmount += isDebtor ? -amount : amount;

    balance.shares.push({
      shareId: share.id,
      expenseId: share.expenseId,
      title: share.expense.title ?? "Untitled Expense",
      category: share.expense.category,
      expenseDate: share.expense.expenseDate,
      amount,
      direction: isDebtor ? "YOU_OWE" : "OWED_TO_YOU",
    });
  }

  return [...balances.values()]
    .filter((balance) => balance.netAmount !== 0)
    .map((balance) => ({
      user: balance.user,
      netAmount: balance.netAmount,
      shares: balance.shares,
    }));
},
async settleGroupBalance(
  currentUserId: string,
  otherUserId: string,
  groupId: string
) {
  const shares =
    await expenseSharesRepository.getPendingSharesBetweenUsers(
      groupId,
      currentUserId,
      otherUserId
    );

  if (shares.length === 0) {
    throw new ApiError(
      409,
      "No outstanding balances to settle."
    );
  }

  return prisma.$transaction(async (tx) => {
    let expensesSettled = 0;

    for (const share of shares) {
      await expenseSharesRepository.updateShare(
        tx,
        share.id,
        {
          status: ExpenseShareStatus.PAID,
        }
      );

      const newPaidCount = share.expense.paidCount + 1;

      const expenseData = {
        paidCount: {
          increment: 1,
        },
        status:
          newPaidCount ===
          share.expense.participantCount
            ? ExpenseStatus.SETTLED
            : ExpenseStatus.ACTIVE,
      };

      await expenseSharesRepository.updateExpense(
        tx,
        share.expenseId,
        expenseData
      );

      if (
        newPaidCount ===
        share.expense.participantCount
      ) {
        expensesSettled++;
      }
    }

    return {
      sharesSettled: shares.length,
      expensesSettled,
    };
  });
},
};