import { useEffect, useRef } from "react";
import { toast } from "sonner";

import { useNotificationStore } from "@/stores/notificationStore";

export function NotificationToaster() {
  const notifications = useNotificationStore((state) => state.notifications);

  const shownNotifications = useRef(new Set<string>());

  useEffect(() => {
    for (const notification of notifications) {
      if (shownNotifications.current.has(notification.id)) {
        continue;
      }

      shownNotifications.current.add(notification.id);

      toast(notification.title, {
        description: notification.message,
      });
    }
  }, [notifications]);

  return null;
}
