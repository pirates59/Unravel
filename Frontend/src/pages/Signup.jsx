import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import leftarrow from "../assets/leftarrow.png";
import loginImg from "../assets/login.png";
import eyeIcon from "../assets/eye.png";       // icon when password is hidden (click to show)
import eyeOffIcon from "../assets/eye-off.png";  // icon when password is shown (click to hide)
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // show/hide state
  const [emailError, setEmailError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError("");
    setSuccessMessage(""); // Clear any previous success message
  
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:3001/check-email", { email });
      if (response.data.exists) {
        setEmailError("This email is already registered.");
        return;
      }
  
      // Call register endpoint. The server will assign role based on whether this is the first user.
      const regResponse = await axios.post("http://localhost:3001/register", { name, email, password });
      
      // Set success message based on role: include role for admin only.
      if (regResponse.data.user.role === "admin") {
        setSuccessMessage(`Registration successful! Your role is: ${regResponse.data.user.role}`);
      } else {
        setSuccessMessage("Registration successful!");
      }
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      setEmailError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#F3F6FA] flex justify-center items-center">
        <div className="flex w-full md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="w-1/2 p-8">
            <button className="mb-4 flex items-center text-black-800">
              <span className="mr-2">
                <NavLink to="/login">
                  <img src={leftarrow} alt="Back" className="h-4" />
                </NavLink>
              </span>
              Welcome to Unravel
            </button>
            <h2 className="text-xl font-semibold mb-4">Sign up with email:</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                autoComplete="off"
                placeholder="Enter your name"
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full mb-4 p-2 border rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password input with toggle */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border rounded"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                />
              </div>
              {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
              {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}
              <button type="submit" className="w-full bg-[#EC993D] text-white py-2 rounded mt-8">
                REGISTER
              </button>
            </form>
          </div>
          <div className="w-1/2 bg-[#F3F6FA] flex items-center justify-center p-4">
            <img src={loginImg} alt="Signup Illustration" className="max-w-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
