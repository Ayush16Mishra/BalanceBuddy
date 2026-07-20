import { useMemo, useState } from "react";

import { EmptyState } from "@/shared/components/states/EmptyState";
import { ErrorState } from "@/shared/components/states/ErrorState";
import { LoadingState } from "@/shared/components/states/LoadingState";

import { useAuthStore } from "@/stores/authStore";

import { useGroupExpenses } from "../hooks/useGroupExpenses";
import { ExpenseCard } from "./ExpenseCard";
import { ExpenseDetailsDialog } from "./ExpenseDetailsDialog";

interface ExpenseListProps {
  groupId: string;
}

export function ExpenseList({ groupId }: ExpenseListProps) {
  const { data: expenses, isPending, isError } = useGroupExpenses(groupId);

  const currentUser = useAuthStore((state) => state.user);

  const [selectedExpenseId, setSelectedExpenseId] = useState<string | null>(null);

  const sortedExpenses = useMemo(() => {
    if (!expenses) return [];

    return [...expenses].sort(
      (a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()
    );
  }, [expenses]);

  if (isPending) {
    return <LoadingState />;
  }

  if (!currentUser) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState title="Failed to load expenses" description="Please try again later." />;
  }

  if (sortedExpenses.length === 0) {
    return (
      <EmptyState title="No expenses yet" description="Create your first expense to get started." />
    );
  }

  return (
    <>
      <div className="mt-8 space-y-4">
        {sortedExpenses.map((expense) => (
          <ExpenseCard
            key={expense.id}
            expense={expense}
            currentUserId={currentUser.id}
            onClick={setSelectedExpenseId}
          />
        ))}
      </div>

      <ExpenseDetailsDialog
        expenseId={selectedExpenseId}
        groupId={groupId}
        open={!!selectedExpenseId}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedExpenseId(null);
          }
        }}
      />
    </>
  );
}
