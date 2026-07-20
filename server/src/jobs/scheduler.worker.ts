import { Worker } from "bullmq";

import { bullConnection } from "./connection.js";
import { groupRepository } from "../modules/groups/group.repository.js";

export const schedulerWorker = new Worker(
  "scheduler",
  async (job) => {
    switch (job.name) {
      case "cleanup-expired-invites":
        await groupRepository.deleteExpiredInvites();
        break;
    }
  },
  {
    connection: bullConnection,
  }
);
