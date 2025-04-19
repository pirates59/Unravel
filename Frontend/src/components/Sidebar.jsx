//Sidebar Component
import React from "react";
import service from "../assets/service.png";
import calendar from "../assets/calendar.png";
import user from "../assets/user.png";

const Sidebar = ({ activeStep }) => (
  <div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
    <ul className="space-y-3">
      <li className="relative flex items-center bg-white rounded-lg p-3">
        <div className={`absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full border-2 ${
          activeStep === 1 ? "bg-[#4BB543] border-white" : "bg-white border-[#000000]"
        } shadow-lg`}></div>
        <div className="flex items-center">
          <img src={service} alt="Service Icon" className="h-5 w-5" />
          <span className="ml-2 font-semibold text-sm">Service Selection</span>
        </div>
      </li>
      <li className="relative flex items-center bg-white rounded-lg p-3">
        <div className={`absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full border-2 ${
          activeStep === 2 ? "bg-[#4BB543] border-white" : "bg-white border-[#000000]"
        } shadow-lg`}></div>
        <div className="flex items-center">
          <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
          <span className="ml-2 font-semibold text-sm">Date and Time</span>
        </div>
      </li>
      <li className="relative flex items-center bg-white rounded-lg p-3">
        <div className={`absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-5 w-5 rounded-full border-2 ${
          activeStep === 3 ? "bg-[#4BB543] border-white" : "bg-white border-[#000000]"
        } shadow-lg`}></div>
        <div className="flex items-center">
          <img src={user} alt="User Icon" className="h-5 w-5" />
          <span className="ml-2 font-semibold text-sm">Your Information</span>
        </div>
      </li>
    </ul>
  </div>
);

export default Sidebar;