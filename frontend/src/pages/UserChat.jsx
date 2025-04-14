import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from "../context/UserContext";

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserDataContext);

  const rideId = localStorage.getItem("rideId");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!rideId) {
      console.error("No rideId found!");
      navigate(-1);
      return;
    }

    if (socket && user?._id) {
      socket.emit("join", { userId: user._id, userType: "user" });
    }

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/getCaptainMessage/${rideId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(Array.isArray(response.data.messages) ? response.data.messages : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    const handleIncomingMessage = (message) => {
      if (message.ride === rideId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket?.on("receiveMessageFromCaptain", handleIncomingMessage);

    return () => {
      socket?.off("receiveMessageFromCaptain", handleIncomingMessage);
    };
  }, [rideId, token, navigate, socket, user]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    if (!rideId) {
      console.error("Ride ID is missing!");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/userMessage/${rideId}`,
        {
          message: newMessage,
          ride: rideId, 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data) {
        socket?.emit("sendMessage", response.data);
        setMessages((prev) => [...prev, response.data]);
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <nav className="bg-white shadow-md fixed top-0 w-full px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="text-xl mr-4">Back</button>
        <h2 className="text-lg font-bold">Chat with Captain</h2>
      </nav>

      <div className="flex-1 overflow-y-auto p-4 mt-16 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl max-w-xs text-white text-sm shadow-md ${
                msg.senderType === "user" ? "bg-blue-500" : "bg-gray-500"
              }`}>
                <p>{typeof msg.message === "string" ? msg.message : JSON.stringify(msg.message)}</p>
                <span className="block text-xs opacity-70 mt-1 text-right">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={chatEndRef}></div>
      </div>

      <div className="p-4 bg-white flex items-center fixed bottom-0 w-full">
        <input
          type="text"
          className="flex-1 p-2 border rounded-full"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default UserChat;