import dotenv from "dotenv";
import http from "http";

import "./config/passport.js";
import "./jobs/email.worker.js";
import "./jobs/notification.worker.js";
import "./jobs/scheduler.worker.js";

import app from "./app.js";
import { registerScheduledJobs } from "./jobs/scheduler.js";
import { initializeSocket } from "./socket/index.js";
import { connectRedis } from "./utils/redis.js";

dotenv.config();

const PORT = process.env.PORT || 5001;

const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

async function startServer() {
  try {
    await connectRedis();
    await registerScheduledJobs();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
