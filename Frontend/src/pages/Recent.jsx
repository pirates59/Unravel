import React from "react";
import UserSidebar from "../components/UserSidebar";
import { NavLink } from "react-router-dom";
const Recent = () => {
  return (
    <div>
      {/* Header with Recent, Feed, and Topic in one line */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-6">
          <button className="bg-[#EC993D] text-white px-6 py-2 rounded-xl">
            Recent
          </button>
          <NavLink to="/feed">
          <button className="border border-[#EC993D] px-6 py-2 rounded-xl">
            Feed
          </button>
                </NavLink>
         
        </div>
        <div className="mr-[302px]"> {/* Adjusted margin */}
          <h2 className="text-lg font-semibold">Topic</h2>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex gap-6">
        {/* Posts Section */}
        <div className="flex-1 space-y-4">
          {Array(2)
            .fill()
            .map((_, index) => (
              <div key={index} className="bg-gray-300 p-4 rounded-lg shadow-md">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                  <div>
                    <p className="font-semibold">Ashley Haris</p>
                    <p className="text-sm text-gray-500">4h</p>
                  </div>
                </div>
                <p className="mt-2">"I wish someone would notice I’m not okay."</p>
                <p className="text-blue-500 text-sm cursor-pointer">
                  #YakamozS245
                </p>
                <div className="flex justify-between text-gray-500 text-sm mt-2">
                  <p>💬 197</p>
                  <p>❤️ 2,533</p>
                </div>
              </div>
            ))}
        </div>

        {/* Topics Section Column */}
        <div className="w-1/4 mb-12">
          <div className="bg-gray-300 p-4 rounded-lg shadow-md">
            <div className="grid grid-cols-2 gap-2">
              {[
                "Relationships",
                "Family",
                "Self Harm",
                "Friends",
                "Hopes",
                "Bullying",
                "Health",
                "Work",
                "Music",
                "Parenting",
                "LGBTQ+",
                "Religion",
                "Education",
                "Pregnancy",
                "Mental Health",
                "Positive",
                "Meditation",
                "Self care",
                "OCD",
                "Psychosis",
                "Schizophrenia",
                "Paranoia",
              ].map((topic, index) => (
                <button
                  key={index}
                  className="bg-white px-3 py-2 rounded-lg text-sm"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recent;
