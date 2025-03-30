// src/components/UserRoom.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";


import anxietyImg from "../assets/anxiety.png";

import leftarrow from "../assets/leftarrow.png";

const Wellness = () => {
  const [centers, setCenters] = useState([]);




  useEffect(() => {
    fetchCenters();
  }, []);

  const fetchCenters = async () => {
    try {
      const res = await axios.get("http://localhost:3001/centers");
      setCenters(res.data);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  

  return (
    <div className="p-4">
      <button className="mb-4" onClick={() => window.history.back()}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      <div className="grid grid-cols-4 gap-6">
        {centers.map((center) => (
          <div
            key={center._id}
            className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-end"
          >
            <h2 className="font-semibold text-[#EC993D] mb-2">{center.name}</h2>
            {center.image ? (
              <img
                src={`http://localhost:3001/${center.image}`}
                alt={center.name}
                className="w-56 h-52 object-cover rounded mb-3"
              />
            ) : (
              <img
                src={anxietyImg}
                alt={center.name}
                className="w-56 h-52 object-cover rounded mb-3"
              />
            )}
            <div className="w-full flex items-center justify-end gap-4">
              
              <button
               
                className="bg-[#EC993D] text-white px-4 py-1 rounded hover:bg-orange-400"
              >
                Play
              </button>
            </div>
          </div>
        ))}

        
      </div>

      
    </div>
  );
};

export default Wellness;
