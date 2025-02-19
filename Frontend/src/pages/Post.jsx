
import React from "react";
import UserSidebar from "../components/UserSidebar";
import leftarrow from "../assets/leftarrow.png";
import icon from "../assets/icon.png";
import { NavLink } from "react-router-dom";
const Post = () => {
  return (
   
 
    <div>
        {/* Back Button */}
        <button className="mb-[30px]">
          <img src={leftarrow} alt="Back" className="w-6 h-6" />
        </button>

        {/* Post Box */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-md w-[80%] h-[65%] ">
          <div className="flex items-center mb-3">
            <img
              src={icon}
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="font-semibold">Ashley Haris</span>
          </div>

          <div className="bg-gray-300 rounded-lg p-4 min-h-[300px] text-white font-semibold">
            What's Happening?
          </div>

          <div className="flex justify-end mt-3">
            <button className="bg-[#EC993D] text-white px-8 py-2 rounded-lg ">
              Post
            </button>
          </div>
        </div>
        </div>
    
   
  );
};

export default Post;
