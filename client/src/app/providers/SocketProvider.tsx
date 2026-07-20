import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/lib/socket";
import { getAccessToken } from "@/lib/accessToken";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";

interface SocketProviderProps {
  children: React.ReactNode;
}

interface ExpenseEvent {
  groupId: string;
  expense: unknown;
}

interface GroupUpdatedEvent {
  groupId: string;
  group: unknown;
}

interface NotificationEvent {
  id: string;
  title: string;
  message: string;
  type: "group" | "expense" | "settlement";
  createdAt: string;
}

export function SocketProvider({ children }: SocketProviderProps) {
  const queryClient = useQueryClient();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.isLoading);
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      socket.disconnect();
      return;
    }

    socket.auth = {
      token: getAccessToken(),
    };

    socket.connect();

    const handleExpenseCreated = ({ groupId }: ExpenseEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["group-expenses", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["balances", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    };

    const handleExpenseCancelled = ({ groupId }: ExpenseEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["group-expenses", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["balances", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    };

    const handleExpenseSharePaid = ({ groupId }: ExpenseEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["group-expenses", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["balances", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    };

    const handleGroupUpdated = ({ groupId }: GroupUpdatedEvent) => {
      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });

      queryClient.invalidateQueries({
        queryKey: ["group", groupId],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });
    };

    const handleNotificationCreated = (notification: NotificationEvent) => {
      addNotification(notification);
    };

    const handleReconnect = () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["groups"],
      });
    };

    socket.on("expense.created", handleExpenseCreated);

    socket.on("expense.cancelled", handleExpenseCancelled);
    socket.on("expenseShare.paid", handleExpenseSharePaid);
    socket.on("group.updated", handleGroupUpdated);
    socket.on("notification.created", handleNotificationCreated);
    socket.on("connect", handleReconnect);

    return () => {
      socket.off("expense.created", handleExpenseCreated);
      socket.off("expense.cancelled", handleExpenseCancelled);
      socket.off("expenseShare.paid", handleExpenseSharePaid);
      socket.off("group.updated", handleGroupUpdated);
      socket.off("notification.created", handleNotificationCreated);
      socket.off("connect", handleReconnect);
      socket.disconnect();
    };
  }, [user, loading, queryClient, addNotification]);

  return children;
}
