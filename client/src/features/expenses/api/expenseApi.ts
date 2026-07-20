import { api } from "@/lib/axios";

import type { CreateExpensePayload, Expense, ExpenseDetails, ExpenseShare } from "../types/expense";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const expenseApi = {
  async getGroupExpenses(groupId: string): Promise<Expense[]> {
    const response = await api.get<ApiResponse<Expense[]>>(`/groups/${groupId}/expenses`);

    return response.data.data;
  },

  async getExpenseDetails(expenseId: string): Promise<ExpenseDetails> {
    const response = await api.get<ApiResponse<ExpenseDetails>>(`/expenses/${expenseId}`);

    return response.data.data;
  },

  async createExpense(data: CreateExpensePayload): Promise<Expense> {
    const response = await api.post<ApiResponse<Expense>>("/expenses", data);

    return response.data.data;
  },

  async cancelExpense(expenseId: string): Promise<Expense> {
    const response = await api.patch<ApiResponse<Expense>>(`/expenses/${expenseId}/cancel`);

    return response.data.data;
  },

  async markSharePaid(shareId: string): Promise<ExpenseShare> {
    const response = await api.patch<ApiResponse<ExpenseShare>>(`/expense-shares/${shareId}/pay`);

    return response.data.data;
  },
  async settleGroupBalance(
    groupId: string,
    userId: string
  ): Promise<{
    sharesSettled: number;
    expensesSettled: number;
  }> {
    const response = await api.patch<
      ApiResponse<{
        sharesSettled: number;
        expensesSettled: number;
      }>
    >(`/expense-shares/groups/${groupId}/users/${userId}/settle`);

    return response.data.data;
  },
};
