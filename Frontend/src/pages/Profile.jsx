// Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import uploadDefault from '../assets/upload.jpg';

function Profile() {
  const [image, setImage] = useState(uploadDefault);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect to login if no token exists
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const objectUrl = URL.createObjectURL(selectedFile);
      setFile(selectedFile);
      setImage(objectUrl);
    }
  };

  const handleUpload = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in.");
      navigate("/login");
      return;
    }
    const formData = new FormData();
    if (file) {
      formData.append("profileImage", file);
    } else {
      // If no file is selected, use the default image
      const response = await fetch(uploadDefault);
      const blob = await response.blob();
      formData.append("profileImage", blob, "upload.jpg");
    }

    try {
      const res = await axios.post("http://localhost:3001/update-profile", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      if (res.data.success) {
        localStorage.setItem("profileImage", res.data.user.profileImage);
        navigate("/recent");
      }
    } catch (err) {
      console.error("Upload error", err);
    }
  };

  const handleCancel = () => {
    setImage(uploadDefault);
    setFile(null);
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-lg h-[500px] w-full bg-white p-8 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-center">Upload Profile Photo</h2>
        <div className="w-[250px] h-[250px] rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
          <img
            src={image}
            alt="Profile"
            className="object-cover w-[250px] h-[250px] rounded-full"
          />
        </div>
        <div className="text-center mb-6">
          <label className="text-blue-600 hover:underline cursor-pointer">
            Choose a photo
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleUpload}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Upload
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
