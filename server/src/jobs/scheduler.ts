import { Queue } from "bullmq";

import { bullConnection } from "./connection.js";

const schedulerQueue = new Queue("scheduler", {
  connection: bullConnection,
});

export async function registerScheduledJobs() {
  await schedulerQueue.upsertJobScheduler(
    "cleanup-expired-invites",
    {
      pattern: "0 0 * * *",
    },
    {
      name: "cleanup-expired-invites",
      data: {},
    }
  );
}
