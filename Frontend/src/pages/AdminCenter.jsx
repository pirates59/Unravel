// AdminCenter Page
import React, { useEffect, useState } from "react";
import axios from "axios";
import plusIcon from "../assets/pluss.png";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const AdminCenter = () => {
  const [centers, setCenters] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [centerName, setCenterName] = useState("");
  const [centerImage, setCenterImage] = useState(null);

  // Fetch centers from API
  const fetchCenters = async () => {
    try {
      const res = await axios.get("http://localhost:3001/centers");
      setCenters(res.data);
    } catch (error) {
      console.error("Error fetching centers:", error);
    }
  };

  useEffect(() => {
    fetchCenters();
  }, []);

  // Create a new center
  const handleCreateCenter = async () => {
    try {
      const formData = new FormData();
      formData.append("name", centerName);
      if (centerImage) {
        formData.append("image", centerImage);
      }
      const res = await axios.post("http://localhost:3001/centers", formData);
      setCenters([...centers, res.data]);
      setShowModal(false);
      setCenterName("");
      setCenterImage(null);
    } catch (error) {
      console.error("Error creating center:", error);
    }
  };

  // Delete a center after confirmation using SweetAlert
  const handleDelete = (centerId) => {
    swal({
      title: "Delete Center",
      text: "Are you sure you want to delete this center?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(`http://localhost:3001/centers/${centerId}`)
          .then(() => {
            swal("Deleted!", "The center has been deleted.", { icon: "success" });
            setCenters(centers.filter((center) => center._id !== centerId));
          })
          .catch((error) => {
            console.error("Error deleting center:", error);
            swal("Error", "Unable to delete the center.", { icon: "error" });
          });
      }
    });
  };

  return (
    <div className="p-6 w-full">
      {/* Top bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] px-6 py-2 text-white rounded-lg">
            Center
          </button>
        </div>
      </div>

      {/* Grid of center cards */}
      <div className="grid grid-cols-4 gap-6">
        {centers.map((center) => (
          <div
            key={center._id}
            className="bg-[#E5E7E9] rounded-lg shadow p-4 flex flex-col items-end"
          >
            <h2 className="font-semibold text-[#EC993D] mb-2">{center.name}</h2>
            <img
              src={center.image ? `http://localhost:3001/${center.image}` : "http://localhost:3001/uploads/default.png"}
              alt={center.name}
              className="w-56 h-52 object-cover rounded mb-3"
            />
            <div className="flex items-center gap-4 justify-end w-full">
              <button
                onClick={() => handleDelete(center._id)}
                className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        
        {/* Create Center Card */}
        <div
          onClick={() => setShowModal(true)}
          className="bg-gray-100 w-[283px] h-[320px] rounded-lg shadow p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-md transition"
        >
          <img
            src={plusIcon}
            alt="Add"
            className="w-[50px] h-[50px] text-gray-400 mb-2"
          />
          <span className="text-gray-600 font-medium">Create a Center</span>
        </div>
      </div>

      {/* Modal for creating a new center */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full relative">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-black hover:text-gray-700 text-3xl font-semibold"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Create a New Center</h2>
            <label className="block mb-3">
              <span className="text-gray-700">Center Name:</span>
              <input
                type="text"
                value={centerName}
                onChange={(e) => setCenterName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                placeholder="Enter center name"
              />
            </label>
            <label className="block mb-3">
              <span className="text-gray-700">Center Image:</span>
              <input
                type="file"
                onChange={(e) => setCenterImage(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
              />
            </label>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCenter}
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

export default AdminCenter;