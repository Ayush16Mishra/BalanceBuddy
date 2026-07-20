import { api } from "@/lib/axios";

import type { ApiResponse } from "@/types/api";
import type { DashboardData } from "../types/dashboard";

export async function getDashboard(): Promise<DashboardData> {
  const response = await api.get<ApiResponse<DashboardData>>("/dashboard");

  return response.data.data;
}
