import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { LoadingState } from "@/shared/components/states/LoadingState";
import { ErrorState } from "@/shared/components/states/ErrorState";

import { useBalances } from "../hooks/useBalances";
import type { MemberBalance } from "../types/balance";
import { BalanceSummary } from "../components/BalanceSummary";
import { BalanceList } from "../components/BalanceList";
import { BalanceDetailsDialog } from "../components/BalanceDetailsDialog";

export function BalancesPage() {
  const navigate = useNavigate();
  const { groupId } = useParams<{ groupId: string }>();

  const [selectedMember, setSelectedMember] = useState<MemberBalance | null>(null);

  const { data, isLoading, isError } = useBalances(groupId!);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return <ErrorState title="Failed to load balances" description="Please try again later." />;
  }

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6">
        <Button variant="ghost" className="gap-2" onClick={() => navigate(`/groups/${groupId}`)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <BalanceSummary summary={data.summary} />

        <BalanceList members={data.members} onMemberClick={setSelectedMember} />
      </div>

      <BalanceDetailsDialog
        member={selectedMember}
        groupId={groupId!}
        open={selectedMember !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMember(null);
          }
        }}
      />
    </>
  );
}
