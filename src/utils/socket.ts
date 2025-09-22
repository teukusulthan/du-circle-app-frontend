import { io, Socket } from "socket.io-client";

export function createSocket(token: string): Socket {
  return io(import.meta.env.VITE_WS_URL || "http://localhost:3000", {
    transports: ["websocket"],
    auth: { token },
    withCredentials: true,
  });
}
