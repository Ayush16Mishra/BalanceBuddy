import type { Request, Response } from "express";

import { dashboardService } from "./dashboard.service.js";

export const dashboardController = {
  async getDashboard(req: Request, res: Response) {
    const dashboard = await dashboardService.getDashboard(req.user!.id);

    res.json({
      success: true,
      message: "Dashboard fetched successfully.",
      data: dashboard,
    });
  },
};
