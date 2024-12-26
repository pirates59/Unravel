import React from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

const Login = () => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#F3F6FA] flex justify-center items-center">
        <div className="flex w-4/5 md:w-2/3 lg:w-1/2 bg-white shadow-lg rounded-lg">
          <div className="w-1/2 p-8">
            <button className="mb-4 flex items-center text-gray-600">
              <span className="mr-2">&larr;</span> Welcome back
            </button>
            <h2 className="text-xl font-semibold mb-4">Login with email:</h2>
            <form>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full mb-4 p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full mb-4 p-2 border rounded"
              />
              <p className="text-right text-sm text-gray-500 mb-4">
                Forgot password
              </p>
              <button className="w-full bg-[#EC993D] text-white py-2 rounded mb-4">
                LOGIN
              </button>
              <button className="w-full bg-[#161F36] text-white py-2 rounded">
                SIGN UP
              </button>
            </form>
          </div>
          <div className="w-1/2 bg-[#F3F6FA] flex items-center justify-center">
            {/* <img
              src="path-to-illustration"
              alt="Illustration"
              className="max-h-full max-w-full"
            /> */}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
