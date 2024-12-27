import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import leftarrow from "../assets/leftarrow.png";
import login from "../assets/login.png";

import axios from "axios";
import {useNavigate} from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState(""); 
  const navigate= useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ name, email, password }); // Log to check current values
    axios
      .post("http://localhost:3001/register", { name, email, password })
      .then((result) => {console.log(result)
        navigate('/')
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#F3F6FA] flex justify-center items-center">
        <div className="flex w-100% md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="w-1/2 p-8">
            <button className="mb-4 flex items-center text-black-800">
              <span className="mr-2">
                <img src={leftarrow} alt="" className="h-4" />
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
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full mb-4 p-2 border rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
              
                <button type="submit" className="w-full bg-[#EC993D] text-white py-2 rounded mt-8">
                  SIGN UP
                </button>
              
            </form>
          </div>

          <div className="w-1/2 bg-[#F3F6FA] flex items-center justify-center p-4">
            <img src={login} alt="" className="max-w-full" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Signup;
