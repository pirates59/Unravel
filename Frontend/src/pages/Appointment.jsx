import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
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

  // We use useNavigate for redirection
  const navigate = useNavigate();

  // Load temporary data from localStorage on page load
  useEffect(() => {
    const savedData = localStorage.getItem("appointmentFormData");
    const temporaryBooking = JSON.parse(localStorage.getItem("temporaryBooking"));

    if (savedData) {
      setFormData(JSON.parse(savedData));
    }

    if (temporaryBooking) {
      // Parse the date correctly, adjusting for timezone
      const date = new Date(temporaryBooking.date);
      const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      setSelectedDate(localDate.toISOString().split("T")[0]); // Store as YYYY-MM-DD
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

    // Validate required fields
    if (!firstName || !lastName || !contact || !email || !selectedDate || !selectedTime) {
      setError("All fields and the selected date and time are required.");
      setMessage("");
      return;
    }

    // Validate contact number (10 digits)
    if (!/^\d{10}$/.test(contact)) {
      setError("Contact must be a valid 10-digit number.");
      setMessage("");
      return;
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Email must be valid.");
      setMessage("");
      return;
    }

    // Ensure service and therapist are chosen
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
        date: selectedDate,
        time: selectedTime,
        service,
        therapist,
      };

      await submitInformation(finalData);

      // If the appointment is booked successfully, show SweetAlert
      Swal.fire({
        title: "Appointment Booked!",
        text: "Your appointment has been successfully booked!",
        icon: "success",
        confirmButtonText: "OK",
      }).then(() => {
        // Clear form and localStorage
        setFormData({ firstName: "", lastName: "", contact: "", email: "" });
        setSelectedDate("");
        setSelectedTime("");
        localStorage.clear();

        // Redirect to home page
        navigate("/");
      });

      setError("");
    } catch (err) {
      setError(`Error booking the appointment: ${err.message}`);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
        <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg">
          <div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
            <ul className="space-y-3">
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={service} alt="Service Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Service Selection</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Date and Time</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-[#4BB543] rounded-full border-1 shadow-lg"></div>
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
                    <img
                      src={leftarrow}
                      alt="Back Icon"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </NavLink>
                  <h2 className="text-lg font-bold">Your Information</h2>
                </div>
                <NavLink to="/landing">
                  <img src={close} alt="Close Icon" className="h-5 w-5" />
                </NavLink>
              </div>

              <div>
                {/* First Name and Last Name in one row */}
                <div className="mb-4 flex gap-4">
                  <div className="w-1/2">
                    <label className="block mb-1 font-medium text-sm">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Enter your first name"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-1 font-medium text-sm">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Enter your last name"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Email and Contact in one row below */}
                <div className="mb-4 flex gap-4">
                  <div className="w-1/2">
                    <label className="block mb-1 font-medium text-sm">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg text-sm"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block mb-1 font-medium text-sm">
                      Contact
                    </label>
                    <input
                      type="text"
                      name="contact"
                      placeholder="Enter your contact number"
                      value={formData.contact}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-lg text-sm"
                    />
                  </div>
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
          <img src={appoint} alt="Illustration" className="h-[480px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Appointment;
