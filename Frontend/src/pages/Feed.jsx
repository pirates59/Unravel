import React from "react";
import UserSidebar from "../components/UserSidebar";
import { NavLink } from "react-router-dom";

const Feed = () => {
  return (
    <UserSidebar>
      {/* Header with Recent, Feed, and Topic in one line */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
         <NavLink to="/recent">
          <button className="border border-[#EC993D] px-6 py-2 rounded-xl">
            Recent
          </button>
          </NavLink>
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">
            Feed
            
          </button>
        </div>
        
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6 w-[1028px]">
        {/* Posts Section */}
        <div className="flex-1 space-y-4">
          {Array(2)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                  <div>
                    <p className="font-semibold">Ashley Haris</p>
                    <p className="text-sm text-gray-500">4h</p>
                  </div>
                </div>
                <p className="mt-2">"I wish someone would notice I’m not okay."</p>
                <p className="text-blue-500 text-sm cursor-pointer">
                  #YakamozS245
                </p>
                <div className="flex justify-between text-gray-500 text-sm mt-2">
                  <p>💬 197</p>
                  <p>❤️ 2,533</p>
                </div>
              </div>
            ))}
        </div>

     
      </div>
    </UserSidebar>
  );
};

export default Feed;
