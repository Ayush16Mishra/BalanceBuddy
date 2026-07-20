import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

import { useJoinGroup } from "../hooks/useJoinGroup";
import { joinGroupSchema, type JoinGroupFormData } from "../validators/joinGroupSchema";

interface JoinGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JoinGroupDialog({ open, onOpenChange }: JoinGroupDialogProps) {
  const { mutateAsync, isPending } = useJoinGroup();

  const {
    register,
    reset,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm<JoinGroupFormData>({
    resolver: zodResolver(joinGroupSchema),
    defaultValues: {
      token: "",
    },
  });

  useEffect(() => {
    if (open) {
      setTimeout(() => setFocus("token"), 100);
    } else {
      reset();
    }
  }, [open, reset, setFocus]);

  async function onSubmit(data: JoinGroupFormData) {
    try {
      await mutateAsync(data);

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Join group failed:", error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Join Group</DialogTitle>

          <DialogDescription>Enter an invite token to join an existing group.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="token">Invite Token</Label>

            <Input
              id="token"
              placeholder="Paste invite token"
              autoComplete="off"
              {...register("token")}
            />

            {errors.token && <p className="text-sm text-destructive">{errors.token.message}</p>}
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
              {isPending ? "Joining..." : "Join Group"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
