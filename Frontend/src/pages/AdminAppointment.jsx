// AdminAppointment Page
import React, { useState, useEffect } from "react";
import axios from "axios";
import empty from "../assets/empty.png";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please login.");
        }

        const response = await axios.get(
          "http://localhost:3001/appointments",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Normalize response.data to an array
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

        // Map and add a formatted `date` string
        const formattedAppointments = apptsArray.map((apt) => ({
          ...apt,
          date: `${apt.year}-${String(apt.month).padStart(2, "0")}-${String(
            apt.day
          ).padStart(2, "0")}`,
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
      {/* Top bar with the 'Appointments' button */}
      <div className="flex justify-between items-center mb-6">
        <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
          Appointments
        </button>
      </div>

      {/* Table displaying appointments */}
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
                  <td className="p-3 text-[#6C757D]">{`${appointment.firstName} ${appointment.lastName}`}</td>
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
  );
};

export default AdminAppointment;
