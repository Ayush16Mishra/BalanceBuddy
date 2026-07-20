import { api } from "@/lib/axios";

interface InviteResponse {
  token: string;
  expiresAt: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const generateInviteLink = async (groupId: string) => {
  const response = await api.post<ApiResponse<InviteResponse>>(`/groups/${groupId}/invite`);

  return response.data.data;
};
