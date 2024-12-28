import React from "react";
import service from "../assets/service.png";
import calendar from "../assets/calendar.png";
import user from "../assets/user.png";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png"; // Replace with your illustration path
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

const ServiceSelection = () => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
        {/* Left Section */}
        <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg">
         {/* Sidebar */}
<div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
  <ul className="space-y-3">
    {/* Service Selection */}
    <li className="relative flex items-center bg-white rounded-lg p-3">
      <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-[#4BB543] rounded-full border-2 border-white shadow-lg"></div>
      <div className="flex items-center">
        <img src={service} alt="Service Icon" className="h-5 w-5" />
        <span className="ml-2 font-semibold text-sm">Service Selection</span>
      </div>
    </li>
    {/* Date and Time */}
    <li className="relative flex items-center bg-white rounded-lg p-3 ">
      <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
      <div className="flex items-center">
        <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
        <span className="ml-2 font-semibold text-sm">Date and Time</span>
      </div>
    </li>
    {/* Your Information */}
    <li className="relative flex items-center bg-white rounded-lg p-3 ">
      <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
      <div className="flex items-center">
        <img src={user} alt="User Icon" className="h-5 w-5" />
        <span className="ml-2 font-semibold text-sm">Your Information</span>
      </div>
    </li>
  </ul>
</div>


          {/* Form Section */}
<div className="flex-1 p-6  flex flex-col justify-between">
  <div>
    <div className="flex justify-between items-center ">
      <h2 className="text-lg font-bold mb-4">Service Selection</h2>
      <img src={close} alt="Service Icon" className="h-5 w-5 mb-4" />
    </div>
    <form>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">Service:</label>
        <select
          className="w-full p-2 border rounded-lg text-sm"
          name="service"
          id="service"
        >
          <option>Select Service</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 font-medium text-sm">
          Therapist:
        </label>
        <select
          className="w-full p-2 border rounded-lg text-sm"
          name="therapist"
          id="therapist"
        >
          <option>Select Therapist</option>
        </select>
      </div>
    </form>
  </div>

  {/* Button at the Bottom */}
  <div className="flex justify-end">
    <button
      type="submit"
      className="bg-green-500 text-white py-1 px-4 h-8 rounded-lg font-semibold text-sm"
    >
      Continue
    </button>
  </div>
</div>
</div>


        {/* Right Image Section */}
        <div className="ml-16 mt-4">
          <img
            src={appoint}
            alt="Appointment Illustration"
            className="h-[480px]"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceSelection;
