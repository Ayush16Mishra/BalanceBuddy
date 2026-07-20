import { redis } from "../../utils/redis.js";

import { expenseSharesRepository } from "../expense-shares/expense-shares.repository.js";
import { expenseSharesService } from "../expense-shares/expense-shares.service.js";
import { dashboardRepository } from "./dashboard.repository.js";

export const dashboardService = {
  async getDashboard(userId: string) {
    const cacheKey = `dashboard:${userId}`;

    try {
      const cachedDashboard = await redis.get(cacheKey);

      if (cachedDashboard) {
        return JSON.parse(cachedDashboard);
      }
    } catch (error) {
      console.error("Redis cache read failed:", error);
    }

    const [activeGroups, recentExpenses, pendingShares, pendingBalances] = await Promise.all([
      dashboardRepository.getActiveGroupCount(userId),
      dashboardRepository.getRecentExpenses(userId),
      expenseSharesRepository.getPendingShares(userId),
      expenseSharesService.getOutstandingBalances(userId),
    ]);

    let totalOwed = 0;
    let totalReceivable = 0;

    for (const share of pendingShares) {
      const amount = Number(share.amount);

      if (share.debtorId === userId) {
        totalOwed += amount;
      } else {
        totalReceivable += amount;
      }
    }

    const dashboard = {
      totalOwed,
      totalReceivable,
      activeGroups,
      recentExpenses,
      pendingBalances,
    };

    try {
      await redis.set(cacheKey, JSON.stringify(dashboard), {
        EX: 300,
      });
    } catch (error) {
      console.error("Redis cache write failed:", error);
    }

    return dashboard;
  },
};
