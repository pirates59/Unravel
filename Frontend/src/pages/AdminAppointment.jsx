import React, { useEffect, useState } from "react";
import axios from "axios";
import dotIcon from "../assets/dot.png"; // Make sure the asset exists

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from backend with token
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Retrieve token from local storage
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login.");
        }
        // Make GET request with Authorization header
        const response = await axios.get("http://localhost:3001/appointments", {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;

        // Format the date properly before setting state
        const formattedAppointments = data.map(appointment => ({
          ...appointment,
          date: `${appointment.year}-${String(appointment.month).padStart(2, '0')}-${String(appointment.day).padStart(2, '0')}`
        }));

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="p-6 w-full">
      {/* Top bar with the 'Appointment' button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
            Appointments
          </button>
        </div>
      </div>
      <div className=" relative">
        <table className="w-full border-collapse">
          <thead className="bg-white text-black border-[2px] border-gray-200">
            <tr>
              <th className="p-3 font-medium text-left">Name</th>
              <th className="p-3 font-medium text-left">Service</th>
              <th className="p-3 font-medium text-left">Date</th>
              <th className="p-3 font-medium text-left">Time</th>
              <th className="p-3 font-medium text-left">Contact</th>
              <th className="p-3 font-medium text-left">Email</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment, index) => (
                <tr key={index} className="border-[1px] border-gray-200 relative">
                  <td className="p-3 text-[#6C757D]">{`${appointment.firstName} ${appointment.lastName}`}</td>
                  <td className="p-3 text-[#6C757D]">{appointment.service}</td>
                  <td className="p-3 text-[#6C757D]">{appointment.date}</td>
                  <td className="p-3 text-[#6C757D]">{appointment.time}</td>
                  <td className="p-3 text-[#6C757D]">{appointment.contact}</td>
                  <td className="p-3 text-[#6C757D]">{appointment.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-3 text-center text-gray-500">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminAppointment;
