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
  // isJoined tracks whether the user has explicitly joined this room
  const [isJoined, setIsJoined] = useState(false);
  const [typingUsers, setTypingUsers] = useState([]);
  const containerRef = useRef(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // Current user information must include an email.
  const currentUser = {
    id: localStorage.getItem("userId") || localStorage.getItem("username"),
    name: localStorage.getItem("username"),
    email: localStorage.getItem("email") || "default@example.com",
    image: localStorage.getItem("profileImage")
      ? `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`
      : "http://localhost:3001/uploads/default.png",
  };

  // Create the socket connection if needed.
  const createSocketConnection = () => {
    if (!socketRef.current) {
      socketRef.current = io(socketServerUrl, {
        transports: ["websocket"],
      });
      socketRef.current.on("connect_error", (err) => {
        console.error("Socket connection error:", err);
      });
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
        }
      });
      socketRef.current.on("stopTyping", (data) => {
        setTypingUsers((prev) =>
          prev.filter((name) => name !== data.user.name)
        );
      });
    }
  };

  // On mount, fetch room details, messages, and check if user is marked as joined.
  useEffect(() => {
    axios.get("http://localhost:3001/rooms").then((res) => {
      const room = res.data.find((r) => r._id === roomId);
      if (room) {
        setRoomName(room.name);
        setRoomImage(
          room.image ? `http://localhost:3001/${room.image}` : defaultRoomImage
        );
      }
    });

    axios
      .get(`http://localhost:3001/rooms/${roomId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));

    // Check localStorage to see if the user was joined in this room.
    const storedJoin = localStorage.getItem(`chat_joined_${roomId}`);
    if (storedJoin === "true") {
      setIsJoined(true);
      createSocketConnection();
      socketRef.current.emit("joinRoom", roomId, currentUser);
    }

    // On unmount, disconnect the socket only if the user did NOT leave intentionally.
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [roomId]);

  useEffect(() => {
    if (isUserAtBottom()) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const isUserAtBottom = () => {
    if (!containerRef.current) return true;
    const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
    return scrollTop + clientHeight >= scrollHeight - 50;
  };

  const sendMessage = async () => {
    if (!isJoined || !text.trim()) return;
    try {
      const messageData = {
        senderId: currentUser.id,
        senderName: currentUser.name,
        senderEmail: currentUser.email,
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

  // Toggling join/leave chat explicitly.
  const handleJoinOrLeave = () => {
    if (isJoined) {
      // When user clicks Leave Chat, update state and localStorage.
      Swal.fire({
        title: "Leave Chat Room?",
        text: "Do you want to leave the chat room? You won't be able to send messages until you rejoin.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, leave",
        cancelButtonText: "Cancel",
      }).then(async (result) => {
        if (result.isConfirmed) {
          setIsJoined(false);
          localStorage.setItem(`chat_joined_${roomId}`, "false");
          if (socketRef.current) {
            socketRef.current.emit("leaveRoom", roomId, currentUser);
          }
          const systemLeaveMessage = {
            senderId: "SYSTEM",
            senderName: "System",
            text: `${currentUser.name} left the chat.`,
            createdAt: new Date(),
            system: true,
          };
          setMessages((prev) => [...prev, systemLeaveMessage]);
          await axios.post(`http://localhost:3001/rooms/${roomId}/messages`, systemLeaveMessage);
        }
      });
    } else {
      // When user explicitly clicks Join Chat.
      createSocketConnection();
      socketRef.current.emit("joinRoom", roomId, currentUser);
      setIsJoined(true);
      localStorage.setItem(`chat_joined_${roomId}`, "true");
      const systemJoinMessage = {
        senderId: "SYSTEM",
        senderName: "System",
        text: `${currentUser.name} joined the chat.`,
        createdAt: new Date(),
        system: true,
      };
      setMessages((prev) => [...prev, systemJoinMessage]);
      axios.post(`http://localhost:3001/rooms/${roomId}/messages`, systemJoinMessage);
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
          <div className="w-9 h-9 rounded-full overflow-hidden">
            <img
              src={roomImage}
              alt="Room"
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold">{roomName || "Chat Room"}</h1>
        </div>
        <div className="flex gap-3 items-center">
          {/* Back button (leaveIcon) navigates back without altering join state */}
          <button onClick={() => navigate("/rooms")}>
            <img src={leaveIcon} alt="Back" className="w-9 h-9" />
          </button>
          {/* Toggle join/leave explicitly */}
          <button
            onClick={handleJoinOrLeave}
            className="bg-[#EC993D] text-white px-6 py-2 rounded-md text-sm font-medium"
          >
            {isJoined ? "Leave Chat" : "Join Chat"}
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div ref={containerRef} className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg, index) => {
          if (msg.senderId === "SYSTEM") {
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="inline-block bg-gray-300 text-gray-700 px-4 py-2 rounded text-center w-[1170px]">
                  {msg.text}
                </div>
              </div>
            );
          }
          const isCurrentUser = msg.senderId === currentUser.id;
          return (
            <div
              key={index}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
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
            disabled={!isJoined}
          />
          <button
            onClick={sendMessage}
            className="bg-[#7879F1] text-white px-4 py-2 rounded-md text-sm font-medium"
            disabled={!isJoined}
          >
            <img src={sendIcon} alt="Send" className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
