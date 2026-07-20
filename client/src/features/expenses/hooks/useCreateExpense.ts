import { useMutation, useQueryClient } from "@tanstack/react-query";

import { expenseApi } from "../api/expenseApi";
import type { CreateExpensePayload } from "../types/expense";

export function useCreateExpense(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateExpensePayload) => expenseApi.createExpense(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["group-expenses", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-details", groupId],
      });
    },
  });
}
