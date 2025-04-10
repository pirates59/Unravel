import React, { useState, useEffect } from "react";
import axios from "axios";
import plusIcon from "../assets/pluss.png";
import swal from "sweetalert";

const AdminTherapist = () => {
  const [therapists, setTherapists] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // Form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [daysAvailable, setDaysAvailable] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Error states
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    specialization: "",
    daysAvailable: "",
    startTime: "",
    endTime: "",
    image: "",
  });

  const timeOptions = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00  PM"];
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri","Sat"];
  const specializationOptions = ["Individual Therapy", "Couple Therapy"];

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

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      specialization: "",
      daysAvailable: "",
      startTime: "",
      endTime: "",
      image: "",
    };

    if (!name.trim()) {
      newErrors.name = "*Required";
      valid = false;
    } else if (!isNaN(name)) {
      newErrors.name = "Name cannot be numeric";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "*Required";
      valid = false;
    } else if (!email.includes("@")) {
      newErrors.email = "Email must contain '@'";
      valid = false;
    }

    if (!specialization.trim()) {
      newErrors.specialization = "*Required";
      valid = false;
    }

    if (daysAvailable.length === 0) {
      newErrors.daysAvailable = "*Required";
      valid = false;
    }

    if (!startTime.trim()) {
      newErrors.startTime = "*Required";
      valid = false;
    }

    if (!endTime.trim()) {
      newErrors.endTime = "*Required";
      valid = false;
    }

    if (!imageFile) {
      newErrors.image = "*Required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateTherapist = async () => {
    if (!validateForm()) return;

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("specialization", specialization);
      formData.append("daysAvailable", JSON.stringify(daysAvailable));
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("image", imageFile);

      const res = await axios.post("http://localhost:3001/therapists", formData);
      setTherapists(prev => [...prev, res.data]);

      // Reset
      setShowModal(false);
      setName("");
      setEmail("");
      setSpecialization("");
      setDaysAvailable([]);
      setStartTime("");
      setEndTime("");
      setImageFile(null);
      setErrors({
        name: "",
        email: "",
        specialization: "",
        daysAvailable: "",
        startTime: "",
        endTime: "",
        image: "",
      });
    } catch (error) {
      console.error("Error creating therapist:", error);
    }
  };

  const handleDeleteTherapist = id => {
    swal({
      title: "Delete Therapist",
      text: "Are you sure you want to delete this therapist?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(willDelete => {
      if (willDelete) {
        axios
          .delete(`http://localhost:3001/therapists/${id}`)
          .then(() => {
            swal("Deleted!", "The therapist has been deleted.", { icon: "success" });
            setTherapists(prev => prev.filter(t => t._id !== id));
          })
          .catch(err => {
            console.error("Error deleting therapist:", err);
            swal("Error", "Unable to delete the therapist.", { icon: "error" });
          });
      }
    });
  };

  const handleDayToggle = day => {
    setDaysAvailable(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
          Therapists
        </button>
      </div>

      {/* Therapist grid */}
      <div className="grid grid-cols-4 gap-6">
        {therapists.map(therapist => (
          <div
            key={therapist._id}
            className="bg-gray-100 rounded-lg shadow p-4 flex flex-col items-center"
          >
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
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {therapist.name}
            </h2>
            <p className="text-sm text-gray-700 mb-1">{therapist.specialization}</p>
            <p className="text-sm text-gray-700 mb-1">{therapist.email}</p>
            <p className="text-sm text-gray-700">
              {therapist.daysAvailable &&
                (Array.isArray(therapist.daysAvailable)
                  ? therapist.daysAvailable.join(", ")
                  : JSON.parse(therapist.daysAvailable).join(", "))
              }{" "}
              {therapist.startTime && therapist.endTime && (
                <> {therapist.startTime} to {therapist.endTime}</>
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

        {/* Add new */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-gray-100 w-full h-[320px] rounded-lg shadow p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
        >
          <img src={plusIcon} alt="Add" className="w-10 h-10 mb-2" />
          <span className="text-gray-600 font-medium">Add Therapist</span>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-md w-full relative">
            <h2 className="text-xl font-semibold mb-4">Add New Therapist</h2>

            {/* Name */}
            <label className="block mb-2">
              <span>Name:</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.name && <small className="text-red-500">{errors.name}</small>}
            </label>

            {/* Email */}
            <label className="block mb-2">
              <span>Email:</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.email && <small className="text-red-500">{errors.email}</small>}
            </label>

            {/* Specialization */}
            <label className="block mb-2">
              <span>Specialization:</span>
              <select
                value={specialization}
                onChange={e => setSpecialization(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select Specialization</option>
                {specializationOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <small className="text-red-500">{errors.specialization}</small>
              )}
            </label>

            {/* Days */}
            <label className="block mb-2">
              <span>Days Available:</span>
              <div className="flex space-x-2 mt-2">
                {dayLabels.map(day => {
                  const sel = daysAvailable.includes(day);
                  return (
                    <div
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center ${
                        sel ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              {errors.daysAvailable && (
                <small className="text-red-500 block">{errors.daysAvailable}</small>
              )}
            </label>

            {/* Start/End Time */}
            <label className="block mb-2">
              <span>Start time:</span>
              <select
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select start time</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.startTime && (
                <small className="text-red-500">{errors.startTime}</small>
              )}
            </label>

            <label className="block mb-2">
              <span>End time:</span>
              <select
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select end time</option>
                {timeOptions.map(time => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.endTime && (
                <small className="text-red-500">{errors.endTime}</small>
              )}
            </label>

            {/* Image */}
            <label className="block mb-4">
              <span>Image:</span>
              <input
                type="file"
                onChange={e => setImageFile(e.target.files[0])}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.image && <small className="text-red-500">{errors.image}</small>}
            </label>

            {/* Actions */}
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
