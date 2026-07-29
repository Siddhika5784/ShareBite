import { Server } from "socket.io";
import Message from "./models/Message.js";

let io;

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on("sendMessage", async (data) => {
      try {
        const newMessage = await Message.create({
          roomId: data.roomId,
          sender: data.sender,
          message: data.message,
        });

        io.to(data.roomId).emit("receiveMessage", newMessage);
      } catch (error) {
        console.error("Error sending message:", error.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => io;
