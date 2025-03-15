import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import userlogo from "../assets/userlogo.png";
import appointmentIcon from "../assets/appointment.png";
import setting from "../assets/setting.png";
import logout from "../assets/logout.png";

const Therapist= () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const therapistUsername = localStorage.getItem("username");

  // Fetch appointments from backend and filter for the current therapist
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:3001/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();

        // Filter appointments for the logged-in therapist (assuming each appointment has a "therapist" property)
        const userAppointments = data.filter(
          (appointment) => appointment.therapist === therapistUsername
        );

        // Format the date (assuming appointment.year, appointment.month, and appointment.day exist)
        const formattedAppointments = userAppointments.map((appointment) => ({
          ...appointment,
          date: `${appointment.year}-${String(appointment.month).padStart(2, "0")}-${String(appointment.day).padStart(2, "0")}`
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [therapistUsername]);

  const handleLogout = () => {
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-[#EC993D] text-white flex flex-col p-5">
        {/* Logo */}
        <div className="mb-10">
          <img
            src={userlogo}
            alt="Logo"
            className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]"
          />
        </div>

        {/* Menu Items */}
        <nav className="flex flex-col space-y-6">
          <NavLink to="/therapist">
            <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
              <img
                src={appointmentIcon}
                alt="Appointment"
                className="w-5 h-5"
              />
              <span>Appointment</span>
            </div>
          </NavLink>
        </nav>

        {/* Settings and Logout */}
        <div className="mt-auto flex flex-col space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={setting} alt="Settings" className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
          >
            <img src={logout} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      {/* Main Content (Appointment Table) */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="p-6 w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex space-x-6">
              <button className="bg-[#EC993D] px-6 py-2 text-white rounded-xl">
                Appointment
              </button>
            </div>
          </div>
          <div className="overflow-x-auto bg-white shadow-md rounded-lg">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#EC993D] text-white">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Service</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Time</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3">Email</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length > 0 ? (
                  appointments.map((appointment, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-100"
                    >
                      <td className="p-3">
                        {`${appointment.firstName} ${appointment.lastName}`}
                      </td>
                      <td className="p-3">{appointment.service}</td>
                      <td className="p-3">{appointment.date}</td>
                      <td className="p-3">{appointment.time}</td>
                      <td className="p-3">{appointment.contact}</td>
                      <td className="p-3">{appointment.email}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="p-3 text-center text-gray-500"
                    >
                      No appointments found.
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

export default Therapist;
