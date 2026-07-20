import { useAuthStore } from "@/stores/authStore";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useLogout } from "@/features/auth/hooks/useLogout";

export function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  return (
    <div className="relative space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>

        <p className="text-muted-foreground">Manage your account information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>

          <CardDescription>Your account details.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm font-medium">Name</span>

            <span className="text-muted-foreground">{user?.name ?? "-"}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm font-medium">Email</span>

            <span className="text-muted-foreground">{user?.email ?? "-"}</span>
          </div>

          <div className="flex items-center justify-between border-b pb-3">
            <span className="text-sm font-medium">Email Status</span>

            <span
              className={
                user?.emailVerified ? "font-medium text-emerald-600" : "font-medium text-amber-600"
              }
            >
              {user?.emailVerified ? "Verified" : "Not Verified"}
            </span>
          </div>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
          >
            {logout.isPending ? "Logging out..." : "Logout"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
