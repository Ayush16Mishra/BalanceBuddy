import { Queue } from "bullmq";

import { bullConnection } from "./connection.js";

export const emailQueue = new Queue("emails", {
  connection: bullConnection,
});
