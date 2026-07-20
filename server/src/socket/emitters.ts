import { getIO } from "./index.js";
import { SOCKET_EVENTS, SOCKET_ROOMS } from "./constants.js";

export function emitExpenseCreated(groupId: string, expense: unknown) {
  getIO().to(`${SOCKET_ROOMS.GROUP}:${groupId}`).emit(SOCKET_EVENTS.EXPENSE_CREATED, {
    groupId,
    expense,
  });
}

export function emitExpenseCancelled(groupId: string, expense: unknown) {
  getIO().to(`${SOCKET_ROOMS.GROUP}:${groupId}`).emit(SOCKET_EVENTS.EXPENSE_CANCELLED, expense);
}

export function emitExpenseUpdated(groupId: string, expense: unknown) {
  getIO().to(`${SOCKET_ROOMS.GROUP}:${groupId}`).emit(SOCKET_EVENTS.EXPENSE_UPDATED, expense);
}

export function emitExpenseSharePaid(groupId: string, share: unknown) {
  getIO().to(`${SOCKET_ROOMS.GROUP}:${groupId}`).emit(SOCKET_EVENTS.EXPENSE_SHARE_PAID, {
    groupId,
    share,
  });
}

export function emitGroupUpdated(groupId: string, group: unknown) {
  getIO().to(`${SOCKET_ROOMS.GROUP}:${groupId}`).emit(SOCKET_EVENTS.GROUP_UPDATED, group);
}

export function emitNotificationCreated(userId: string, notification: unknown) {
  getIO()
    .to(`${SOCKET_ROOMS.USER}:${userId}`)
    .emit(SOCKET_EVENTS.NOTIFICATION_CREATED, notification);
}
