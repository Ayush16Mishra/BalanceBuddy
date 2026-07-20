import { X } from "lucide-react";

import { Button } from "@/components/ui/button";

import { useNotificationStore } from "@/stores/notificationStore";
import { NotificationItem } from "../components/NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const notifications = useNotificationStore((state) => state.notifications);

  const clearNotifications = useNotificationStore((state) => state.clearNotifications);

  return (
    <div className="absolute right-0 top-12 z-50 w-96 overflow-hidden rounded-2xl border border-white/60 bg-white/90 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-4">
        <h3 className="font-semibold text-slate-900">Notifications</h3>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-slate-100"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">No notifications yet.</div>
      ) : (
        <>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <NotificationItem key={notification.id} notification={notification} />
            ))}
          </div>

          <div className="border-t border-slate-200/70 p-3">
            <Button
              variant="outline"
              className="w-full border-slate-300 bg-white hover:bg-slate-100"
              onClick={clearNotifications}
            >
              Clear All
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
