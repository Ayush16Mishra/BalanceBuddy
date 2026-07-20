import { io } from "socket.io-client";
import { getAccessToken } from "./accessToken";

export const socket = io(import.meta.env.VITE_SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  auth: {
    token: getAccessToken(),
  },
});
