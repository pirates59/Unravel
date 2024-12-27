import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import leftarrow from "../assets/leftarrow.png";
import login from "../assets/login.png";
import axios from "axios";
import { NavLink } from "react-router-dom";
import {useNavigate} from "react-router-dom";

function Login  () {
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState(""); 
    const navigate= useNavigate()


    const handleSubmitt = (e) => {
      e.preventDefault();
      console.log({ email, password }); // Log to check current values
      axios
        .post("http://localhost:3001/login", { email, password })
        .then((result) => {console.log(result)
          if(result.data === "Success"){
               navigate('/service')
          }
         
        })
        .catch((err) => console.log(err));
    };
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#F3F6FA] flex justify-center items-center ">
        <div className="flex w-100% md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="w-1/2 p-8">
            <button className="mb-4 flex items-center text-black-800">
              <span className="mr-2">
                    <img src={leftarrow}  alt="" className="h-4" />
                </span> Welcome back
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
              <p className="text-right text-sm text-gray-500 mb-4">
                Forgot password
              </p>
              <button type= "submit" className="w-full bg-[#EC993D] text-white py-2 rounded mb-4">
                LOGIN
              </button>
              
              <NavLink to="/signup" >
              <button className="w-full bg-[#161F36] text-white py-2 rounded">
                SIGN UP
              </button>
              </NavLink>
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
};

export default Login;
