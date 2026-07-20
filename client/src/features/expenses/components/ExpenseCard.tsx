import { Card, CardContent } from "@/components/ui/card";

import type { Expense } from "../types/expense";

interface ExpenseCardProps {
  expense: Expense;
  currentUserId: string;
  onClick?: (expenseId: string) => void;
}

export function ExpenseCard({ expense, currentUserId, onClick }: ExpenseCardProps) {
  const isMine = expense.paidBy.id === currentUserId;

  const myShare = expense.shares.find((share) => share.debtor.id === currentUserId);

  const displayAmount = isMine ? expense.amount : (myShare?.amount ?? 0);

  return (
    <>
      <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
        <Card
          className="w-full cursor-pointer transition-colors hover:bg-accent md:max-w-[55%]"
          onClick={() => onClick?.(expense.id)}
        >
          <CardContent className="px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold">{expense.title ?? "Untitled Expense"}</h3>

                  <p className="text-sm text-muted-foreground">
                    {isMine ? "You paid" : `Paid by ${expense.paidBy.name}`}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="text-lg font-bold">
                  ₹
                  {displayAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>

                <p className="text-xs text-muted-foreground">
                  {expense.paidCount}/{expense.participantCount} Settled
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
