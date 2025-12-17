import { io } from "socket.io-client";
export const initSocket = (userId) => {
  return io("http://192.168.1.9:3000", {
    query: { userId },
    transports: ["websocket"],
  });
};
