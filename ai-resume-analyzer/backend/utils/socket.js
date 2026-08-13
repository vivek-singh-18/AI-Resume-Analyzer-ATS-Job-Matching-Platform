import { Server } from "socket.io";

let io = null;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join", (room) => {
      console.log("Client joining room:", room);
      socket.join(room);
    });
  });

  return io;
};

export const getIO = () => io;

export default { initSocket, getIO };
