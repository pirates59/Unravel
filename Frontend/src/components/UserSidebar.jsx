import React from "react";
import userlogo from "../assets/userlogo.png";
import plus from "../assets/plus.png";
import feed from "../assets/feed.png";
import help from "../assets/help.png";
import room from "../assets/room.png";
import wellness from "../assets/wellness.png";
import setting from "../assets/setting.png";
import logout from "../assets/logout.png";
import notification from "../assets/notification.png";
import { NavLink } from "react-router-dom";

const UserSidebar = ({ children }) => {
  return (
    <div className="flex h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-[#EC993D] text-white flex flex-col p-5">
        {/* Logo */}
        <div className="mb-10">
          <img
            src={userlogo}
            alt="Logo"
            className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80 ">
            
            <img src={plus} alt="Write Post" className="w-5 h-5" />
            <NavLink to="/post">
            <span>Write Post</span>
              </NavLink>
          
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={feed} alt="Feed" className="w-5 h-5" />
            <NavLink to="/feed">
            <span>Feed</span>
            </NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={room} alt="Rooms" className="w-5 h-5" />
            <span>Rooms</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={wellness} alt="Wellness Center" className="w-5 h-5" />
            <span>Wellness Center</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={help} alt="I Need Help" className="w-5 h-5" />
            <NavLink to="/help">
            <span>I Need Help</span>
            </NavLink>
          </div>
        </nav>

        {/* Bottom Settings and Logout */}
        <div className="mt-auto flex flex-col space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={setting} alt="Settings" className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={logout} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Right Side: Top Bar + Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar (Notification + Profile) */}
        <div className="flex justify-end items-center p-4 bg-white">
          <div className="cursor-pointer mx-4">
            <img src={notification} alt="Notification" className="w-6 h-6" />
          </div>
          <div className="cursor-pointer w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>

        {/* Children: Main Content Below the Top Bar */}
        <div className="flex-1 p-6  overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default UserSidebar;
