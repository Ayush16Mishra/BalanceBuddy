import { NotificationBell } from "@/features/notifications/components/NotificationBell";

export function AppHeader() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
      <div>
        <h2 className="text-xl font-semibold">BalanceBuddy</h2>
      </div>

      <div className="flex items-center gap-3">
        <NotificationBell />
      </div>
    </header>
  );
}
