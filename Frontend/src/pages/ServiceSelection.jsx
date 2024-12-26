import React from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png";

const ServiceSelection = () => {
  return (
    <div className="flex flex-col h-screen">
      <Topbar />
     
      <div className="flex flex-1 justify-center items-center">
        <div className="flex bg-white rounded-lg shadow-lg w-full max-w-4xl">
          {/* Sidebar */}
          <div className="bg-[#FCE5B1] w-1/3 py-6 px-4">
            <ul className="space-y-6">
              <li className="flex items-center space-x-2">
                <span className="h-5 w-5 bg-green-500 rounded-full flex-shrink-0"></span>
                <p className="text-black font-semibold">Service Selection</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-5 w-5 border border-gray-300 rounded-full flex-shrink-0"></span>
                <p className="text-gray-500">Date and Time</p>
              </li>
              <li className="flex items-center space-x-2">
                <span className="h-5 w-5 border border-gray-300 rounded-full flex-shrink-0"></span>
                <p className="text-gray-500">Your Information</p>
              </li>
            </ul>
          </div>

          {/* Form Section */}
          <div className="w-2/3 py-8 px-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Service Selection</h2>
                     <img src={close} alt="" className="h-4" />
            </div>
            <form className="mt-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Service:
              </label>
              <select
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                placeholder="Select Service"
              >
                <option value="">Select Service</option>
                <option value="therapy">Therapy</option>
                <option value="consultation">Consultation</option>
              </select>

              <label className="block text-gray-700 font-semibold mb-2">
                Therapist:
              </label>
              <select
                className="w-full mb-4 p-2 border border-gray-300 rounded"
                placeholder="Select Therapist"
              >
                <option value="">Select Therapist</option>
                <option value="therapist1">Therapist 1</option>
                <option value="therapist2">Therapist 2</option>
              </select>

              <button className="w-full bg-green-500 text-white py-2 rounded mt-4">
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ServiceSelection;
