import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { useDashboard } from "@/features/dashboard/hooks/useDashboard";

import { ErrorState } from "@/shared/components/states/ErrorState";
import { LoadingState } from "@/shared/components/states/LoadingState";
import { formatCurrency } from "@/shared/utils/formatCurrency";

export function DashboardPage() {
  const { data, isLoading, isError } = useDashboard();

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError || !data) {
    return (
      <ErrorState
        title="Couldn't load dashboard"
        description="Please refresh the page and try again."
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <p className="text-muted-foreground">Welcome to BalanceBuddy.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Amount You Owe</CardTitle>

            <CardDescription>Total outstanding balance you need to pay.</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(data.totalOwed)}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Amount Owed To You</CardTitle>

            <CardDescription>Total amount others owe you.</CardDescription>
          </CardHeader>

          <CardContent>
            <p className="text-3xl font-bold">{formatCurrency(data.totalReceivable)}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
