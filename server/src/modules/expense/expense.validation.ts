import { Category, SplitMethod } from "@prisma/client";
import { z } from "zod";

const baseExpenseSchema = z.object({
  groupId: z.string().cuid("Invalid group ID."),

  title: z.string().trim().max(100, "Title must not exceed 100 characters.").optional(),

  amount: z
    .number()
    .finite("Amount must be a valid number.")
    .positive("Amount must be greater than 0."),

  category: z.nativeEnum(Category),

  paidByUserId: z.string().cuid("Invalid payer ID."),

  expenseDate: z.coerce.date().optional(),
});

const equalSplitSchema = baseExpenseSchema.extend({
  splitMethod: z.literal(SplitMethod.EQUAL),

  participants: z
    .array(z.string().cuid("Invalid participant ID."))
    .min(1, "At least one participant is required.")
    .refine((participants) => new Set(participants).size === participants.length, {
      message: "Participants must be unique.",
    }),
});

const exactSplitSchema = baseExpenseSchema.extend({
  splitMethod: z.literal(SplitMethod.EXACT),

  participants: z
    .array(
      z.object({
        userId: z.string().cuid("Invalid participant ID."),
        amount: z
          .number()
          .finite("Amount must be a valid number.")
          .positive("Amount must be greater than 0."),
      })
    )
    .min(1, "At least one participant is required.")
    .refine(
      (participants) =>
        new Set(participants.map((participant) => participant.userId)).size === participants.length,
      {
        message: "Participants must be unique.",
      }
    ),
});

export const createExpenseSchema = z.discriminatedUnion("splitMethod", [
  equalSplitSchema,
  exactSplitSchema,
]);

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;

export const getGroupExpensesSchema = z.object({
  groupId: z.string().cuid("Invalid group ID."),
});

export type GetGroupExpensesInput = z.infer<typeof getGroupExpensesSchema>;

export const getExpenseDetailsSchema = z.object({
  expenseId: z.string().cuid("Invalid expense ID."),
});

export type GetExpenseDetailsInput = z.infer<typeof getExpenseDetailsSchema>;

export const cancelExpenseSchema = z.object({
  expenseId: z.string().cuid("Invalid expense ID."),
});

export type CancelExpenseInput = z.infer<typeof cancelExpenseSchema>;
