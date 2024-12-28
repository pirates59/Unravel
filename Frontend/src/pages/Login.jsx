import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import leftarrow from "../assets/leftarrow.png";
import login from "../assets/login.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmitt = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous errors

    try {
      console.log("Login request initiated.");
      const result = await axios.post("http://localhost:3001/login", { email, password });

      console.log("Login response received:", result.data);
      if (result.data.success) {
        navigate("/service"); // Redirect to the service page on success
      } else {
        setErrorMessage(result.data.message); // Display backend error message
      }
    } catch (err) {
      console.error("An error occurred during login:", err.message);
      setErrorMessage("An error occurred while processing your request."); // General error message
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#F3F6FA] flex justify-center items-center">
        <div className="flex w-full md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg">
          {/* Left Section */}
          <div className="w-1/2 p-8">
            <button className="mb-4 flex items-center text-black-800">
              <span className="mr-2">
                <img src={leftarrow} alt="Back" className="h-4" />
              </span>
              Welcome back
            </button>
            <h2 className="text-xl font-semibold mb-4">Login with email:</h2>
            <form onSubmit={handleSubmitt}>
              <input
                type="email"
                name="email"
                autoComplete="off"
                placeholder="Enter your email"
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && (
                <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
              )}
              <p className="text-right text-sm text-gray-500 mb-4">
                Forgot password
              </p>
              <button
                type="submit"
                className="w-full bg-[#EC993D] text-white py-2 rounded mb-4"
              >
                LOGIN
              </button>
              <NavLink to="/signup">
                <button className="w-full bg-[#161F36] text-white py-2 rounded">
                  REGISTER
                </button>
              </NavLink>
            </form>
          </div>
          {/* Right Section */}
          <div className="w-1/2 bg-[#F3F6FA] flex items-center justify-center p-4">
            <img src={login} alt="Login Illustration" className="max-w-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
