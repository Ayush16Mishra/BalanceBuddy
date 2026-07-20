import { ArrowDownRight, ArrowUpRight, Scale } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import type { BalanceSummary as BalanceSummaryType } from "../types/balance";

interface BalanceSummaryProps {
  summary: BalanceSummaryType;
}

export function BalanceSummary({ summary }: BalanceSummaryProps) {
  return (
    <Card>
      <CardContent className="grid gap-6 p-6 md:grid-cols-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowUpRight className="h-4 w-4 text-red-500" />
            <span>You Owe</span>
          </div>

          <p className="text-2xl font-bold text-red-500">₹{summary.totalOwed.toFixed(2)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ArrowDownRight className="h-4 w-4 text-green-500" />
            <span>You Are Owed</span>
          </div>

          <p className="text-2xl font-bold text-green-500">₹{summary.totalReceivable.toFixed(2)}</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Scale className="h-4 w-4" />
            <span>Net Balance</span>
          </div>

          <p
            className={`text-2xl font-bold ${
              summary.netBalance > 0
                ? "text-green-500"
                : summary.netBalance < 0
                  ? "text-red-500"
                  : "text-muted-foreground"
            }`}
          >
            ₹{Math.abs(summary.netBalance).toFixed(2)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
