import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import leftarrow from "../assets/leftarrow.png";
import loginImg from "../assets/login.png";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      const result = await axios.post("http://localhost:3001/login", { email, password });
      
      if (result.data.success) {
        const { user, token } = result.data;
        const username = user ? user.name : email.split("@")[0];
        const role = user ? user.role : "user";

        // ✅ Save session details
        localStorage.setItem("token", token); // ✅ Save the token
        localStorage.setItem("username", username);
        localStorage.setItem("role", role);
        localStorage.setItem("email", user.email);
        localStorage.setItem("profileImage", user.profileImage || "upload.png");

        // ✅ Redirect based on role and first login status
        if (role === "admin") {
          navigate("/Users");
        } else {
          user.isFirstLogin ? navigate("/profile") : navigate("/recent");
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
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
              {errorMessage && <p className="text-red-500 text-sm mb-4">{errorMessage}</p>}
              <NavLink to="/forgot">
                <p className="text-right text-sm text-gray-500 mb-4">Forgot password</p>
              </NavLink>
              <button type="submit" className="w-full bg-[#EC993D] text-white py-2 rounded mb-4">
                LOGIN
              </button>
              <NavLink to="/signup">
                <button className="w-full bg-[#161F36] text-white py-2 rounded">REGISTER</button>
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
