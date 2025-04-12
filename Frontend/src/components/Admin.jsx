// Admin Component
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userlogo from "../assets/userlogo.png";
import users from "../assets/users.png";
import appointment from "../assets/appointment.png";
import room from "../assets/room.png";
import filter from "../assets/filter.png";
import therapist from "../assets/therapist.png";
import center from "../assets/wellness.png";
import logout from "../assets/logout.png";

const Admin = ({ children }) => {
  const navigate = useNavigate(); 

  // Logout handler to remove user data from local storage and navigate to login page
  const handleLogout = () => {
    localStorage.removeItem("username"); 
    navigate("/login"); 
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#EC993D] text-white flex flex-col p-5">
        {/* Logo Section */}
        <div className="mb-10">
          <img src={userlogo} alt="Logo" className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-3">
          {/* Menu Item: Users */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={users} alt="Users" className="w-5 h-5" />
            <NavLink to="/Users" className="flex-1">Users</NavLink>
          </div>

          {/* Menu Item: Appointments */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={appointment} alt="Appointments" className="w-5 h-5" />
            <NavLink to="/AdminAppointment" className="flex-1">Appointments</NavLink>
          </div>

          {/* Other Menu Items */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={room} alt="Rooms" className="w-5 h-5" />
            <NavLink to="/AdminRooms" className="flex-1">Rooms</NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={therapist} alt="Therapists" className="w-5 h-5" />
            <NavLink to="/AdminTherapist" className="flex-1">Therapists</NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={center} alt="Center" className="w-5 h-5" />
            <NavLink to="/AdminCenter" className="flex-1">Center</NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={filter} alt="Filtration" className="w-5 h-5" />
            <NavLink to="/Filtration" className="flex-1">Filtration</NavLink>
          </div>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto flex flex-col">
          <div
            onClick={handleLogout}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
          >
            <img src={logout} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Admin;
