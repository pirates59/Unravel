import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import leftarrow from "../assets/leftarrow.png";
import loginImg from "../assets/login.png";
import eyeIcon from "../assets/eye.png";       // icon when password is hidden
import eyeOffIcon from "../assets/eye-off.png";  // icon when password is shown

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // show/hide state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const result = await axios.post("http://localhost:3001/login", { email, password });
      if (result.data.success) {
        const { user, token } = result.data;
        // Save session details in localStorage.
        localStorage.setItem("token", token);
        localStorage.setItem("username", user.name);
        localStorage.setItem("role", user.role);
        localStorage.setItem("email", user.email);
        localStorage.setItem("profileImage", user.profileImage || "upload.png");
        localStorage.setItem("userId", user._id);
        
        // Redirection based on role and whether it's the first login.
        if (user.role === "admin") {
          navigate("/Users"); // Admin dashboard.
        } else if (user.role === "doctor") {
          // For a doctor/therapist first login, pass the isTherapist flag.
          if (user.isFirstLogin) {
            navigate("/reset", { state: { email: user.email, isTherapist: true } });
          } else {
            navigate("/therapist");
          }
        } else {
          // For a normal user.
          if (user.isFirstLogin) {
            navigate("/profile", { state: { email: user.email } });
          } else {
            navigate("/recent");
          }
        }
      } else {
        setErrorMessage(result.data.message);
      }
    } catch (err) {
      console.error("Login error", err);
      setErrorMessage("An error occurred while processing your request.");
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#F3F6FA] flex justify-center items-center">
        <div className="flex w-full md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="w-1/2 p-8">
            <NavLink to="/">
              <button className="mb-4 flex items-center text-black-800">
                <span className="mr-2">
                  <img src={leftarrow} alt="Back" className="h-4" />
                </span>
                Welcome back
              </button>
            </NavLink>
            <h2 className="text-xl font-semibold mb-4">Login with email:</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
              {/* Password input with toggle */}
              <div className="relative mb-4">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  className="w-full p-2 border rounded"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <img
                  src={showPassword ? eyeOffIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 h-5 w-5 cursor-pointer"
                />
              </div>
              {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
              <NavLink to="/forgot">
                <p className="text-right text-sm text-gray-500 mb-4">Forgot password</p>
              </NavLink>
              <button type="submit" className="w-full bg-[#EC993D] text-white py-2 rounded mb-4">
                LOGIN
              </button>
              <NavLink to="/signup">
                <button className="w-full bg-[#161F36] text-white py-2 rounded">
                  REGISTER
                </button>
              </NavLink>
            </form>
          </div>
          <div className="w-1/2 bg-[#F3F6FA] flex items-center justify-center p-4">
            <img src={loginImg} alt="Login Illustration" className="max-w-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
