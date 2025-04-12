import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import anxietyImg from "../assets/anxiety.png";
import plusIcon from "../assets/pluss.png";
import groupIcon from "../assets/group.png";
import leftarrow from "../assets/leftarrow.png";

const UserRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState(null);
  const [errors, setErrors] = useState({});

  // For joining a room with an anonymous username
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [joinUsername, setJoinUsername] = useState("");
  const [joinError, setJoinError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3001/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  const handleCreateRoom = async () => {
    // Validate inputs for room creation
    const newErrors = {};
    if (!roomName.trim()) {
      newErrors.roomName = "*Required";
    }
    if (!roomImage) {
      newErrors.roomImage = "*Required";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", roomName);
      formData.append("image", roomImage);
      const res = await axios.post("http://localhost:3001/rooms", formData);
      setRooms([...rooms, res.data]);
      setShowCreateModal(false);
      setRoomName("");
      setRoomImage(null);
      setErrors({});
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  // Called when clicking join on a room.
  // If the user was previously joined (and did not explicitly leave), navigate directly.
  // Otherwise, show the modal to enter an anonymous username.
  const handleJoinRoom = (room) => {
    const storedJoin = localStorage.getItem(`chat_joined_${room._id}`);
    const storedUsername = localStorage.getItem(`chat_username_${room._id}`);
    if (storedJoin === "true" && storedUsername) {
      navigate(`/chat/${room._id}`, { state: { username: storedUsername } });
    } else {
      setSelectedRoom(room);
      setJoinUsername("");
      setJoinError("");
      setShowJoinModal(true);
    }
  };

  // Submit the anonymous username and store join status for the room.
  const submitJoin = () => {
    if (!joinUsername.trim()) {
      setJoinError("Username is required.");
      return;
    }
    // Save join status and username for future entry (if user leaves with the back button)
    localStorage.setItem(`chat_joined_${selectedRoom._id}`, "true");
    localStorage.setItem(`chat_username_${selectedRoom._id}`, joinUsername);
    navigate(`/chat/${selectedRoom._id}`, { state: { username: joinUsername } });
    setShowJoinModal(false);
  };

  return (
    <div className="p-4">
      <button className="mb-4" onClick={() => window.history.back()}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      <div className="grid grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-end"
          >
            <h2 className="font-semibold text-[#EC993D] mb-2">{room.name}</h2>
            {room.image ? (
              <img
                src={`http://localhost:3001/${room.image}`}
                alt={room.name}
                className="w-56 h-52 object-cover rounded mb-3"
              />
            ) : (
              <img
                src={anxietyImg}
                alt={room.name}
                className="w-56 h-52 object-cover rounded mb-3"
              />
            )}
            <div className="w-full flex items-center justify-end gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={groupIcon}
                  alt="Group Icon"
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-gray-600 text-sm">{room.count || 0}</span>
              </div>
              <button
                onClick={() => handleJoinRoom(room)}
                className="bg-[#EC993D] text-white px-4 py-1 rounded hover:bg-orange-400"
              >
                Join
              </button>
            </div>
          </div>
        ))}

        <div
          onClick={() => {
            setShowCreateModal(true);
            setErrors({});
          }}
          className="bg-gray-100 w-[283px] h-[320px] rounded-lg shadow p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
        >
          <img
            src={plusIcon}
            alt="Add"
            className="w-[50px] h-[50px] text-gray-400 mb-2"
          />
          <span className="text-gray-600 font-medium">Create a Room</span>
        </div>
      </div>

      {/* Modal for creating a new room */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full relative">
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 text-black hover:text-gray-700 text-3xl font-semibold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Create a New Room</h2>
            <label className="block mb-3">
              <span className="text-gray-700">Room Name:</span>
              <input
                type="text"
                value={roomName}
                onChange={(e) => {
                  setRoomName(e.target.value);
                  if (e.target.value.trim()) {
                    setErrors((prev) => ({ ...prev, roomName: "" }));
                  }
                }}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter room name"
              />
              {errors.roomName && (
                <span className="text-red-500 text-sm">{errors.roomName}</span>
              )}
            </label>
            <label className="block mb-3">
              <span className="text-gray-700">Room Image:</span>
              <input
                type="file"
                onChange={(e) => {
                  setRoomImage(e.target.files[0]);
                  if (e.target.files[0]) {
                    setErrors((prev) => ({ ...prev, roomImage: "" }));
                  }
                }}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.roomImage && (
                <span className="text-red-500 text-sm">{errors.roomImage}</span>
              )}
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setErrors({});
                }}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for entering anonymous username when joining a room */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full relative">
            <button
              onClick={() => setShowJoinModal(false)}
              className="absolute top-5 right-5 text-black hover:text-gray-700 text-3xl font-semibold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Enter Username</h2>
            <p className="mb-4">Enter the name you wish to use in this chat room.</p>
            <input
              type="text"
              value={joinUsername}
              onChange={(e) => {
                setJoinUsername(e.target.value);
                if (e.target.value.trim()) setJoinError("");
              }}
              className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              placeholder="Your username"
            />
            {joinError && (
              <span className="text-red-500 text-sm">{joinError}</span>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowJoinModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={submitJoin}
                className="bg-[#EC993D] text-white px-4 py-2 rounded"
              >
                Join Chat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserRoom;
