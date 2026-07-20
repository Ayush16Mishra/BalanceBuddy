import { z } from "zod";

export const markSharePaidSchema = z.object({
  shareId: z.string().cuid("Invalid expense share ID."),
});

export type MarkSharePaidInput = z.infer<typeof markSharePaidSchema>;

export const getExpenseSharesSchema = z.object({
  expenseId: z.string().cuid("Invalid expense ID."),
});

export type GetExpenseSharesInput = z.infer<typeof getExpenseSharesSchema>;

export const settleGroupBalanceSchema = z.object({
  groupId: z.string().cuid("Invalid group ID."),
  userId: z.string().cuid("Invalid user ID."),
});

export type SettleGroupBalanceInput = z.infer<typeof settleGroupBalanceSchema>;
