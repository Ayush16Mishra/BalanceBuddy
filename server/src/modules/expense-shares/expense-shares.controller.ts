import type { Request, Response } from "express";

import { expenseSharesService } from "./expense-shares.service.js";
import { markSharePaidSchema } from "./expense-shares.validation.js";

export const expenseSharesController = {
  async markSharePaid(req: Request, res: Response) {
    const { shareId } = markSharePaidSchema.parse(req.params);

    const share = await expenseSharesService.markSharePaid(
      req.user!.id,
      shareId
    );

    res.json({
      success: true,
      message: "Expense share marked as paid successfully.",
      data: share,
    });
  },

  async getOutstandingBalances(req: Request, res: Response) {
    const balances =
      await expenseSharesService.getOutstandingBalances(
        req.user!.id
      );

    res.json({
      success: true,
      message: "Outstanding balances fetched successfully.",
      data: balances,
    });
  },
};