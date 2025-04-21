// Therapist Appointments Component
import React, { useState, useEffect } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";
import userlogo from "../assets/userlogo.png";
import appointmentIcon from "../assets/appointment.png";
import logout from "../assets/logout.png";
import empty from "../assets/empty.png";

const TherapistAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        const currentUser = localStorage.getItem("username");
        const currentRole = localStorage.getItem("role");

        if (!token) {
          throw new Error("No token found. Please login.");
        }

        const response = await axios.get(
          "http://localhost:3001/appointments",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Normalize response data to an array
        const payload = response.data;
        let apptsArray = [];
        if (Array.isArray(payload)) {
          apptsArray = payload;
        } else if (Array.isArray(payload.data)) {
          apptsArray = payload.data;
        } else if (Array.isArray(payload.appointments)) {
          apptsArray = payload.appointments;
        } else {
          console.error("Unexpected appointments response format:", payload);
          return;
        }

        // Format date on each appointment object
        let formattedAppointments = apptsArray.map((apt) => ({
          ...apt,
          date: `${apt.year}-${String(apt.month).padStart(2, '0')}-${String(
            apt.day
          ).padStart(2, '0')}`
        }));

        // If user is a doctor, filter by therapist name
        if (currentRole === "doctor" && currentUser) {
          formattedAppointments = formattedAppointments.filter(
            (apt) => apt.therapist.toLowerCase() === currentUser.toLowerCase()
          );
        }

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#EC993D] text-white flex flex-col p-5">
        <div className="mb-10">
          <img
            src={userlogo}
            alt="Logo"
            className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]"
          />
        </div>
        <nav className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={appointmentIcon} alt="Appointments" className="w-5 h-5" />
            <NavLink to="/therapist" className="flex-1">
              Appointments
            </NavLink>
          </div>
        </nav>
        <div className="mt-auto flex flex-col">
          <div
            onClick={handleLogout}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
          >
            <img src={logout} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
              Appointments
            </button>
          </div>

          <div className="relative">
            <table className="w-full border-collapse">
              <thead className="bg-white text-black border-[2px] border-gray-200">
                <tr>
                  <th className="p-3 font-medium text-left">Name</th>
                  <th className="p-3 font-medium text-left">Service</th>
                  <th className="p-3 font-medium text-left">Therapist</th>
                  <th className="p-3 font-medium text-left">Date</th>
                  <th className="p-3 font-medium text-left">Time</th>
                  <th className="p-3 font-medium text-left">Contact</th>
                  <th className="p-3 font-medium text-left">Email</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, idx) => (
                    <tr
                      key={idx}
                      className="border-[1px] border-gray-200 relative"
                    >
                      <td className="p-3 text-[#6C757D]">
                        {`${appointment.firstName} ${appointment.lastName}`}
                      </td>
                      <td className="p-3 text-[#6C757D]">{appointment.service}</td>
                      <td className="p-3 text-[#6C757D]">{appointment.therapist}</td>
                      <td className="p-3 text-[#6C757D]">{appointment.date}</td>
                      <td className="p-3 text-[#6C757D]">{appointment.time}</td>
                      <td className="p-3 text-[#6C757D]">{appointment.contact}</td>
                      <td className="p-3 text-[#6C757D]">{appointment.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-3 text-center text-gray-500">
                      <div className="flex flex-col justify-center items-center mt-[100px]">
                        <img
                          src={empty}
                          alt="No appointments available"
                          className="w-[180px] h-[180px]"
                        />
                        No appointments found
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TherapistAppointments;
