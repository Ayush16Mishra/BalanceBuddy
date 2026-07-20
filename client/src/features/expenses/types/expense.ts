export type ExpenseStatus = "ACTIVE" | "SETTLED" | "CANCELLED";

export type ExpenseShareStatus = "PENDING" | "PAID";

export type SplitMethod = "EQUAL" | "EXACT" | "PERCENTAGE" | "SHARES";

export type Category =
  | "FOOD"
  | "TRAVEL"
  | "ACCOMMODATION"
  | "ENTERTAINMENT"
  | "SHOPPING"
  | "UTILITIES"
  | "MISCELLANEOUS";

export interface ExpenseUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ExpenseShare {
  id: string;
  amount: number;
  status: ExpenseShareStatus;
  paidAt: string | null;

  debtor: ExpenseUser;
}

export interface ExpenseShareDetails extends ExpenseShare {
  creditor: ExpenseUser;
}

export interface Expense {
  id: string;
  title: string | null;
  amount: number;

  category: Category;
  splitMethod: SplitMethod;
  status: ExpenseStatus;

  expenseDate: string;
  createdAt: string;

  participantCount: number;
  paidCount: number;

  createdBy: ExpenseUser;
  paidBy: ExpenseUser;

  shares: ExpenseShare[];
}

export interface ExpenseDetails extends Expense {
  shares: ExpenseShareDetails[];
}

interface BaseCreateExpensePayload {
  groupId: string;
  title?: string;
  amount: number;
  category: Category;
  paidByUserId: string;
  expenseDate?: string;
}

export interface CreateEqualExpensePayload extends BaseCreateExpensePayload {
  splitMethod: "EQUAL";
  participants: string[];
}

export interface CreateExactExpensePayload extends BaseCreateExpensePayload {
  splitMethod: "EXACT";
  participants: {
    userId: string;
    amount: number;
  }[];
}

export type CreateExpensePayload = CreateEqualExpensePayload | CreateExactExpensePayload;
