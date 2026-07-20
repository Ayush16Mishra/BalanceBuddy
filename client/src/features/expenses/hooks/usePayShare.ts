import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { expenseApi } from "../api/expenseApi";

export function usePayShare(groupId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (shareId: string) => expenseApi.markSharePaid(shareId),

    onSuccess: () => {
      toast.success("Share marked as paid.");

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
      toast.error("Failed to mark share as paid.");
    },
  });
}
