import { useParams } from "react-router-dom";

import { useGroupDetails } from "../hooks/useGroupDetails";

import { GroupHeader } from "../components/GroupHeader";
import { GroupSummary } from "../components/GroupSummary";
import { CreateExpenseFAB } from "../components/CreateExpenseFAB";

import { ExpenseList } from "@/features/expenses/components/ExpenseList";

import { LoadingState } from "@/shared/components/states/LoadingState";
import { ErrorState } from "@/shared/components/states/ErrorState";
import { EmptyState } from "@/shared/components/states/EmptyState";

export const GroupDetailsPage = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const { data: group, isPending, isError, error } = useGroupDetails(groupId ?? "");

  if (isPending) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState title="Failed to load group" description={error.message} />;
  }

  if (!group) {
    return (
      <EmptyState
        title="Group not found"
        description="The group you're looking for doesn't exist or you don't have access to it."
      />
    );
  }

  return (
    <div className="space-y-0">
      <GroupHeader group={group} />

      <GroupSummary groupId={group.id} />

      <ExpenseList groupId={group.id} />

      <CreateExpenseFAB group={group} />
    </div>
  );
};
