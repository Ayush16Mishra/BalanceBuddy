import { useQuery } from "@tanstack/react-query";

import { balanceApi } from "../api/balanceApi";

export function useBalanceSummary(groupId: string) {
  const query = useQuery({
    queryKey: ["balances", groupId],
    queryFn: () => balanceApi.getOutstandingBalances(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });

  let totalOwed = 0;
  let totalReceivable = 0;

  query.data?.forEach((balance) => {
    if (balance.netAmount > 0) {
      totalReceivable += balance.netAmount;
    } else {
      totalOwed += Math.abs(balance.netAmount);
    }
  });

  return {
    ...query,

    summary: {
      totalOwed,
      totalReceivable,
      netBalance: totalReceivable - totalOwed,
    },
  };
}
