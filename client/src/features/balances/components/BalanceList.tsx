import type { MemberBalance } from "../types/balance";

import { MemberBalanceCard } from "./MemberBalanceCard";

interface BalanceListProps {
  members: MemberBalance[];
  onMemberClick: (member: MemberBalance) => void;
}

export function BalanceList({ members, onMemberClick }: BalanceListProps) {
  return (
    <div className="space-y-3">
      {members.map((member) => (
        <MemberBalanceCard key={member.user.id} member={member} onClick={onMemberClick} />
      ))}
    </div>
  );
}
