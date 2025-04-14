import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";

const CaptainChat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);

  // Retrieve rideId and token from localStorage
  const rideId = localStorage.getItem("rideId");
  const token = localStorage.getItem("token");
  const captainId = localStorage.getItem("CaptainId");

  useEffect(() => {
    console.log("CaptainChat Mounted");
    console.log("Ride ID:", rideId);
    console.log("Captain ID:", captainId);

    if (!rideId || !captainId) {
      console.error("No rideId or captainId found!");
      return; // Prevent navigation for debugging
    }

    // Ensure socket is connected before emitting
    if (socket) {
      socket.emit("join", { userId: captainId, userType: "captain" });
    } else {
      console.error("Socket not initialized.");
    }

    // Fetch chat history
    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/chat/getUserMessage/${rideId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(response.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();

    // Listen for real-time messages
    const handleNewMessage = (message) => {
      if (message.rideId === rideId) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket?.on("receiveMessage", handleNewMessage);

    return () => {
      socket?.off("receiveMessage", handleNewMessage);
    };
  }, [rideId, captainId, token, socket]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (newMessage.trim() === "") return;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/chat/captainMessage/${rideId}`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sentMessage = {
        rideId,
        message: newMessage,
        senderType: "captain",
        timestamp: new Date().toISOString(),
      };

      socket?.emit("sendMessage", sentMessage);
      setMessages((prev) => [...prev, sentMessage]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md fixed top-0 w-full px-6 py-4 flex items-center">
        <button onClick={() => navigate(-1)} className="text-xl mr-4">
          &#8592;
        </button>
        <h2 className="text-lg font-bold">Chat with User</h2>
      </nav>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 mt-16 space-y-2">
        {messages.length > 0 ? (
          messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.senderType === "captain" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-2xl max-w-xs text-white text-sm shadow-md ${
                msg.senderType === "captain" ? "bg-blue-500" : "bg-gray-500"
              }`}>
                <p>{msg.message}</p>
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

      {/* Message Input */}
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

export default CaptainChat;
