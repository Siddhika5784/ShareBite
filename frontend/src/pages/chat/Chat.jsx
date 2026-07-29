import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";
import socket from "../../socket";
import { useAuth } from "../../context/AuthContext";

const Chat = () => {
  const { requestId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    socket.connect();

    socket.emit("joinRoom", requestId);

    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.disconnect();
    };
  }, [requestId]);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${requestId}`);
      setMessages(res.data.messages);
    } catch (error) {
      console.log(error);
    }
  };

  // auto scroll effect
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("sendMessage", {
      roomId: requestId,
      sender: user.id,
      message: message,
    });

    setMessage("");
  };

  return (
    <div className="p-6  h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-2xl font-bold mb-5">Chat</h1>

      <div className="border rounded-lg p-4 overflow-y-auto  bg-gray-50 flex-1">
        {messages.length === 0 ? (
          <p>No messages yet.</p>
        ) : (
          messages.map((msg) => {
            const senderId =
              typeof msg.sender === "object" ? msg.sender._id : msg.sender;

            const isMe = msg.sender === user.id;

            return (
              <div
                key={msg._id}
                className={`flex mb-3 ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isMe ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
                  }`}
                >
                  <p>{msg.message}</p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isMe ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="mt-4 flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600  hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
