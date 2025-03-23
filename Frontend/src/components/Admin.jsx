import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userlogo from "../assets/userlogo.png";
import users from "../assets/users.png";
import appointment from "../assets/appointment.png";
import room from "../assets/room.png";
import setting from "../assets/setting.png";
import filter from "../assets/filter.png";
import therapist from "../assets/therapist.png";
import logout from "../assets/logout.png";

const Admin = ({ children }) => {
  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem("username"); 
    navigate("/login"); 
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#EC993D] text-white flex flex-col p-5">
        {/* Logo */}
        <div className="mb-10">
          <img src={userlogo} alt="Logo" className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]" />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-6">
          <NavLink to="/Users">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
              <img src={users} alt="Users" className="w-5 h-5" />
              <span>Users</span>
            </div>
          </NavLink>
          <NavLink to="/AdminAppointment">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
              <img src={appointment} alt="Appointment" className="w-5 h-5" />
              <span>Appointment</span>
            </div>
          </NavLink>
          <NavLink to="/AdminRooms">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={room} alt="Rooms" className="w-5 h-5" />
            <span>Rooms</span>
          </div>
          </NavLink>
          <NavLink to="/AdminTherapist">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={therapist} alt="Therapists" className="w-5 h-5" />
            <span>Therapists</span>
          </div>
          </NavLink>
          <NavLink to="/Filtration">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={filter} alt="Filtration" className="w-5 h-5" />
            <span>Filtration</span>
          </div>
          </NavLink>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto flex flex-col space-y-6">
                <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
                  <img src={setting} alt="Settings" className="w-5 h-5" />
                  <span>Settings</span>
                </div>
                <div
                  onClick={handleLogout}
                  className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
                >
                  <img src={logout} alt="Logout" className="w-5 h-5" />
                  <span>Logout</span>
                </div>
              </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">{children}</div>
    </div>
  );
};

export default Admin;
