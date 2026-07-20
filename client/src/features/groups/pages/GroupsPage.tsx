import { useState } from "react";

import { Button } from "@/components/ui/button";

import { LoadingState } from "@/shared/components/states/LoadingState";
import { ErrorState } from "@/shared/components/states/ErrorState";
import { EmptyState } from "@/shared/components/states/EmptyState";

import { ActiveGroups } from "../components/ActiveGroups";
import { CreateGroupDialog } from "../components/CreateGroupDialog";
import { JoinGroupDialog } from "../components/JoinGroupDialog";
import { useGroups } from "../hooks/useGroups";

export const GroupsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isJoinDialogOpen, setIsJoinDialogOpen] = useState(false);

  const { data: groups = [], isPending, isError, refetch } = useGroups();

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={() => void refetch()} />;
  }

  return (
    <>
      <div className="space-y-6 px-2">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">Groups</h1>

            <p className="mt-1 text-muted-foreground">Manage your shared expense groups.</p>
          </div>

          <div className="mr-4 flex items-center gap-3">
            <Button
              className="h-11 px-6 text-base font-semibold"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              Create Group
            </Button>

            <Button
              variant="outline"
              className="h-11 border-white/60 bg-white/80 px-6 text-base font-semibold shadow-sm transition-colors hover:bg-white"
              onClick={() => setIsJoinDialogOpen(true)}
            >
              Join Group
            </Button>
          </div>
        </div>

        {groups.length === 0 ? (
          <EmptyState
            title="No groups yet"
            description="Create a group or join one using an invite."
          />
        ) : (
          <ActiveGroups groups={groups} />
        )}
      </div>

      <CreateGroupDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />

      <JoinGroupDialog open={isJoinDialogOpen} onOpenChange={setIsJoinDialogOpen} />
    </>
  );
};
