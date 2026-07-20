import { api } from "@/lib/axios";

import type { Group } from "@/features/groups/types/group";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getGroupDetails = async (groupId: string) => {
  const response = await api.get<ApiResponse<Group>>(`/groups/${groupId}`);
  return response.data.data;
};
