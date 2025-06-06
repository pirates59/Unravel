//Forgot Password and Reset Password
import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "axios";
import eyeIcon from "../assets/eye.png";   
import eyeOffIcon from "../assets/eye-off.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  // Initialize OTP as an array of 6 empty strings
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [error, setError] = useState("");
  // Creates 6 refs for the OTP input fields
  const inputRefs = Array.from({ length: 6 }, () => useRef(null));
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value.trim());
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const response = await axios.post("http://localhost:3001/forgot-password", { email });
      if (response.data.success) {
        setShowOtp(true);
      } else {
        setError(response.data.message || "Failed to send OTP. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Try again.");
    }
  };

  const handleOtpChange = (index, event) => {
    const { value } = event.target;
    if (/^\d?$/.test(value)) {
      const otpArray = [...otp];
      otpArray[index] = value;
      setOtp(otpArray);
      // Move focus to next field if a digit was entered
      if (value && index < inputRefs.length - 1) {
        inputRefs[index + 1].current.focus();
      }
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }
    try {
      setError("");
      const response = await axios.post("http://localhost:3001/verify-otp", { email, otp: otpStr });
      if (response.data.success) {
        // Passing isTherapist: true for the doctor reset flow
        navigate("/reset", { state: { email, isTherapist: true } });
      } else {
        setError(response.data.message || "Invalid OTP. Try again.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Try again.");
    }
  };

  const handleBack = () => {
    if (showOtp) {
      setShowOtp(false);
      setOtp(new Array(6).fill(""));
      inputRefs.forEach((ref) => {
        if (ref.current) ref.current.value = "";
      });
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white relative">
      <button
        onClick={handleBack}
        className="absolute top-10 left-10 bg-white border-2 border-[#161F36] text-[#161F36] flex items-center gap-2 px-6 py-2 rounded-lg transition-all duration-300"
      >
        <IoChevronBackOutline />
        Back
      </button>

      {!showOtp ? (
        <form
          onSubmit={handleEmailSubmit}
          className="flex flex-col items-center gap-6 w-[25%] bg-white p-8 shadow-lg rounded-lg"
        >
          <h2 className="text-3xl font-bold">Forgot Password?</h2>
          <p className="text-gray-600 text-center">
            Enter your registered email address
          </p>
          <input
            type="email"
            placeholder="Enter your email..."
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full border border-gray-300 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161F36]"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#EC993D] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Request OTP
          </button>
        </form>
      ) : (
        <form
          onSubmit={handleOtpSubmit}
          className="flex flex-col items-center gap-6 w-[35%] bg-white p-8 shadow-lg rounded-lg"
        >
          <h1 className="text-xl font-semibold">
            Enter the OTP sent to your email
          </h1>
          <div className="flex gap-4">
            {inputRefs.map((ref, index) => (
              <input
                key={index}
                ref={ref}
                type="text"
                maxLength="1"
                value={otp[index]}
                className="w-14 h-14 border border-gray-300 text-center text-2xl rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161F36]"
                onChange={(event) => handleOtpChange(index, event)}
              />
            ))}
          </div>
          <p className="text-red-500 text-sm text-center">
            * Your OTP expires in 5 minutes
          </p>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="bg-[#EC993D] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
          >
            Verify OTP
          </button>
        </form>
      )}
    </div>
  );
};

// ResetPassword Component 
const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);         // for new password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // for confirm password
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const isTherapist = location.state?.isTherapist;

  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("http://localhost:3001/reset-password", { email, password });
      if (response.data.success) {
        // Redirect based on the flag passed from login/OTP flow.
        if (isTherapist) {
          navigate("/login");
        } else {
          navigate("/login");
        }
      } else {
        setError(response.data.message || "Failed to reset password.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white">
      <form
        onSubmit={handlePasswordSubmit}
        className="flex flex-col items-center gap-6 w-[25%] bg-white p-8 shadow-lg rounded-lg"
      >
        <h2 className="text-3xl font-bold">Reset Password</h2>
        <p className="text-gray-600 text-center">Enter your new password below</p>
        {/* New Password Input */}
        <div className="relative w-full">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="New password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="w-full border border-gray-300 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161F36]"
          />
          <img
            src={showPassword ? eyeOffIcon : eyeIcon}
            alt={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
          />
        </div>
        {/* Confirm Password Input */}
        <div className="relative w-full">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            required
            className="w-full border border-gray-300 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#161F36]"
          />
          <img
            src={showConfirmPassword ? eyeOffIcon : eyeIcon}
            alt={showConfirmPassword ? "Hide password" : "Show password"}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute top-1/2 right-4 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className="bg-[#EC993D] text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};



export { ForgotPassword, ResetPassword };
