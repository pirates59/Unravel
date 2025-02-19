import React from "react";
import leftarrow from "../assets/leftarrow.png";
import icon from "../assets/icon.png";
import siren from "../assets/siren.png";
import { NavLink } from "react-router-dom";

const Help = () => {
  return (
    <div className="flex flex-col ">
      {/* Back Button */}
      <button className="mb-[30px] self-start">
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>

      <div className="bg-[#EC993D] p-10 rounded-xl text-center w-[80%] h-[440px] shadow-lg flex flex-col items-center">
        {/* Centered Siren Image and Text */}
        <div className="flex flex-col items-center mb-4">
          <img src={siren} alt="Siren" className="w-12 h-12 mb-2" />
          <div className="text-2xl text-white font-bold">Are you in Crisis?</div>
        </div>

        <p className="text-white mb-6 font-semibold">
          If you or someone you know is in a crisis and potentially at risk of self-harm or suicide, 
          it is important to seek professional help immediately.
        </p>

        {/* Buttons */}
        <button className="bg-red-600 text-white px-6 py-2 rounded-md text-lg w-[55%] mb-4">
          Emergency Now
        </button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-md text-lg w-[55%]">
          Helpline
        </button>
      </div>
    </div>
  );
};

export default Help;
