import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";
import "@/lib/interceptors";

import App from "./app/App";
import { NotificationToaster } from "./features/notifications/components/NotificationToaster";
import { QueryProvider } from "./app/providers/QueryProvider";
import { SocketProvider } from "./app/providers/SocketProvider";
import { ToastProvider } from "./app/providers/ToastProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <SocketProvider>
        <App />
        <NotificationToaster />
        <ToastProvider />
      </SocketProvider>
    </QueryProvider>
  </React.StrictMode>
);
