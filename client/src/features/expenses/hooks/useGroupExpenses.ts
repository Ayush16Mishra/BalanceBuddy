import { useQuery } from "@tanstack/react-query";

import { expenseApi } from "../api/expenseApi";

export function useGroupExpenses(groupId: string) {
  return useQuery({
    queryKey: ["group-expenses", groupId],
    queryFn: () => expenseApi.getGroupExpenses(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });
}
