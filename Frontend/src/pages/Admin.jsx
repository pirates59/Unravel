import React from "react";
import userlogo from "../assets/userlogo.png";
import users from "../assets/users.png";
import appointment from "../assets/appointment.png";
import room from "../assets/room.png";
import filter from "../assets/filter.png";
import therapist from "../assets/therapist.png";
import logout from "../assets/logout.png";


const Admin = () => {
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
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={users} alt="Write Post" className="w-5 h-5" />
            <span>Users</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={appointment} alt="Feed" className="w-5 h-5" />
            <span>Appointment</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={room} alt="Rooms" className="w-5 h-5" />
            <span>Rooms</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={therapist} alt="Wellness Center" className="w-5 h-5" />
            <span>Therapists</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={filter} alt="I Need Help" className="w-5 h-5" />
            <span>Filtration</span>
          </div>
        </nav>

        {/* Bottom Settings and Logout */}
        <div className="mt-auto flex flex-col space-y-6">
          
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={logout} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
     
    </div>
  );
};

export default Admin;
