import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const RecentActivity = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="py-12 text-center">
        <p className="font-medium">No expenses yet.</p>

        <p className="mt-2 text-sm text-muted-foreground">Expense cards will appear here.</p>
      </CardContent>
    </Card>
  );
};
