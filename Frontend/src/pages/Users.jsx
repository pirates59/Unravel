import React from "react";

const appointments = [
  { name: "Harish Ashaly", service: "In-Person", date: "13-Aug-2023 at 10:00 AM", contact: "+91 9876543210", email: "harishashaly@gmail.com" },
  { name: "Arlene McCoy", service: "In-Person", date: "13-Aug-2023 at 10:00 AM", contact: "+91 9876543210", email: "harishashaly@gmail.com" },
  { name: "Cody Fisher", service: "In-Person", date: "13-Aug-2023 at 10:00 AM", contact: "+91 9876543210", email: "harishashaly@gmail.com" },
  { name: "Esther Howard", service: "In-Person", date: "13-Aug-2023 at 10:00 AM", contact: "+91 9876543210", email: "harishashaly@gmail.com" },
  { name: "Ronald Richards", service: "In-Person", date: "13-Aug-2023 at 10:00 AM", contact: "+91 9876543210", email: "harishashaly@gmail.com" },
  // Add more appointments as needed
];

const Users = () => {
  return (
    <div className="p-6 w-full">
       <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
            <button className="bg-[#EC993D] px-6 py-2 text-white rounded-xl">Users</button>
          
        </div>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#EC993D] text-white">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Service</th>
              <th className="p-3">Date and Time</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Email</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="p-3">{appointment.name}</td>
                <td className="p-3">{appointment.service}</td>
                <td className="p-3">{appointment.date}</td>
                <td className="p-3">{appointment.contact}</td>
                <td className="p-3">{appointment.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
