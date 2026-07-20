import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/authStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { Group } from "@/features/groups/types/group";

import { useCreateExpense } from "../hooks/useCreateExpense";

import { createExpenseSchema, type CreateExpenseFormData } from "../validators/createExpenseSchema";

import type { Category } from "../types/expense";

interface CreateExpenseDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  {
    value: "FOOD" as Category,
    label: "🍔 Food",
  },
  {
    value: "TRAVEL" as Category,
    label: "🚕 Travel",
  },
  {
    value: "ACCOMMODATION" as Category,
    label: "🏨 Accommodation",
  },
  {
    value: "ENTERTAINMENT" as Category,
    label: "🎬 Entertainment",
  },
  {
    value: "SHOPPING" as Category,
    label: "🛍️ Shopping",
  },
  {
    value: "UTILITIES" as Category,
    label: "💡 Utilities",
  },
  {
    value: "MISCELLANEOUS" as Category,
    label: "📦 Miscellaneous",
  },
];

export function CreateExpenseDialog({ group, open, onOpenChange }: CreateExpenseDialogProps) {
  const { mutateAsync, isPending } = useCreateExpense(group.id);
  const currentUser = useAuthStore((state) => state.user);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    setFocus,
    formState: { errors },
  } = useForm<CreateExpenseFormData>({
    resolver: zodResolver(createExpenseSchema),
    defaultValues: {
      title: "",
      amount: 0,
      category: "FOOD",
      paidByUserId: currentUser?.id ?? "",
      participants: group.memberships.map((member) => member.user.id),
      expenseDate: new Date(),
    },
  });
  useEffect(() => {
    if (open) {
      reset({
        title: "",
        amount: 0,
        category: "FOOD",
        paidByUserId: currentUser?.id ?? "",
        participants: group.memberships.map((member) => member.user.id),
        expenseDate: new Date(),
      });

      setTimeout(() => setFocus("title"), 100);
    }
  }, [open, reset, setFocus, currentUser, group.memberships]);
  const participants = useWatch({
    control,
    name: "participants",
  });

  const category = useWatch({
    control,
    name: "category",
  });

  async function onSubmit(data: CreateExpenseFormData) {
    try {
      await mutateAsync({
        groupId: group.id,
        splitMethod: "EQUAL",
        title: data.title || undefined,
        amount: data.amount,
        category: data.category,
        paidByUserId: data.paidByUserId,
        participants: data.participants,
        expenseDate: data.expenseDate?.toISOString(),
      });

      reset();

      onOpenChange(false);
    } catch (error) {
      console.error("Create expense failed:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Expense</DialogTitle>

          <DialogDescription>Add a new expense to this group.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>

            <Input
              id="title"
              placeholder="Dinner at BBQ Nation"
              autoComplete="off"
              {...register("title")}
            />

            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>

            <Input
              id="amount"
              type="number"
              step="0.01"
              {...register("amount", {
                valueAsNumber: true,
              })}
            />

            {errors.amount && <p className="text-sm text-destructive">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Category</Label>

            <Select
              value={category}
              onValueChange={(value) => setValue("category", value as Category)}
            >
              <SelectTrigger className="h-11">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Paid By</Label>

            <div className="flex h-11 items-center rounded-md border bg-muted/30 px-3 text-sm font-medium">
              {currentUser?.name ?? "You"}
            </div>

            {errors.paidByUserId && (
              <p className="text-sm text-destructive">{errors.paidByUserId.message}</p>
            )}
          </div>

          <div className="space-y-3">
            <Label>Participants</Label>

            <div className="space-y-2">
              {group.memberships.map((member) => {
                const checked = participants.includes(member.user.id);

                return (
                  <button
                    key={member.user.id}
                    type="button"
                    onClick={() => {
                      if (checked) {
                        setValue(
                          "participants",
                          participants.filter((id) => id !== member.user.id)
                        );
                      } else {
                        setValue("participants", [...participants, member.user.id]);
                      }
                    }}
                    className={`flex h-12 w-full items-center justify-between rounded-xl border px-4 transition-all ${
                      checked
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border bg-background hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  >
                    <span className="font-medium">{member.user.name}</span>

                    {checked && <span className="text-sm font-semibold">Selected</span>}
                  </button>
                );
              })}
            </div>

            {errors.participants && (
              <p className="text-sm text-destructive">{errors.participants.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
