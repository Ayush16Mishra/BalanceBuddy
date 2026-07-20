import { api } from "@/lib/axios";

import type { Group, CreateGroupRequest, JoinGroupRequest } from "../types/group";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const getGroups = async () => {
  const response = await api.get<ApiResponse<Group[]>>("/groups");
  return response.data.data;
};

export const createGroup = async (data: CreateGroupRequest) => {
  const response = await api.post<ApiResponse<Group>>("/groups", data);
  return response.data.data;
};

export const joinGroup = async (data: JoinGroupRequest) => {
  const response = await api.post<ApiResponse<Group>>("/groups/join", data);
  return response.data.data;
};
