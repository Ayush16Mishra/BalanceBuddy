import { z } from "zod";

import type { Category } from "../types/expense";

const categories = [
  "FOOD",
  "TRAVEL",
  "ACCOMMODATION",
  "ENTERTAINMENT",
  "SHOPPING",
  "UTILITIES",
  "MISCELLANEOUS",
] as const satisfies readonly Category[];

export const createExpenseSchema = z.object({
  title: z
    .string()
    .trim()
    .max(100, "Title must not exceed 100 characters.")
    .optional()
    .or(z.literal("")),

  amount: z.number().positive("Amount must be greater than 0."),
  category: z.enum(categories),

  paidByUserId: z.string().min(1, "Select who paid."),

  participants: z.array(z.string()).min(1, "Select at least one participant."),

  expenseDate: z.date().optional(),
});

export type CreateExpenseFormData = z.infer<typeof createExpenseSchema>;
