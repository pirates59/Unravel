import React, { useState } from "react";
import service from "../assets/service.png";
import calendar from "../assets/calendar.png";
import user from "../assets/user.png";
import leftarrow from "../assets/leftarrow.png";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png"; // Replace with your illustration path
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

const Appointment = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");

  const handleConfirm = () => {
    alert(
      `First Name: ${firstName}\nLast Name: ${lastName}\nContact: ${contact}\nEmail: ${email}`
    );
  };

  return (
    <div className="flex flex-col h-screen">
  <Topbar />
  <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
    {/* Left Section */}
    <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg mr-16">
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
          <li className="relative flex items-center bg-white rounded-lg p-3">
            <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
            <div className="flex items-center">
              <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
              <span className="ml-2 font-semibold text-sm">Date and Time</span>
            </div>
          </li>
          {/* Your Information */}
          <li className="relative flex items-center bg-white rounded-lg p-3">
            <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
            <div className="flex items-center">
              <img src={user} alt="User Icon" className="h-5 w-5" />
              <span className="ml-2 font-semibold text-sm">Your Information</span>
            </div>
          </li>
        </ul>
      </div>

      {/* Form Section */}
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3">
              <img src={leftarrow} alt="Back Icon" className="h-4 w-4" />
              <h2 className="text-lg font-bold">Your Information</h2>
            </div>
            <img src={close} alt="Close Icon" className="h-5 w-5" />
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">First Name:</label>
              <input
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Last Name:</label>
              <input
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Contact:</label>
              <input
                type="text"
                placeholder="Enter contact number"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Email:</label>
              <input
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end mt-6">
          <button
            onClick={handleConfirm}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
          >
            Confirm
          </button>
          <button className="bg-red-500 text-white px-6 py-2 ml-4 rounded-lg font-semibold hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>

    {/* Right Image Section */}
    <div className="ml-16 mt-4">
      <img src={appoint} alt="Illustration" className="h-[400px]" />
    </div>
  </div>
  <Footer />
</div>

  );
};

export default Appointment;
