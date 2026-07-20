import { Server } from "socket.io";
import { Server as HttpServer } from "http";

import { SOCKET_EVENTS } from "./constants.js";
import { socketAuthMiddleware } from "./middleware.js";
import { joinGroupRoom, joinUserRoom } from "./rooms.js";

import { groupRepository } from "../modules/groups/group.repository.js";

let io: Server;

export function initializeSocket(server: HttpServer) {
  console.log("✅ Initializing Socket.IO");

  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  // Authenticate every socket connection
  io.use(socketAuthMiddleware);

  io.on(SOCKET_EVENTS.CONNECTION, async (socket) => {
    const userId = socket.data.user.id;

    console.log(`🔌 Socket connected: ${socket.id} (${userId})`);

    // Join personal room
    joinUserRoom(socket, userId);

    // Join all group rooms
    const groupIds = await groupRepository.getUserGroupIds(userId);

    for (const groupId of groupIds) {
      joinGroupRoom(socket, groupId);
    }

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.IO has not been initialized.");
  }

  return io;
}
