// src/components/AdminRooms.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import groupIcon from "../assets/group.png";
import leftarrow from "../assets/leftarrow.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminRooms = () => {
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  // Fetch rooms from API including the unique user count
  const fetchRooms = async () => {
    try {
      const res = await axios.get("http://localhost:3001/rooms");
      setRooms(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Delete a room after confirmation
  const handleDelete = async (roomId) => {
    const confirm = await Swal.fire({
      title: "Delete Chat Room",
      text: "Are you sure you want to delete this chat room?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });
    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:3001/rooms/${roomId}`);
        // Optionally, you can also delete all messages associated with the room here.
        Swal.fire("Deleted!", "The chat room has been deleted.", "success");
        fetchRooms();
      } catch (error) {
        console.error("Error deleting room:", error);
        Swal.fire("Error", "Unable to delete the room.", "error");
      }
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar with a back button */}
      <div className="flex justify-between items-center mb-6">
      <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
            Rooms
          </button>
        </div>
      </div>
      {/* Grid of room cards */}
      <div className="grid grid-cols-4 gap-6">
        {rooms.map((room) => (
          <div
            key={room._id}
            className="bg-[#E5E7E9] rounded-lg shadow p-4 flex flex-col items-end"
          >
            <h2 className="font-semibold text-[#EC993D] mb-2">
              {room.name}
            </h2>
            <img
              src={
                room.image
                  ? `http://localhost:3001/${room.image}`
                  : "http://localhost:3001/uploads/default.png"
              }
              alt={room.name}
              className="w-56 h-52 object-cover rounded mb-3"
            />
            <div className="flex items-center gap-4 justify-end w-full">
              <div className="flex items-center gap-2">
                <img
                  src={groupIcon}
                  alt="User Count"
                  className="w-4 h-4 rounded-full"
                />
                <span className="text-gray-600 text-sm">{room.count}</span>
              </div>
              <button
                onClick={() => handleDelete(room._id)}
                className="bg-[#EC993D] text-white px-4 py-1 rounded hover:bg-[#d48432]"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRooms;
