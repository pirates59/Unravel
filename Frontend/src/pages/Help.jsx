// Help Page
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

  // Initiate phone call
  const callNumber = () => {
    window.location.href = "tel:1166";
  };

  return (
   
      <div className="p-4 flex flex-col h-[90%]">
      <button className="mb-[30px]" onClick={() => window.history.back()}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

       {/* Main Content Card */}
       <div className="bg-gray-100 p-4 rounded-lg text-center shadow-md w-[80%] h-[95%]">
      
        <div className="flex flex-col items-center mb-6">
          <img src={siren} alt="Siren" className="w-16 h-16 mb-3" />
          <h2 className="text-3xl font-bold text-gray-800">Are you in Crisis?</h2>
        </div>

        <p className="text-gray-700 mb-8 text-lg">
          If you or someone you know is in a crisis and potentially at risk of self-harm or suicide, 
          <br />
          it is important to seek <span className="font-semibold">Professional Help.</span>
        </p>

        {/* Buttons */}
        <button
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg text-lg transition-colors duration-200 w-[500px] mb-4 mt-6"
          onClick={handleEmergencyClick}
        >
          Emergency Now
        </button>
        
        <NavLink to="/service">
          <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg text-lg transition-colors duration-200 w-[500px]">
            Helpline
          </button>
        </NavLink>
      </div>

    {/* Overlay (Modal) for Emergency Now */}
    {showEmergencyOverlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-[240px] p-4 rounded-md shadow-lg flex flex-col items-center">
            <div className="flex items-center mb-4 space-x-2">
              <span className="text-gray-700 font-semibold mr-8">Phone: 1166</span>

              {/* Copy button */}
              <button onClick={copyPhoneNumber}>
                <img src={copy} alt="Copy" className="w-5 h-5" />
              </button>

              <button onClick={callNumber}>
                <img src={call} alt="Call" className="w-5 h-5" />
              </button>
            </div>
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

