import { useNavigate } from "react-router-dom";

import { useBalanceSummary } from "@/features/balances/hooks/useBalanceSummary";

import { Button } from "@/components/ui/button";

interface GroupSummaryProps {
  groupId: string;
}

export const GroupSummary = ({ groupId }: GroupSummaryProps) => {
  const navigate = useNavigate();

  const { summary } = useBalanceSummary(groupId);

  return (
    <div className="rounded-b-2xl border border-t bg-card px-6 pb-6 pt-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-lg font-semibold">Balances</h2>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-xl bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">You Owe</p>

          <p className="mt-1 text-2xl font-bold">₹{summary.totalOwed.toFixed(2)}</p>
        </div>

        <div className="rounded-xl bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">You Are Owed</p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            ₹{summary.totalReceivable.toFixed(2)}
          </p>
        </div>
      </div>

      <Button
        className="mt-5 w-full"
        variant="outline"
        onClick={() => navigate(`/groups/${groupId}/balances`)}
      >
        View Balances
      </Button>
    </div>
  );
};
