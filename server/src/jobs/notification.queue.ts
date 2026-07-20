import { Queue } from "bullmq";

import { bullConnection } from "./connection.js";

export const notificationQueue = new Queue("notifications", {
  connection: bullConnection,
});
