import { useState } from "react";
import { Copy, Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { useGenerateInvite } from "../hooks/useGenerateInvite";
import type { Invite } from "../types/invite";

interface InviteMembersDialogProps {
  groupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InviteMembersDialog = ({ groupId, open, onOpenChange }: InviteMembersDialogProps) => {
  const [invite, setInvite] = useState<Invite | null>(null);

  const { mutateAsync, isPending } = useGenerateInvite();

  const handleGenerate = async () => {
    try {
      const data = await mutateAsync(groupId);

      setInvite(data);
    } catch {
      toast.error("Failed to generate invite token.");
    }
  };

  const handleCopy = async () => {
    if (!invite) return;

    await navigator.clipboard.writeText(invite.token);

    toast.success("Invite token copied.");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Members</DialogTitle>

          <DialogDescription>
            Generate an invite token that others can use to join this group.
          </DialogDescription>
        </DialogHeader>

        {!invite ? (
          <div className="py-6">
            <Button className="w-full" onClick={handleGenerate} disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Token"
              )}
            </Button>
          </div>
        ) : (
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />

                <span className="font-medium">Invite Token</span>
              </div>

              <p className="rounded-md bg-muted p-3 font-mono break-all">{invite.token}</p>

              <p className="text-sm text-muted-foreground">
                Expires: {new Date(invite.expiresAt).toLocaleString()}
              </p>

              <Button className="w-full" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Token
              </Button>
            </CardContent>
          </Card>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
