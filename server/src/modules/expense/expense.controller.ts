import type { Request, Response } from "express";

import { expenseService } from "./expense.service.js";
import {
  cancelExpenseSchema,
  createExpenseSchema,
  getExpenseDetailsSchema,
  getGroupExpensesSchema,
} from "./expense.validation.js";

export const expenseController = {
  async createExpense(req: Request, res: Response) {
    const data = createExpenseSchema.parse(req.body);

    const expense = await expenseService.createExpense(req.user!.id, data);

    res.status(201).json({
      success: true,
      message: "Expense created successfully.",
      data: expense,
    });
  },

  async getGroupExpenses(req: Request, res: Response) {
    const { groupId } = getGroupExpensesSchema.parse(req.params);

    const expenses = await expenseService.getGroupExpenses(req.user!.id, groupId);

    res.json({
      success: true,
      message: "Group expenses fetched successfully.",
      data: expenses,
    });
  },

  async getExpenseDetails(req: Request, res: Response) {
    const { expenseId } = getExpenseDetailsSchema.parse(req.params);

    const expense = await expenseService.getExpenseDetails(req.user!.id, expenseId);

    res.json({
      success: true,
      message: "Expense details fetched successfully.",
      data: expense,
    });
  },

  async cancelExpense(req: Request, res: Response) {
    const { expenseId } = cancelExpenseSchema.parse(req.params);

    const expense = await expenseService.cancelExpense(req.user!.id, expenseId);

    res.json({
      success: true,
      message: "Expense cancelled successfully.",
      data: expense,
    });
  },
};
