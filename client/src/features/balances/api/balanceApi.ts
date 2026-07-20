import { api } from "@/lib/axios";

import type { OutstandingBalance } from "../types/balance";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const balanceApi = {
  async getOutstandingBalances(groupId: string) {
    const response = await api.get<ApiResponse<OutstandingBalance[]>>("/expense-shares/balances", {
      params: {
        groupId,
      },
    });

    return response.data.data;
  },
};
