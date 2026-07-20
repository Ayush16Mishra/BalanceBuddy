import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api";

import type {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  CurrentUserResponse,
} from "../types/auth";

export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const response = await api.post<ApiResponse<LoginResponse>>("/auth/login", data);

  return response.data;
}

export async function register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  const response = await api.post<ApiResponse<RegisterResponse>>("/auth/register", data);

  return response.data;
}

export async function getCurrentUser(): Promise<ApiResponse<CurrentUserResponse>> {
  const response = await api.get<ApiResponse<CurrentUserResponse>>("/users/me");

  return response.data;
}

export async function verifyEmail(token: string) {
  const response = await api.get("/auth/verify-email", {
    params: { token },
  });

  return response.data;
}

export async function resendVerification(email: string) {
  const response = await api.post("/auth/resend-verification", {
    email,
  });

  return response.data;
}

export async function forgotPassword(email: string) {
  const response = await api.post("/auth/forgot-password", {
    email,
  });

  return response.data;
}

export async function resetPassword(token: string, password: string) {
  const response = await api.post("/auth/reset-password", {
    token,
    password,
  });

  return response.data;
}

export async function logout() {
  return api.post("/auth/logout");
}
