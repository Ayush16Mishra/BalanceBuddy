import { ChevronRight } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

import type { MemberBalance } from "../types/balance";

interface MemberBalanceCardProps {
  member: MemberBalance;
  onClick: (member: MemberBalance) => void;
}

export function MemberBalanceCard({ member, onClick }: MemberBalanceCardProps) {
  const balanceText =
    member.direction === "YOU_OWE"
      ? `You owe ₹${Math.abs(member.netAmount).toFixed(2)}`
      : member.direction === "OWED_TO_YOU"
        ? `Owes you ₹${member.netAmount.toFixed(2)}`
        : "Settled";

  const balanceColor =
    member.direction === "YOU_OWE"
      ? "text-red-500"
      : member.direction === "OWED_TO_YOU"
        ? "text-green-500"
        : "text-muted-foreground";

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={() => onClick(member)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(member);
        }
      }}
      className="cursor-pointer transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={member.user.avatarUrl ?? undefined} />
            <AvatarFallback>{member.user.name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-medium">{member.user.name}</p>

            <p className={`text-sm ${balanceColor}`}>{balanceText}</p>
          </div>
        </div>

        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </div>
    </Card>
  );
}
