import { Socket } from "socket.io";

import { SOCKET_ROOMS } from "../socket/constants.js";

export function joinUserRoom(socket: Socket, userId: string) {
  const room = `${SOCKET_ROOMS.USER}:${userId}`;

  socket.join(room);

  console.log(`👤 ${socket.id} joined ${room}`);
}

export function joinGroupRoom(socket: Socket, groupId: string) {
  const room = `${SOCKET_ROOMS.GROUP}:${groupId}`;

  socket.join(room);

  console.log(`👥 ${socket.id} joined ${room}`);
}

export function leaveGroupRoom(socket: Socket, groupId: string) {
  const room = `${SOCKET_ROOMS.GROUP}:${groupId}`;

  socket.leave(room);

  console.log(`🚪 ${socket.id} left ${room}`);
}
