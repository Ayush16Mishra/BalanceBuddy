import { randomUUID } from "node:crypto";

import { emitNotificationCreated } from "../../socket/emitters.js";

export type NotificationType = "group" | "expense" | "settlement";

export interface NotificationPayload {
  title: string;
  message: string;
  type: NotificationType;
}

class NotificationService {
  notify(userId: string, notification: NotificationPayload) {
    emitNotificationCreated(userId, {
      id: randomUUID(),
      ...notification,
      createdAt: new Date().toISOString(),
    });
  }
}

export const notificationService = new NotificationService();
