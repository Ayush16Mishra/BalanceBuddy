import type { Request, Response } from "express";

import { expenseSharesService } from "./expense-shares.service.js";
import { markSharePaidSchema } from "./expense-shares.validation.js";

export const expenseSharesController = {
  async markSharePaid(req: Request, res: Response) {
    const { shareId } = markSharePaidSchema.parse(req.params);

    const share = await expenseSharesService.markSharePaid(req.user!.id, shareId);

    res.json({
      success: true,
      message: "Expense share marked as paid successfully.",
      data: share,
    });
  },

  async getOutstandingBalances(req: Request, res: Response) {
    const groupId = typeof req.query.groupId === "string" ? req.query.groupId : undefined;

    const balances = await expenseSharesService.getOutstandingBalances(req.user!.id, groupId);

    res.json({
      success: true,
      message: "Outstanding balances fetched successfully.",
      data: balances,
    });
  },

  async settleGroupBalance(req: Request, res: Response) {
    const { groupId, userId } = req.params as {
      groupId: string;
      userId: string;
    };

    const result = await expenseSharesService.settleGroupBalance(req.user!.id, userId, groupId);

    res.json({
      success: true,
      message: "Balance settled successfully.",
      data: result,
    });
  },
};
