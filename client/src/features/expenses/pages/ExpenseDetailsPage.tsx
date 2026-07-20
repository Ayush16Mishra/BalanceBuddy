import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

export function ExpenseDetailsPage() {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Food</h1>
        <p className="text-muted-foreground">Expense Details</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Total Amount</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-4xl font-bold">₹200</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settlement Progress</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>2 of 3 members have paid.</p>

          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Ayush</span>
              <span>✅ Paid</span>
            </div>

            <div className="flex justify-between">
              <span>Rahul</span>
              <span>✅ Paid</span>
            </div>

            <div className="flex justify-between">
              <span>John</span>
              <span>❌ Pending</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button variant="outline">Send Reminder</Button>

        <Button>Settle Expense</Button>
      </div>
    </div>
  );
}
