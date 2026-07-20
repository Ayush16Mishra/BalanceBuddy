import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { balanceApi } from "../api/balanceApi";
import type { BalancePageData, MemberBalance, OutstandingBalance } from "../types/balance";

import { getGroupDetails } from "@/features/group-details/api/groupDetailsApi";
import { useAuthStore } from "@/stores/authStore";

export function useBalances(groupId: string) {
  const currentUser = useAuthStore((state) => state.user);

  const groupQuery = useQuery({
    queryKey: ["group", groupId],
    queryFn: () => getGroupDetails(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });

  const balancesQuery = useQuery({
    queryKey: ["balances", groupId],
    queryFn: () => balanceApi.getOutstandingBalances(groupId),
    enabled: !!groupId,
    staleTime: 1000 * 60 * 5,
  });

  const data = useMemo<BalancePageData | undefined>(() => {
    if (!groupQuery.data || !balancesQuery.data) {
      return undefined;
    }

    const balanceMap = new Map<string, OutstandingBalance>();

    balancesQuery.data.forEach((balance) => {
      balanceMap.set(balance.user.id, balance);
    });

    let totalOwed = 0;
    let totalReceivable = 0;

    const members: MemberBalance[] = groupQuery.data.memberships
      .filter((membership) => membership.user.id !== currentUser?.id)
      .map((membership) => {
        const balance = balanceMap.get(membership.user.id);

        if (!balance) {
          return {
            user: membership.user,
            netAmount: 0,
            shares: [],
            direction: "SETTLED",
          };
        }

        if (balance.netAmount > 0) {
          totalReceivable += balance.netAmount;
        } else {
          totalOwed += Math.abs(balance.netAmount);
        }

        return {
          ...balance,
          direction: balance.netAmount > 0 ? "OWED_TO_YOU" : "YOU_OWE",
        };
      });

    return {
      summary: {
        totalOwed,
        totalReceivable,
        netBalance: totalReceivable - totalOwed,
      },
      members,
    };
  }, [groupQuery.data, balancesQuery.data, currentUser?.id]);

  return {
    data,

    isLoading: groupQuery.isLoading || balancesQuery.isLoading,

    isError: groupQuery.isError || balancesQuery.isError,

    refetch: async () => {
      await Promise.all([groupQuery.refetch(), balancesQuery.refetch()]);
    },
  };
}
