export const SOCKET_EVENTS = {
  CONNECTION: "connection",
  DISCONNECT: "disconnect",

  EXPENSE_CREATED: "expense.created",
  EXPENSE_CANCELLED: "expense.cancelled",
  EXPENSE_UPDATED: "expense.updated",

  EXPENSE_SHARE_PAID: "expenseShare.paid",

  GROUP_UPDATED: "group.updated",

  NOTIFICATION_CREATED: "notification.created",
} as const;

export const SOCKET_ROOMS = {
  USER: "user",
  GROUP: "group",
} as const;
