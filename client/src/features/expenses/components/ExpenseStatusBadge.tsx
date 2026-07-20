import { Badge } from "@/components/ui/badge";

import type { ExpenseStatus } from "../types/expense";

interface ExpenseStatusBadgeProps {
  status: ExpenseStatus;
}

export function ExpenseStatusBadge({ status }: ExpenseStatusBadgeProps) {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="secondary">Active</Badge>;

    case "SETTLED":
      return <Badge className="bg-green-600 hover:bg-green-600">Settled</Badge>;

    case "CANCELLED":
      return <Badge variant="destructive">Cancelled</Badge>;

    default:
      return null;
  }
}
