// src/components/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import Swal from "sweetalert2";

import defaultRoomImage from "../assets/anxiety.png";
import sendIcon from "../assets/send.png";
import leaveIcon from "../assets/leave.png";

const socketServerUrl = "http://localhost:3001";

const Chat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState("");
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [hasLeft, setHasLeft] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  // Reference for the messages container to track scroll position.
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Determine if user is near bottom
  const isUserAtBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    // Consider within 50px of bottom as "at bottom"
    return scrollTop + clientHeight >= scrollHeight - 50;
  };

  // Get logged-in user details from localStorage
  const currentUser = {
    id: localStorage.getItem("userId") || localStorage.getItem("username"),
    name: localStorage.getItem("username"),
    image: localStorage.getItem("profileImage")
      ? `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`
      : "http://localhost:3001/uploads/default.png",
  };

  // Function to create a new socket connection
  const createSocketConnection = () => {
    if (!socketRef.current) {
      socketRef.current = io(socketServerUrl, {
        transports: ["websocket"],
      });

      // Listen for connection errors
      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });

      socketRef.current.emit("joinRoom", roomId, currentUser);

      socketRef.current.on("newMessage", (message) => {
        setMessages((prev) => [...prev, message]);
      });

      socketRef.current.on("typing", (data) => {
        if (data.user.id !== currentUser.id) {
          setTypingUsers((prev) => {
            if (!prev.includes(data.user.name)) {
              return [...prev, data.user.name];
            }
            return prev;
          });
          setTimeout(() => {
            setTypingUsers((prev) =>
              prev.filter((name) => name !== data.user.name)
            );
          }, 2000);
        }
      });

      socketRef.current.on("stopTyping", (data) => {
        setTypingUsers((prev) =>
          prev.filter((name) => name !== data.user.name)
        );
      });
    }
  };

  useEffect(() => {
    // Fetch room details
    axios.get("http://localhost:3001/rooms").then((res) => {
      const room = res.data.find((r) => r._id === roomId);
      if (room) {
        setRoomName(room.name);
        setRoomImage(
          room.image ? `http://localhost:3001/${room.image}` : defaultRoomImage
        );
      }
    });

    // Fetch previous messages
    axios
      .get(`http://localhost:3001/rooms/${roomId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));

    // Create socket connection if user has not left
    if (!hasLeft) {
      createSocketConnection();
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId, hasLeft, currentUser]);

  // Auto-scroll effect: only trigger when new messages arrive AND user is at bottom
  useEffect(() => {
    if (isUserAtBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Handler for user scrolling manually
  const handleScroll = () => {
    // We could extend this to store the scroll state if needed
    // For now, the auto-scroll condition is checked in the useEffect above
  };

  const sendMessage = async () => {
    if (hasLeft || !text.trim()) return;
    try {
      const messageData = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderImage: currentUser.image,
        text,
      };
      await axios.post(
        `http://localhost:3001/rooms/${roomId}/messages`,
        messageData
      );
      setText("");
      if (socketRef.current) {
        socketRef.current.emit("stopTyping", { roomId, user: currentUser });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleLeaveOrJoin = () => {
    if (!hasLeft) {
      Swal.fire({
        title: "Leave Chat Room?",
        text: "Do you want to leave the chat room? You won't be able to send messages until you rejoin.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, leave",
        cancelButtonText: "Cancel",
      }).then((result) => {
        if (result.isConfirmed) {
          setHasLeft(true);
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
          }
          // Add a system leave message
          const leaveMessage = {
            senderId: "SYSTEM",
            text: "You left the chat",
            createdAt: new Date(),
          };
          setMessages((prev) => [...prev, leaveMessage]);
        }
      });
    } else {
      setHasLeft(false);
      createSocketConnection();
      const joinMessage = {
        senderId: "SYSTEM",
        text: "You rejoined the chat",
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, joinMessage]);
    }
  };

  const handleTyping = (e) => {
    setText(e.target.value);
    if (e.target.value && socketRef.current) {
      socketRef.current.emit("typing", { roomId, user: currentUser });
    } else if (socketRef.current) {
      socketRef.current.emit("stopTyping", { roomId, user: currentUser });
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-gray-100">
      {/* Top Bar */}
      <div className="flex h-[70px] items-center justify-between bg-[#D9D9D9] px-6 py-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full overflow-hidden">
              <img
                src={roomImage}
                alt="Room"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-semibold">
              {roomName || "Chat Room"}
            </h1>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <button onClick={() => navigate("/rooms")}>
            <img src={leaveIcon} alt="Back" className="w-9 h-9" />
          </button>
          <button
            onClick={handleLeaveOrJoin}
            className="bg-[#EC993D] text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            {hasLeft ? "Join Chat" : "Leave Chat"}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-4"
      >
        {messages.map((msg, index) => {
          // System messages (e.g., leave/join) are centered
          if (msg.senderId === "SYSTEM") {
            return (
              <div key={index} className="w-full text-center">
                <div className="inline-block bg-gray-300 text-gray-700 italic px-4 py-2 rounded">
                  {msg.text}
                  <div className="text-xs mt-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const isCurrentUser = msg.senderId === currentUser.id;
          return (
            <div
              key={index}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              {!isCurrentUser && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src={
                      msg.senderImage ||
                      "http://localhost:3001/uploads/default.png"
                    }
                    alt={msg.senderName}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="mx-2 max-w-xl">
                <div
                  className={`rounded-md shadow p-3 text-sm ${
                    isCurrentUser
                      ? "bg-[#7879F1] text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
                <div className="text-gray-500 text-xs text-right mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
              {isCurrentUser && (
                <div className="flex-shrink-0 w-9 h-9 rounded-full overflow-hidden">
                  <img
                    src={
                      currentUser.image ||
                      "http://localhost:3001/uploads/default.png"
                    }
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          );
        })}
        {typingUsers.length > 0 && (
          <div className="text-sm italic text-gray-600">
            {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={text}
            onChange={handleTyping}
            placeholder="Type your message here..."
            className="flex-1 border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            disabled={hasLeft}
          />
          <button
            onClick={sendMessage}
            className="bg-[#7879F1] text-white px-4 py-2 rounded-md text-sm font-medium"
            disabled={hasLeft}
          >
            <img src={sendIcon} alt="Send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
