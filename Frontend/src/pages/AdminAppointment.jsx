import React, { useState, useEffect } from "react";

const AdminAppointment = () => {
  const [appointments, setAppointments] = useState([]);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch("http://localhost:3001/appointments");
        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }
        const data = await response.json();
        
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
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="p-3">{`${appointment.firstName} ${appointment.lastName}`}</td>
                  <td className="p-3">{appointment.service}</td>
                  <td className="p-3">{appointment.date}</td>
                  <td className="p-3">{appointment.time}</td>
                  <td className="p-3">{appointment.contact}</td>
                  <td className="p-3">{appointment.email}</td>
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
