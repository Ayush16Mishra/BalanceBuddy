import "socket.io";

export interface SocketUser {
  id: string;
}

declare module "socket.io" {
  interface SocketData {
    user: SocketUser;
  }
}
