import React, { useState } from "react";
import leftarrow from "../assets/leftarrow.png";
import siren from "../assets/siren.png";
import call from "../assets/call.png";
import copy from "../assets/copy.png";
import { NavLink} from "react-router-dom";

const Help = () => {
  const [showEmergencyOverlay, setShowEmergencyOverlay] = useState(false);

  // Handler to show the overlay
  const handleEmergencyClick = () => {
    setShowEmergencyOverlay(true);
  };

  // Handler to hide the overlay
  const handleCloseOverlay = () => {
    setShowEmergencyOverlay(false);
  };

  // Copy phone number to clipboard
  const copyPhoneNumber = () => {
    navigator.clipboard.writeText("1166");
    alert("Phone number copied!");
  };

  // Initiate phone call (for devices that support tel links)
  const callNumber = () => {
    window.location.href = "tel:1166";
  };

  return (
    <div className="flex flex-col">
      {/* Back Button */}
      <button className="mb-[30px] self-start">
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      {/* Main Content Card */}
      <div className="bg-[#EC993D] p-10 rounded-xl text-center w-[80%] h-[440px] shadow-lg flex flex-col items-center">
        {/* Siren and Heading */}
        <div className="flex flex-col items-center mb-4">
          <img src={siren} alt="Siren" className="w-12 h-12 mb-2" />
          <div className="text-2xl text-white font-bold">Are you in Crisis?</div>
        </div>

        <p className="text-white mb-6 font-semibold">
          If you or someone you know is in a crisis and potentially at risk of
          self-harm or suicide, it is important to seek professional help immediately.
        </p>

        {/* Buttons */}
        <button
          className="bg-red-600 text-white px-6 py-2 rounded-md text-lg w-[50%] mb-4"
          onClick={handleEmergencyClick}
        >
          Emergency Now
        </button>
        
        <NavLink to="/service"> 
        <button className="bg-green-600 text-white px-6 py-2 rounded-md text-lg w-[100%] mr-[330px]">
          Helpline
        </button>
        </NavLink>
      </div>

      {/* Overlay (Modal) for Emergency Now */}
      {showEmergencyOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[240px] p-4 rounded-md shadow-lg flex flex-col items-center">
            {/* Phone Number + Copy + Call in one row */}
            <div className="flex items-center mb-4 space-x-2">
              <span className="text-gray-700 font-semibold mr-8">Phone: 1166</span>

              {/* Copy button */}
              <button onClick={copyPhoneNumber}>
                <img src={copy} alt="Copy" className="w-5 h-5" />
              </button>

              {/* Call button (directly next to copy icon) */}
              <button onClick={callNumber}>
                <img src={call} alt="Call" className="w-5 h-5" />
              </button>
            </div>

            {/* OK Button below the icons */}
            <button
              onClick={handleCloseOverlay}
                 className="text-black px-4 py-2 rounded ml-40"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Help;
