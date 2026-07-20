import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { expenseApi } from "@/features/expenses/api/expenseApi";

export function useSettleGroupBalance(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => expenseApi.settleGroupBalance(groupId, userId),

    onSuccess: () => {
      toast.success("Balance settled successfully.");

      queryClient.invalidateQueries({
        queryKey: ["balances", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group-expenses", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    },

    onError: () => {
      toast.error("Failed to settle balance.");
    },
  });
}
