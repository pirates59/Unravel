import React from "react";
import anxietyImg from "../assets/anxiety.png"; // Ensure this file exists
import depressionImg from "../assets/anxiety.png"; // Replace with actual path
import familyImg from "../assets/anxiety.png"; // Replace with actual path
import group from "../assets/group.png";

const AdminRooms = () => {
  // Example static data; replace with actual or fetched data
  const rooms = [
    {
      id: 1,
      name: "Anxiety",
      image: anxietyImg,
      count: 253,
    },
    {
      id: 2,
      name: "Depression",
      image: depressionImg,
      count: 192,
    },
    {
      id: 3,
      name: "Family",
      image: familyImg,
      count: 140,
    },
  ];

  const handleDelete = (roomId) => {
    // Implement delete logic here
    console.log("Delete room:", roomId);
  };

  const handleAddNewRoom = () => {
    // Implement add room logic here
    console.log("Add new room");
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar with the 'Rooms' button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
            Rooms
          </button>
        </div>
      </div>

      {/* Grid of room cards + add new room card */}
      <div className="grid grid-cols-4 gap-6">
        {/* Existing rooms */}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-[#E5E7E9] rounded-lg shadow p-4 flex flex-col items-end "
          >
               <h2 className="font-semibold text-[#EC993D] mb-2 ">{room.name}</h2>
            <img
              src={room.image}
              alt={room.name}
              className="w-56 h-52 object-cover rounded mb-2"
            />
         
            <div className="flex items-center gap-2 justify-between mt-2">
              <img
                          src={group}
                          alt="User Avatar"
                          className="w-4 h-4 rounded-full"
                        />
              <span className="text-gray-600 text-sm">{room.count}</span>
              <button
                onClick={() => handleDelete(room.id)}
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
