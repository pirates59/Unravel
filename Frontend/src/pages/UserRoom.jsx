import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Example images; replace with your own if you like
import anxietyImg from "../assets/anxiety.png";
import plusIcon from "../assets/pluss.png";
import groupIcon from "../assets/group.png";
import leftarrow from "../assets/leftarrow.png";

const UserRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomImage, setRoomImage] = useState(null);

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

  // Create room
  const handleCreateRoom = async () => {
    try {
      const formData = new FormData();
      formData.append("name", roomName);
      if (roomImage) {
        formData.append("image", roomImage);
      }

      const res = await axios.post("http://localhost:3001/rooms", formData);
      setRooms([...rooms, res.data]);
      setShowModal(false);
      setRoomName("");
      setRoomImage(null);
    } catch (error) {
      console.error("Error creating room:", error);
    }
  };

  return (
    <div className="p-4">
      {/* Example "Back" button */}
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
            {/* Bottom row: group icon + count + Enter */}
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
                onClick={() => navigate(`/chat/${room._id}`)}
                className="bg-[#EC993D] text-white px-4 py-1 rounded hover:bg-orange-400"
              >
                Enter
              </button>
            </div>
          </div>
        ))}

        {/* Card to create a new room */}
        <div
          onClick={() => setShowModal(true)}
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

      {/* Modal Overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4">Create a New Room</h2>
            <label className="block mb-3">
              <span className="text-gray-700">Room Name:</span>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter room name"
              />
            </label>
            <label className="block mb-3">
              <span className="text-gray-700">Room Image:</span>
              <input
                type="file"
                onChange={(e) => setRoomImage(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
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
    </div>
  );
};

export default UserRoom;
