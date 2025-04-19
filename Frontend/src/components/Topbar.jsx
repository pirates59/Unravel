//Topbar Component
import React from "react";
import logo from "../assets/logo.png";

const Topbar = () => {
  return (
    <div className="bg-[#EC993D] flex items-center justify-center px-8 py-4">
    <img src={logo}  alt="Unravel Logo" className="h-14" />
    </div>
  );
};

export default Topbar;
