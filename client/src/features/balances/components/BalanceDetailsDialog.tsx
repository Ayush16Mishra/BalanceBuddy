import { useMemo, useState } from "react";
import { CalendarDays, ReceiptIndianRupee } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import { usePayShare } from "@/features/expenses/hooks/usePayShare";

import { useSettleGroupBalance } from "../hooks/useSettleGroupBalance";
import type { BalanceShare, MemberBalance } from "../types/balance";

interface BalanceDetailsDialogProps {
  member: MemberBalance | null;
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BalanceDetailsDialog({
  member,
  groupId,
  open,
  onOpenChange,
}: BalanceDetailsDialogProps) {
  const [selectedShare, setSelectedShare] = useState<BalanceShare | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const payShare = usePayShare(groupId);
  const settleBalance = useSettleGroupBalance(groupId);

  const shares = useMemo(() => {
    if (!member) return [];

    return [...member.shares].sort(
      (a, b) => new Date(b.expenseDate).getTime() - new Date(a.expenseDate).getTime()
    );
  }, [member]);

  if (!member) return null;

  const canSettle = member.direction === "YOU_OWE";

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setSelectedShare(null);
            setConfirmOpen(false);
          }

          onOpenChange(isOpen);
        }}
      >
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{member.user.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="rounded-lg border p-4">
              <p className="text-sm text-muted-foreground">
                {member.direction === "YOU_OWE"
                  ? `You owe ${member.user.name}`
                  : member.direction === "OWED_TO_YOU"
                    ? `${member.user.name} owes you`
                    : "Settled"}
              </p>

              <div
                className={`mt-2 flex items-center gap-2 text-3xl font-bold ${
                  member.direction === "YOU_OWE"
                    ? "text-red-500"
                    : member.direction === "OWED_TO_YOU"
                      ? "text-green-500"
                      : "text-muted-foreground"
                }`}
              >
                <ReceiptIndianRupee className="h-7 w-7" />
                <span>{Math.abs(member.netAmount).toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3">
              {shares.length === 0 ? (
                <p className="text-center text-sm text-muted-foreground">
                  No outstanding balances.
                </p>
              ) : (
                shares.map((share) => (
                  <div
                    key={share.shareId}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{share.title}</p>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{share.category}</span>

                        <span className="flex items-center gap-1">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(share.expenseDate).toLocaleDateString()}
                        </span>
                      </div>

                      <p className="font-semibold">₹{share.amount.toFixed(2)}</p>
                    </div>

                    {canSettle && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={payShare.isPending}
                        onClick={() => {
                          setSelectedShare(share);
                          setConfirmOpen(true);
                        }}
                      >
                        Pay
                      </Button>
                    )}
                  </div>
                ))
              )}
            </div>

            {canSettle && (
              <Button
                className="w-full"
                disabled={settleBalance.isPending}
                onClick={() =>
                  settleBalance.mutate(member.user.id, {
                    onSuccess: () => onOpenChange(false),
                  })
                }
              >
                {settleBalance.isPending ? "Settling..." : `Settle With ${member.user.name}`}
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Payment</AlertDialogTitle>

            <AlertDialogDescription>
              Have you already paid {member.user.name} outside BalanceBuddy?
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              disabled={payShare.isPending || !selectedShare}
              onClick={() => {
                if (!selectedShare) return;

                payShare.mutate(selectedShare.shareId, {
                  onSuccess: () => {
                    setConfirmOpen(false);
                    setSelectedShare(null);
                  },
                });
              }}
            >
              {payShare.isPending ? "Marking..." : "Yes, Mark as Paid"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
