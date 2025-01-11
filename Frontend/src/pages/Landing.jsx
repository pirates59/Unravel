import React from 'react';
import  home from "../assets/home.png";
import  logo1 from "../assets/logo1.png";
import landing from "../assets/landing.gif";
import therapy from "../assets/therapy.png";

const Landing = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-2">
          <img src={logo1} alt="Login Illustration" className="h-12" />
        </div>
        <button className="bg-[#EC993D] text-white px-4 py-2 rounded shadow hover:bg-orange-600">
          Book a Session
        </button>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-16">
        <div className="lg:w-1/2 text-center lg:text-left">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            What will you <span className="text-orange-500">Unravel</span> today?
          </h1>
          <p className="text-lg font-semibold text-gray-700 mb-6">My Anxiety</p>
          <div className="flex space-x-4 justify-center lg:justify-start">
            <button className="bg-orange-500 text-white px-6 py-2 rounded shadow hover:bg-orange-600">
              Book a Session
            </button>
            <button className="text-orange-500 border border-orange-500 px-6 py-2 rounded shadow hover:bg-orange-100">
              Join Community
            </button>
          </div>
        </div>

        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <img src={landing} alt="Login Illustration" className="max-w-full" />
        </div>
      </div>

      {/* Therapy Section */}
      <div className="bg-[url('C:\Users\Admin\Desktop\Unravel\Frontend\src\assets\therapy.png')] bg-cover bg-center py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Therapy</h2>
          <p className="text-gray-600">Home &gt; Therapy</p>
        </div>
      </div>
    </div>
  );
};

export default Landing;
