import { prisma } from "../../database/prisma.js";
import { ApiError } from "../../utils/api-error.js";
import { expenseRepository } from "./expense.repository.js";
import { CreateExpenseInput } from "./expense.validation.js";
import { ExpenseShareStatus, ExpenseStatus, Prisma, SplitMethod } from "@prisma/client";
import { serializeDecimal } from "../../utils/serialize.js";
import { emitExpenseCreated, emitExpenseCancelled } from "../../socket/emitters.js";
import { notificationService } from "../notifications/notifications.service.js";
import { redis } from "../../utils/redis.js";

function buildEqualShares(participants: string[], totalAmount: Prisma.Decimal) {
  const participantCount = participants.length;

  const totalPaise = totalAmount.mul(100).toNumber();
  const baseShare = Math.floor(totalPaise / participantCount);
  const remainder = totalPaise % participantCount;

  return participants.map((participantId, index) => {
    const shareInPaise = baseShare + (index < remainder ? 1 : 0);

    return {
      debtorId: participantId,
      amount: new Prisma.Decimal(shareInPaise).div(100),
    };
  });
}

function buildExactShares(
  participants: {
    userId: string;
    amount: number;
  }[],
  totalAmount: Prisma.Decimal
) {
  const suppliedTotal = participants.reduce((sum, participant) => sum + participant.amount, 0);

  if (!new Prisma.Decimal(suppliedTotal).equals(totalAmount)) {
    throw new ApiError(400, "The participant amounts must equal the total expense.");
  }

  return participants.map((participant) => ({
    debtorId: participant.userId,
    amount: new Prisma.Decimal(participant.amount),
  }));
}

export const expenseService = {
  async createExpense(userId: string, data: CreateExpenseInput) {
    // Get group
    const group = await expenseRepository.getGroupById(data.groupId);

    if (!group) {
      throw new ApiError(404, "Group not found.");
    }

    // Check if the authenticated user belongs to the group
    const memberIds = new Set(group.memberships.map((member) => member.userId));
    const payer = group.memberships.find((member) => member.userId === data.paidByUserId);

    if (!payer) {
      throw new ApiError(400, "Payer must be a member of this group.");
    }
    if (!memberIds.has(userId)) {
      throw new ApiError(403, "You are not a member of this group.");
    }

    const participantIds =
      data.splitMethod === SplitMethod.EQUAL
        ? data.participants
        : data.participants.map((participant) => participant.userId);

    // Check if every participant belongs to the group
    const allParticipantsAreMembers = participantIds.every((participantId) =>
      memberIds.has(participantId)
    );

    if (!allParticipantsAreMembers) {
      throw new ApiError(400, "All participants must be members of the group.");
    }

    const totalAmount = new Prisma.Decimal(data.amount);

    let shares: {
      debtorId: string;
      amount: Prisma.Decimal;
    }[];

    let participantCount: number;
    let paidCount: number;

    if (data.splitMethod === SplitMethod.EQUAL) {
      participantCount = data.participants.length;

      const payerIsParticipant = data.participants.includes(data.paidByUserId);

      paidCount = payerIsParticipant ? 1 : 0;

      shares = buildEqualShares(data.participants, totalAmount);
    } else {
      participantCount = data.participants.length;

      const payerIsParticipant = data.participants.some(
        (participant) => participant.userId === data.paidByUserId
      );

      paidCount = payerIsParticipant ? 1 : 0;

      shares = buildExactShares(data.participants, totalAmount);
    }

    const expense = await prisma.$transaction(async (tx) => {
      const createdExpense = await expenseRepository.createExpense(tx, {
        title: data.title,
        amount: totalAmount,
        category: data.category,
        splitMethod: data.splitMethod,
        participantCount,
        paidCount,
        expenseDate: data.expenseDate ?? new Date(),
        groupId: data.groupId,
        createdByUserId: userId,
        paidByUserId: data.paidByUserId,
      });

      await expenseRepository.createExpenseShares(
        tx,
        shares.map((share) => ({
          expenseId: createdExpense.id,
          creditorId: data.paidByUserId,
          debtorId: share.debtorId,
          amount: share.amount,
          status:
            share.debtorId === data.paidByUserId
              ? ExpenseShareStatus.PAID
              : ExpenseShareStatus.PENDING,
          paidAt: share.debtorId === data.paidByUserId ? new Date() : null,
        }))
      );

      if (group._count.expenses === 0) {
        await expenseRepository.updateGroup(tx, data.groupId, {
          isLocked: true,
          lastActivityAt: new Date(),
        });
      } else {
        await expenseRepository.updateGroup(tx, data.groupId, {
          lastActivityAt: new Date(),
        });
      }

      return serializeDecimal(createdExpense);
    });
    await Promise.all(group.memberships.map((member) => redis.del(`dashboard:${member.userId}`)));
    // Emit only after the transaction has successfully committed
    emitExpenseCreated(data.groupId, expense);
    const notifiedUserIds = new Set(
      shares.map((share) => share.debtorId).filter((debtorId) => debtorId !== data.paidByUserId)
    );

    for (const notifiedUserId of notifiedUserIds) {
      notificationService.notify(notifiedUserId, {
        type: "expense",
        title: "New Expense",
        message: `${payer.user.name} added a new expense: "${expense.title ?? "Untitled Expense"}".`,
      });
    }

    return expense;
  },

  async cancelExpense(userId: string, expenseId: string) {
    const expense = await expenseRepository.getExpenseById(expenseId);

    if (!expense) {
      throw new ApiError(404, "Expense not found.");
    }

    const memberIds = new Set(expense.group.memberships.map((member) => member.userId));

    if (!memberIds.has(userId)) {
      throw new ApiError(403, "You are not a member of this group.");
    }

    if (expense.status === ExpenseStatus.CANCELLED) {
      throw new ApiError(409, "Expense is already cancelled.");
    }

    const updatedExpense = await prisma.$transaction(async (tx) => {
      const expense = await expenseRepository.updateExpense(tx, expenseId, {
        status: ExpenseStatus.CANCELLED,
      });

      return serializeDecimal(expense);
    });
    await Promise.all(
      expense.group.memberships.map((member) => redis.del(`dashboard:${member.userId}`))
    );
    // Emit only after the transaction has successfully committed
    emitExpenseCancelled(expense.groupId, updatedExpense);

    return updatedExpense;
  },

  async getGroupExpenses(userId: string, groupId: string) {
    const group = await expenseRepository.getGroupById(groupId);

    if (!group) {
      throw new ApiError(404, "Group not found.");
    }

    const memberIds = new Set(group.memberships.map((member) => member.userId));

    if (!memberIds.has(userId)) {
      throw new ApiError(403, "You are not a member of this group.");
    }

    return expenseRepository.getGroupExpenses(groupId);
  },

  async getExpenseDetails(userId: string, expenseId: string) {
    const expense = await expenseRepository.getExpenseDetails(expenseId);

    if (!expense) {
      throw new ApiError(404, "Expense not found.");
    }

    const memberIds = new Set(expense.group.memberships.map((member) => member.userId));

    if (!memberIds.has(userId)) {
      throw new ApiError(403, "You are not a member of this group.");
    }

    return serializeDecimal(expense);
  },
};
