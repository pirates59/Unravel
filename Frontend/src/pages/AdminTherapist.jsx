// src/components/AdminTherapist.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import plusIcon from "../assets/pluss.png";

const AdminTherapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form fields for creating a new therapist
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [daysAvailable, setDaysAvailable] = useState(""); // can store comma-separated
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Fetch therapists on mount
  useEffect(() => {
    fetchTherapists();
  }, []);

  const fetchTherapists = async () => {
    try {
      const res = await axios.get("http://localhost:3001/therapists");
      setTherapists(res.data);
    } catch (error) {
      console.error("Error fetching therapists:", error);
    }
  };

  const handleCreateTherapist = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("specialization", specialization);
      formData.append("daysAvailable", daysAvailable); 
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.post("http://localhost:3001/therapists", formData);
      // Add newly created therapist to the list
      setTherapists((prev) => [...prev, res.data]);
      // Close modal and reset form
      setShowModal(false);
      setName("");
      setEmail("");
      setSpecialization("");
      setDaysAvailable("");
      setStartTime("");
      setEndTime("");
      setImageFile(null);
    } catch (error) {
      console.error("Error creating therapist:", error);
    }
  };

  const handleDeleteTherapist = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/therapists/${id}`);
      setTherapists((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error("Error deleting therapist:", error);
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar with the 'Appointment' button */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
           Therapists
          </button>
        </div>
      </div>

      {/* Grid of therapist cards */}
      <div className="grid grid-cols-4 gap-6">
        {therapists.map((therapist) => (
          <div
            key={therapist._id}
            className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center"
          >
            {/* Therapist image (circular) */}
            <div className="w-28 h-28 mb-3">
              <img
                src={
                  therapist.image
                    ? `http://localhost:3001/${therapist.image}`
                    : "https://via.placeholder.com/150?text=No+Image"
                }
                alt={therapist.name}
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">
              {therapist.name}
            </h2>
            <p className="text-sm text-gray-500">{therapist.specialization}</p>
            <p className="text-sm text-gray-500">{therapist.email}</p>

            {/* Days/time display */}
            <p className="text-sm text-gray-600 mt-2">
              {therapist.daysAvailable && therapist.daysAvailable.join(", ")}{" "}
              {therapist.startTime && therapist.endTime && (
                <>
                 
                  {therapist.startTime} to {therapist.endTime}
                </>
              )}
            </p>

            <button
              onClick={() => handleDeleteTherapist(therapist._id)}
              className="mt-3 bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}

        {/* Plus icon card */}
        {/* You can conditionally show this only if therapists.length === 0, 
            but typically you'd keep it so admin can add more anytime */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-gray-100 w-full h-[320px] rounded-lg shadow p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
        >
          <img
            src={plusIcon}
            alt="Add"
            className="w-10 h-10 text-gray-400 mb-2"
          />
          <span className="text-gray-600 font-medium">Add Therapist</span>
        </div>
      </div>

      {/* Modal for creating a new therapist */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <h2 className="text-xl font-semibold mb-4">Add New Therapist</h2>

            {/* Name */}
            <label className="block mb-2">
              <span className="text-gray-700">Name:</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>

            {/* Email */}
            <label className="block mb-2">
              <span className="text-gray-700">Email:</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>

            {/* Specialization */}
            <label className="block mb-2">
              <span className="text-gray-700">Specialization:</span>
              <input
                type="text"
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>

            {/* Days Available */}
            <label className="block mb-2">
              <span className="text-gray-700">Days Available:</span>
              <input
                type="text"
                value={daysAvailable}
                onChange={(e) => setDaysAvailable(e.target.value)}
                placeholder="e.g. Sun, Mon"
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
              <small className="text-gray-500">
                Enter days separated by commas
              </small>
            </label>

            {/* Start Time */}
            <label className="block mb-2">
              <span className="text-gray-700">Start Time:</span>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="e.g. 10:00 am"
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>

            {/* End Time */}
            <label className="block mb-2">
              <span className="text-gray-700">End Time:</span>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="e.g. 1:00 pm"
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>

            {/* Image */}
            <label className="block mb-4">
              <span className="text-gray-700">Image:</span>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTherapist}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTherapist;
