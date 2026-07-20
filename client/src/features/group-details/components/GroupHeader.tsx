import { useState } from "react";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";

import type { Group } from "@/features/groups/types/group";

import { InviteMembersDialog } from "./InviteMembersDialog";

interface GroupHeaderProps {
  group: Group;
}

export const GroupHeader = ({ group }: GroupHeaderProps) => {
  const navigate = useNavigate();

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <>
      <div className="rounded-t-2xl border border-b-0 bg-card p-6 shadow-sm">
        <Button variant="ghost" className="-ml-2 mb-4 h-9 px-2" onClick={() => navigate("/groups")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Groups
        </Button>

        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold tracking-tight">{group.name}</h1>

            {group.description && <p className="mt-1 text-muted-foreground">{group.description}</p>}

            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>{group._count.memberships} Members</span>
            </div>
          </div>

          {!group.isLocked && (
            <Button
              size="lg"
              className="h-11 px-6 font-semibold"
              onClick={() => setInviteDialogOpen(true)}
            >
              Invite Members
            </Button>
          )}
        </div>
      </div>

      <InviteMembersDialog
        groupId={group.id}
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
      />
    </>
  );
};
