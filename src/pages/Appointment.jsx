import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import service from "../assets/service.png";
import calendar from "../assets/calendar.png";
import user from "../assets/user.png";
import leftarrow from "../assets/leftarrow.png";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

// Function to submit the appointment information
const submitInformation = async (formData) => {
  try {
    const response = await fetch("http://localhost:3001/book", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to confirm the appointment.");
    }

    const result = await response.json();
    return result;
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
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load temporary data from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem("appointmentFormData");
    const temporaryBooking = JSON.parse(localStorage.getItem("temporaryBooking"));

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    if (temporaryBooking) {
      setSelectedDate(new Date(temporaryBooking.date).toDateString());
      setSelectedTime(temporaryBooking.time);
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("appointmentFormData", JSON.stringify(formData));
  }, [formData]);

  // Handle input field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const { firstName, lastName, contact, email } = formData;
  
    if (!firstName || !lastName || !contact || !email || !selectedDate || !selectedTime) {
      setError("All fields and the selected date and time are required.");
      setMessage("");
      return;
    }
  
    if (!/^\d{10}$/.test(contact)) {
      setError("Contact must be a valid 10-digit number.");
      setMessage("");
      return;
    }
  
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email must be valid.");
      setMessage("");
      return;
    }
  
    const formattedDate = new Date(selectedDate).toISOString().split("T")[0];
  
    const service = localStorage.getItem("selectedService");
    const therapist = localStorage.getItem("selectedTherapist");
  
    if (!service || !therapist) {
      setError("Service and therapist are required.");
      setMessage("");
      return;
    }
  
    try {
      const finalData = {
        ...formData,
        date: formattedDate,
        time: selectedTime,
        service,
        therapist,
      };
  
      const response = await submitInformation(finalData);
  
      setMessage("Appointment booked successfully!");
      setError("");
  
      // Clear all fields and localStorage
      setFormData({ firstName: "", lastName: "", contact: "", email: "" });
      setSelectedDate("");
      setSelectedTime("");
      localStorage.clear(); // Clear all keys from localStorage
  
      
    } catch (err) {
      setError(`Error booking the appointment: ${err.message}`);
      setMessage("");
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
        <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg mr-16">
          <div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
            <ul className="space-y-3">
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
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
                <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-[#4BB543] rounded-full border-2 border-white shadow-lg"></div>
                <div className="flex items-center">
                  <img src={user} alt="User Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Your Information</span>
                </div>
              </li>
            </ul>
          </div>

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

              <div className="grid grid-cols-2 gap-3 mt-6">
                <div>
                  <label className="block mb-2 text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Contact</label>
                  <input
                    type="text"
                    name="contact"
                    placeholder="Enter your contact number"
                    value={formData.contact}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 border rounded-lg text-sm"
                  />
                </div>
              </div>
              {error && <p className="text-red-500 mt-2">{error}</p>}
              {message && <p className="text-green-500 mt-4">{message}</p>}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
        <div className="ml-16 mt-4">
          <img src={appoint} alt="Illustration" className="h-[400px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Appointment;