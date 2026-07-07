import { z } from "zod";

export const markSharePaidSchema = z.object({
  shareId: z.string().cuid("Invalid expense share ID."),
});

export type MarkSharePaidInput = z.infer<typeof markSharePaidSchema>;

export const getExpenseSharesSchema = z.object({
  expenseId: z.string().cuid("Invalid expense ID."),
});

export type GetExpenseSharesInput = z.infer<
  typeof getExpenseSharesSchema
>;