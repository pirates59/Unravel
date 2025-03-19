import React from "react";
import anxietyImg from "../assets/anxiety.png"; // Ensure this file exists
import depressionImg from "../assets/anxiety.png"; // Replace with actual path
import familyImg from "../assets/anxiety.png"; // Replace with actual path
import PlusIcon from "../assets/pluss.png"; 
import leftarrow from "../assets/leftarrow.png";

const UserRoom = () => {
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
    <div>
      {/* Top bar with the 'Rooms' button */}
     <button className="mb-[30px]" onClick={() => navigate(-1)}>
             <img src={leftarrow} alt="Back" className="w-6 h-6" />
           </button>

      {/* Grid of room cards + add new room card */}
      <div className="grid grid-cols-4 gap-6">
        {/* Existing rooms */}
        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <img
              src={room.image}
              alt={room.name}
              className="w-full h-40 object-cover rounded mb-2"
            />
            <h2 className="text-lg font-semibold mb-1">{room.name}</h2>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-gray-600 text-sm">{room.count}</span>
              <button
                onClick={() => handleDelete(room.id)}
                className="bg-[#EC993D] text-white px-4 py-1 rounded hover:bg-[#d48432]"
              >
                Enter
              </button>
            </div>
          </div>
        ))}

        {/* Add new room card */}
        <div
          onClick={handleAddNewRoom}
          className="bg-white rounded-lg shadow p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
        >
          {/* If you don’t have an SVG, just use a “+” text or an inline SVG */}
        
          <img
               src={PlusIcon}
              alt=""
              className="w-12 h-12 text-gray-400" />
            
        </div>
      </div>
    </div>
  );
};

export default UserRoom;
