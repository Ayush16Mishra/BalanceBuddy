export interface RecentExpense {
  id: string;
  title: string;
  amount: number;
  category: string;
  expenseDate: string;

  paidCount: number;
  participantCount: number;

  group: {
    id: string;
    name: string;
  };

  paidBy: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface PendingBalanceShare {
  shareId: string;
  expenseId: string;
  title: string;
  category: string;
  expenseDate: string;
  amount: number;
  direction: "YOU_OWE" | "OWED_TO_YOU";
}

export interface PendingBalance {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };

  netAmount: number;

  shares: PendingBalanceShare[];
}

export interface DashboardData {
  totalOwed: number;
  totalReceivable: number;
  activeGroups: number;

  recentExpenses: RecentExpense[];

  pendingBalances: PendingBalance[];
}
