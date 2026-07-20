import { CalendarDays, ReceiptIndianRupee, User } from "lucide-react";
import { useState } from "react";

import { useAuthStore } from "@/stores/authStore";

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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import { ErrorState } from "@/shared/components/states/ErrorState";
import { LoadingState } from "@/shared/components/states/LoadingState";

import { useCancelExpense } from "../hooks/useCancelExpense";
import { useExpense } from "../hooks/useExpense";
import { usePayShare } from "../hooks/usePayShare";
import { ExpenseParticipants } from "./ExpenseParticipants";
import { ExpenseStatusBadge } from "./ExpenseStatusBadge";

interface ExpenseDetailsDialogProps {
  expenseId: string | null;
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ExpenseDetailsDialog({
  expenseId,
  groupId,
  open,
  onOpenChange,
}: ExpenseDetailsDialogProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: expense, isPending, isError } = useExpense(expenseId ?? "", open);

  const cancelExpense = useCancelExpense(groupId);
  const payShare = usePayShare(groupId);

  const currentUser = useAuthStore((state) => state.user);

  if (!open) return null;

  const myShare = expense?.shares.find((share) => share.debtor.id === currentUser?.id);

  const canPay = expense?.status === "ACTIVE" && myShare?.status === "PENDING";

  const canCancel = expense?.status === "ACTIVE" && expense?.paidBy.id === currentUser?.id;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          {isPending && <LoadingState />}

          {isError && (
            <ErrorState title="Failed to load expense" description="Please try again later." />
          )}

          {expense && (
            <>
              <DialogHeader>
                <DialogTitle>{expense.title ?? "Untitled Expense"}</DialogTitle>
              </DialogHeader>

              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-2xl font-bold">
                    <ReceiptIndianRupee className="h-6 w-6" />
                    <span>{expense.amount}</span>
                  </div>

                  <ExpenseStatusBadge status={expense.status} />
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />

                    <span>
                      Paid by <strong>{expense.paidBy.name}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />

                    <span>{new Date(expense.expenseDate).toLocaleDateString()}</span>
                  </div>

                  <div>
                    <strong>Category:</strong> {expense.category}
                  </div>

                  <div>
                    <strong>Split:</strong> {expense.splitMethod}
                  </div>
                </div>

                <ExpenseParticipants shares={expense.shares} paidByUserId={expense.paidBy.id} />

                {canPay && myShare && (
                  <Button
                    className="w-full"
                    disabled={payShare.isPending}
                    onClick={() =>
                      payShare.mutate(myShare.id, {
                        onSuccess: () => {
                          onOpenChange(false);
                        },
                      })
                    }
                  >
                    {payShare.isPending
                      ? "Marking..."
                      : `Pay ₹${myShare.amount.toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </Button>
                )}

                {canCancel && (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setConfirmOpen(true)}
                  >
                    Cancel Expense
                  </Button>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Expense?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. The expense will be marked as cancelled and removed from
              active balances, while remaining in the history.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Keep Expense</AlertDialogCancel>

            <AlertDialogAction
              disabled={cancelExpense.isPending}
              onClick={() =>
                cancelExpense.mutate(expense!.id, {
                  onSuccess: () => {
                    setConfirmOpen(false);
                    onOpenChange(false);
                  },
                })
              }
            >
              {cancelExpense.isPending ? "Cancelling..." : "Yes, Cancel Expense"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
