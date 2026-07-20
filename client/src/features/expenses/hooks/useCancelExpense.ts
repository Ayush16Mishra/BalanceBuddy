import { useMutation, useQueryClient } from "@tanstack/react-query";

import { expenseApi } from "../api/expenseApi";

export function useCancelExpense(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (expenseId: string) => expenseApi.cancelExpense(expenseId),

    onSuccess: (_, expenseId) => {
      queryClient.invalidateQueries({
        queryKey: ["group-expenses", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["expense", expenseId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },
  });
}
