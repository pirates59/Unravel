import React, { useEffect, useState } from "react";
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
  const [daysAvailable, setDaysAvailable] = useState([]); // multiple selection via toggles
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // Error states for validations
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    specialization: "",
    daysAvailable: "",
    startTime: "",
    endTime: "",
    image: "",
  });

  // Time options for dropdown (adjust as needed)
  const timeOptions = [
    "9:00 a.m.",
    "10:00 a.m.",
    "11:00 a.m.",
    "12:00 p.m.",
    "1:00 p.m.",
    "2:00 p.m.",
    "3:00 p.m.",
    "4:00 p.m.",
    "5:00 p.m.",
  ];

  // Days displayed as toggle circles (Sunday to Friday)
  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

  // Specialization options
  const specializationOptions = ["Individual Therapy", "Couple Therapy"];

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

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      name: "",
      email: "",
      specialization: "",
      daysAvailable: "",
      startTime: "",
      endTime: "",
      image: "",
    };

    // Validate name: required and not purely numeric
    if (!name.trim()) {
      newErrors.name = "*Required";
      valid = false;
    } else if (!isNaN(name)) {
      newErrors.name = "Name cannot be numeric";
      valid = false;
    }

    // Validate email: required and must contain "@"
    if (!email.trim()) {
      newErrors.email = "*Required";
      valid = false;
    } else if (!email.includes("@")) {
      newErrors.email = "Email must contain '@'";
      valid = false;
    }

    // Validate specialization: must be selected
    if (!specialization.trim()) {
      newErrors.specialization = "*Required";
      valid = false;
    }

    // Validate daysAvailable: must select at least one day
    if (!daysAvailable.length) {
      newErrors.daysAvailable = "*Required";
      valid = false;
    }

    // Validate startTime
    if (!startTime.trim()) {
      newErrors.startTime = "*Required";
      valid = false;
    }

    // Validate endTime
    if (!endTime.trim()) {
      newErrors.endTime = "*Required";
      valid = false;
    }

    // Validate image: required field
    if (!imageFile) {
      newErrors.image = "*Required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateTherapist = async () => {
    if (!validateForm()) {
      return;
    }
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("specialization", specialization);
      // Convert daysAvailable array to JSON string (adjust if your backend uses a different format)
      formData.append("daysAvailable", JSON.stringify(daysAvailable));
      formData.append("startTime", startTime);
      formData.append("endTime", endTime);
      formData.append("image", imageFile);

      const res = await axios.post("http://localhost:3001/therapists", formData);
      // Add newly created therapist to the list
      setTherapists((prev) => [...prev, res.data]);

      // Close modal and reset form + errors
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

  // Updated delete function with SweetAlert confirmation for deleting a therapist
  const handleDeleteTherapist = (id) => {
    swal({
      title: "Delete Therapist",
      text: "Are you sure you want to delete this therapist?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`http://localhost:3001/therapists/${id}`)
          .then(() => {
            swal("Deleted!", "The therapist has been deleted.", { icon: "success" });
            setTherapists((prev) => prev.filter((t) => t._id !== id));
          })
          .catch((error) => {
            console.error("Error deleting therapist:", error);
            swal("Error", "Unable to delete the therapist.", { icon: "error" });
          });
      }
    });
  };

  // Toggle day selection in daysAvailable
  const handleDayToggle = (day) => {
    if (daysAvailable.includes(day)) {
      // If day is already selected, remove it
      setDaysAvailable(daysAvailable.filter((d) => d !== day));
    } else {
      // Otherwise, add it
      setDaysAvailable([...daysAvailable, day]);
    }
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar */}
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
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              {therapist.name}
            </h2>
            <p className="text-sm text-gray-700 mb-1">{therapist.specialization}</p>
            <p className="text-sm text-gray-700 mb-1">{therapist.email}</p>

            {/* Days/time display */}
            <p className="text-sm text-gray-700 ">
              {therapist.daysAvailable &&
                JSON.parse(therapist.daysAvailable).join(", ")}{" "}
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

        {/* Plus icon card (for adding new therapist) */}
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
              <span>Name:</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.name && (
                <small className="text-red-500">{errors.name}</small>
              )}
            </label>

            {/* Email */}
            <label className="block mb-2">
              <span>Email:</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.email && (
                <small className="text-red-500">{errors.email}</small>
              )}
            </label>

            {/* Specialization (Dropdown) */}
            <label className="block mb-2">
              <span>Specialization:</span>
              <select
                value={specialization}
                onChange={(e) => setSpecialization(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select Specialization</option>
                {specializationOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.specialization && (
                <small className="text-red-500">{errors.specialization}</small>
              )}
            </label>

            {/* Days Available (Circle Toggles) */}
            <label className="block mb-2">
              <span>Days Available:</span>
              <div className="flex space-x-2 mt-2">
                {dayLabels.map((day) => {
                  const isSelected = daysAvailable.includes(day);
                  return (
                    <div
                      key={day}
                      onClick={() => handleDayToggle(day)}
                      className={`cursor-pointer w-12 h-12 rounded-full flex items-center justify-center 
                        ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              {errors.daysAvailable && (
                <small className="text-red-500 block">
                  {errors.daysAvailable}
                </small>
              )}
            </label>

            {/* Start Time (Dropdown) */}
            <label className="block mb-2">
              <span>Start time:</span>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select start time</option>
                {timeOptions.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.startTime && (
                <small className="text-red-500">{errors.startTime}</small>
              )}
            </label>

            {/* End Time (Dropdown) */}
            <label className="block mb-2">
              <span>End time:</span>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              >
                <option value="">Select end time</option>
                {timeOptions.map((time) => (
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
              <span className="text-gray-700">Image:</span>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-2 block w-full border border-gray-300 rounded px-2 py-1"
              />
              {errors.image && (
                <small className="text-red-500">{errors.image}</small>
              )}
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