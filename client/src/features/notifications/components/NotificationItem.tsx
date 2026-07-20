import { CheckCircle2, Receipt, Users } from "lucide-react";

import type { Notification } from "@/stores/notificationStore";

interface NotificationItemProps {
  notification: Notification;
}

function getRelativeTime(date: string) {
  const diff = Date.now() - new Date(date).getTime();

  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return "Just now";

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes} min${minutes === 1 ? "" : "s"} ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function NotificationIcon({ type }: { type: Notification["type"] }) {
  switch (type) {
    case "expense":
      return <Receipt className="h-5 w-5 text-orange-500" />;

    case "settlement":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;

    case "group":
      return <Users className="h-5 w-5 text-blue-500" />;

    default:
      return null;
  }
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className="flex gap-3 border-b p-4 last:border-b-0 hover:bg-muted/50">
      <NotificationIcon type={notification.type} />

      <div className="min-w-0 flex-1">
        <p className="font-medium">{notification.title}</p>

        <p className="mt-1 text-sm text-muted-foreground">{notification.message}</p>

        <p className="mt-2 text-xs text-muted-foreground">
          {getRelativeTime(notification.createdAt)}
        </p>
      </div>
    </div>
  );
}
