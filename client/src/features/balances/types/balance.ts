export type BalanceDirection = "YOU_OWE" | "OWED_TO_YOU" | "SETTLED";

export interface BalanceUser {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface BalanceShare {
  shareId: string;
  expenseId: string;

  title: string;
  category: string;
  expenseDate: string;

  amount: number;

  direction: "YOU_OWE" | "OWED_TO_YOU";
}

export interface OutstandingBalance {
  user: BalanceUser;
  netAmount: number;
  shares: BalanceShare[];
}

export interface MemberBalance extends OutstandingBalance {
  direction: BalanceDirection;
}

export interface BalanceSummary {
  totalOwed: number;
  totalReceivable: number;
  netBalance: number;
}

export interface BalancePageData {
  summary: BalanceSummary;
  members: MemberBalance[];
}
