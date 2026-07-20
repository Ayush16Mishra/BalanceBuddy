import { CheckCircle2, Circle } from "lucide-react";

import type { ExpenseShare } from "../types/expense";

interface ExpenseParticipantsProps {
  shares: ExpenseShare[];
  paidByUserId: string;
}

export function ExpenseParticipants({ shares, paidByUserId }: ExpenseParticipantsProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-sm font-medium">Participants</h4>

      {shares.map((share) => (
        <div key={share.id} className="flex items-center justify-between rounded-md border p-2">
          <div className="flex items-center gap-2">
            {share.status === "PAID" ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-muted-foreground" />
            )}

            <div>
              <p className="text-sm font-medium">
                {share.debtor.name}

                {share.debtor.id === paidByUserId && (
                  <span className="ml-2 text-xs font-normal text-muted-foreground">(Paid By)</span>
                )}
              </p>

              <p className="text-xs text-muted-foreground">
                {share.status === "PAID" ? "Paid" : "Pending"}
              </p>
            </div>
          </div>

          <span className="font-medium">₹{share.amount.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}
