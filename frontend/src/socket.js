import { io } from "socket.io-client";

const socket = io("https://sharebite-in10.onrender.com", {
  autoConnect: false,
});

export default socket;