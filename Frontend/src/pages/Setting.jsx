// Setting Page
import React, { useState, useEffect } from "react"; 
import axios from "axios";
import leftarrow from "../assets/leftarrow.png";
import eyeIcon from "../assets/eye.png";       
import eyeOffIcon from "../assets/eye-off.png"; 

export default function Setting() {
  // Profile fields + originals for revert on cancel
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [origUsername, setOrigUsername] = useState("");
  const [origEmail, setOrigEmail] = useState("");
  const [origPhoto, setOrigPhoto] = useState(null);

  // Success/error messages for profile form
  const [profileSuccessMessage, setProfileSuccessMessage] = useState("");
  const [profileErrorMessage, setProfileErrorMessage] = useState("");

  // Password form fields and messages
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordSuccessMessage, setPasswordSuccessMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  // States for password visibility toggle in password change form
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    const storedPhoto = localStorage.getItem("profileImage");

    if (storedName) {
      setUsername(storedName);
      setOrigUsername(storedName);
    }
    if (storedEmail) {
      setEmail(storedEmail);
      setOrigEmail(storedEmail);
    }
    if (storedPhoto) {
      const photoUrl = storedPhoto.startsWith("http")
        ? storedPhoto
        : `http://localhost:3001/uploads/${storedPhoto}`;
      setPhoto(photoUrl);
      setOrigPhoto(photoUrl);
    }
  }, []);

  // When a new image is selected, update preview and store file
  const handlePhotoChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPhoto(URL.createObjectURL(file));
    }
  };

  // Reset photo button revert to the current profile picture from storage
  const handleResetPhoto = () => {
    setPhoto(origPhoto);
    setSelectedFile(null);
  };

  // Save Profile
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfileSuccessMessage("");
    setProfileErrorMessage("");
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (selectedFile) {
      formData.append("profileImage", selectedFile);
    }
    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:3001/update-profile", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        setProfileSuccessMessage("Profile saved successfully!");
        setTimeout(() => setProfileSuccessMessage(""), 2000);
        // Update localStorage and original state values
        localStorage.setItem("username", res.data.user.name);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("profileImage", res.data.user.profileImage);
        setOrigUsername(res.data.user.name);
        setOrigEmail(res.data.user.email);
        const newPhotoUrl = res.data.user.profileImage.startsWith("http")
          ? res.data.user.profileImage
          : `http://localhost:3001/uploads/${res.data.user.profileImage}`;
        setOrigPhoto(newPhotoUrl);
        setPhoto(newPhotoUrl);
        setSelectedFile(null);
      })
      .catch((err) => {
        console.error(err);
        setProfileErrorMessage("Error saving profile");
      });
  };

  // Cancel Profile changes: revert to original values
  const handleCancelProfile = () => {
    setUsername(origUsername);
    setEmail(origEmail);
    setPhoto(origPhoto);
    setSelectedFile(null);
    setProfileSuccessMessage("");
    setProfileErrorMessage("");
  };

  // Change Password: submit password change request
  const handleChangePassword = (e) => {
    e.preventDefault();
    setPasswordSuccessMessage("");
    setPasswordErrorMessage("");
    if (!currentPassword.trim() || !newPassword.trim()) {
      setPasswordErrorMessage("Both current and new passwords are required.");
      return;
    }
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:3001/change-password",
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        if (res.data.success) {
          setPasswordSuccessMessage("Password changed successfully!");
          setTimeout(() => setPasswordSuccessMessage(""), 2000);
          setCurrentPassword("");
          setNewPassword("");
        } else {
          setPasswordErrorMessage(res.data.message || "Password change failed");
        }
      })
      .catch((err) => {
        console.error(err);
        setPasswordErrorMessage("Enter password correctly");
      });
  };

  // Cancel Password changes
  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setPasswordSuccessMessage("");
    setPasswordErrorMessage("");
  };

  const handleResendConfirmation = () => alert("Confirmation link resent!");

  return (
    <div className="p-4 flex flex-col h-[96%]">
      <button className="mb-[30px]" onClick={() => window.history.back()}>
        <img src={leftarrow} alt="Back" className="w-6 h-6" />
      </button>
      <div className="bg-gray-100 rounded-md p-6 shadow-md w-[80%] h-[100%]">
        {/* Profile form messages */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-28 h-28 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden">
            {photo ? (
              <img src={photo} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <svg
                className="text-gray-400 w-full h-full"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </div>
          <div>
            <label
              htmlFor="photo-upload"
              className="inline-block cursor-pointer w-[140px] bg-[#EC993D] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-400 transition-colors"
            >
              Upload Photo
            </label>
            <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} />
            <button
              type="button"
              onClick={handleResetPhoto}
              className="ml-3 inline-block w-[80px] bg-gray-300 text-black px-4 py-2 rounded text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="flex space-x-4">
            <div className="flex-1">
              <label htmlFor="username" className="block text-sm font-medium text-black mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-1">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="bg-yellow-100 border border-yellow-200 text-yellow-600 px-4 py-2 rounded-md mt-2 w-full">
            Your email has not been confirmed. Please check your inbox.
            <button type="button" onClick={handleResendConfirmation} className="text-[#EC993D] ml-2 font-semibold">
              Resend confirmation
            </button>
          </div>
          {profileSuccessMessage && (
            <div className=" text-green-700">{profileSuccessMessage}</div>
          )}
          {profileErrorMessage && (
            <div className=" text-red-700">{profileErrorMessage}</div>
          )}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="submit"
              className="bg-[#EC993D] w-[140px] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-400 transition-colors"
            >
              Save Profile
            </button>
            <button
              type="button"
              onClick={handleCancelProfile}
              className="bg-gray-300 w-[80px] text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
        <form onSubmit={handleChangePassword} className="space-y-5 mt-8">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-black mb-1">
                Current Password
              </label>
              <input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <img
                src={showCurrentPassword ? eyeOffIcon : eyeIcon}
                alt={showCurrentPassword ? "Hide password" : "Show password"}
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute top-9 right-3 h-5 w-5 cursor-pointer"
              />
            </div>
            <div className="flex-1 relative">
              <label htmlFor="newPassword" className="block text-sm font-medium text-black mb-1">
                New Password
              </label>
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <img
                src={showNewPassword ? eyeOffIcon : eyeIcon}
                alt={showNewPassword ? "Hide password" : "Show password"}
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute top-9 right-3 h-5 w-5 cursor-pointer"
              />
            </div>
          </div>
          {passwordSuccessMessage && <div className=" text-green-700">{passwordSuccessMessage}</div>}
          {passwordErrorMessage && <div className=" text-red-700">{passwordErrorMessage}</div>}
          <div className="flex justify-end space-x-4 pt-2">
            <button
              type="submit"
              className="bg-[#EC993D] w-[140px] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-400 transition-colors"
            >
              Save Password
            </button>
            <button
              type="button"
              onClick={handleCancelPassword}
              className="bg-gray-300 w-[80px] text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
