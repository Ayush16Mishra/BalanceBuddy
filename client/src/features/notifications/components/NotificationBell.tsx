import { useState } from "react";
import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useNotificationStore } from "@/stores/notificationStore";
import { NotificationDropdown } from "../components/NotificationDropdown";

export function NotificationBell() {
  const notifications = useNotificationStore((state) => state.notifications);

  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative rounded-full bg-white/80 shadow-sm transition-colors hover:bg-white"
        onClick={() => setOpen((prev) => !prev)}
      >
        <Bell className="h-5 w-5" />

        {notifications.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-xs font-medium text-destructive-foreground">
            {notifications.length > 99 ? "99+" : notifications.length}
          </span>
        )}
      </Button>

      {open && <NotificationDropdown onClose={() => setOpen(false)} />}
    </div>
  );
}
