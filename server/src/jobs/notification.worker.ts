import { Worker } from "bullmq";

import { bullConnection } from "./connection.js";
import { notificationService } from "../modules/notifications/notifications.service.js";

export const notificationWorker = new Worker(
  "notifications",
  async (job) => {
    const { userId, notification } = job.data;

    notificationService.notify(userId, notification);
  },
  {
    connection: bullConnection,
  }
);

notificationWorker.on("completed", (job) => {
  console.log(`✅ Notification job ${job.id} completed`);
});

notificationWorker.on("failed", (job, error) => {
  console.error(`❌ Notification job ${job?.id} failed`, error);
});
