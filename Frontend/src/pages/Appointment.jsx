import React, { useState } from "react";
import service from "../assets/service.png";
import calendar from "../assets/calendar.png";
import { NavLink } from "react-router-dom";
import user from "../assets/user.png";
import leftarrow from "../assets/leftarrow.png";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png"; // Replace with your illustration path
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

// API Function
const submitInformation = async (formData) => {
  try {
    const response = await fetch("http://localhost:3001/information", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Failed to submit the information. Please try again.");
    }

    const result = await response.json();
    return result; // Example: { message: "Success", success: true }
  } catch (error) {
    throw new Error(error.message || "An unexpected error occurred.");
  }
};

const Appointment = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, contact, email } = formData;

    // Validate inputs
    if (!firstName || !lastName || !contact || !email) {
      setError("All fields are required.");
      setMessage("");
      return;
    }
    if (!/^[\d]{10}$/.test(contact)) {
      setError("Contact must be a valid 10-digit number.");
      setMessage("");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email must be valid.");
      setMessage("");
      return;
    }

    try {
      const response = await submitInformation(formData);
      setMessage("Appointment booked successfully!"); // Success message
      setError("");
      setFormData({ firstName: "", lastName: "", contact: "", email: "" });
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
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
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-[#4BB543] rounded-full border-2 border-white shadow-lg"></div>
                <div className="flex items-center">
                  <img src={service} alt="Service Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Service Selection</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Date and Time</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
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
                <NavLink to="/date">
                    <img src={leftarrow} alt="Back Icon" className="h-4 w-4 cursor-pointer" />
                  </NavLink>
                  <h2 className="text-lg font-bold">Your Information</h2>
                </div>
                <img src={close} alt="Close Icon" className="h-5 w-5" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">First Name:</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Last Name:</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Contact:</label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="Enter contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">Email:</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {message && <p className="text-green-500 mt-4 p-3 bg-green-100 rounded-lg text-center">{message}</p>}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
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
