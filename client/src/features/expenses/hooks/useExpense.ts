import { useQuery } from "@tanstack/react-query";

import { expenseApi } from "../api/expenseApi";

export function useExpense(expenseId: string, open = true) {
  return useQuery({
    queryKey: ["expense", expenseId],
    queryFn: () => expenseApi.getExpenseDetails(expenseId),
    enabled: open && !!expenseId,
    staleTime: 1000 * 60 * 5,
  });
}
