import { AxiosError } from "axios";

import type { ApiErrorResponse } from "@/types/error";

export function getErrorMessage(error: unknown, fallback = "Something went wrong."): string {
  if (error instanceof AxiosError) {
    return (error as AxiosError<ApiErrorResponse>).response?.data?.message ?? fallback;
  }

  return fallback;
}
