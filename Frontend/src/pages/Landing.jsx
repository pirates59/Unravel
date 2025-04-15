// Landing Page
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";
import home from "../assets/home.png";
import logo1 from "../assets/logo1.png";
import right from "../assets/right.png";
import landing from "../assets/landing.gif";
import appoint from "../assets/appoint.png";
import community from "../assets/community.png";
import skill from "../assets/skill.png";
import social from "../assets/social.png";
import feedback from "../assets/feedback.png";
import awareness from "../assets/awareness.png";

// Topics for dynamic text in hero section
const topics = [
  "My Anxiety",
  "My Anger",
  "My Overthinking",
  "My Self Image",
  "My Dating Life"
];

// Component to cycle through topics every 2 seconds
const DynamicText = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % topics.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-2xl font-semibold text-gray-700 mb-8">
      <span className="elementor-headline-dynamic-text elementor-headline-text-active">
        {topics[index]}
      </span>
    </div>
  );
};

const Landing = () => {
  const [therapists, setTherapists] = useState([]);

  // Fetch therapists data on mount
  useEffect(() => {
    axios.get("http://localhost:3001/therapists")
      .then(res => setTherapists(res.data))
      .catch(err => console.error("Error fetching therapists:", err));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <div className="flex justify-between items-center p-6">
        <img src={logo1} alt="Unravel Logo" className="h-12" />
        <div className="flex items-center space-x-8">
          <NavLink to="/landing">
            <img src={home} alt="Home Icon" className="h-8 cursor-pointer" />
          </NavLink>
          <NavLink to="/service">
            <button className="flex items-center space-x-2 border border-[#EC993D] text-black px-5 py-2 rounded-xl hover:bg-[#EC993D] transition duration-300">
              <span>Book a Session</span>
              <img src={right} alt="Arrow Icon" className="h-3" />
            </button>
          </NavLink>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-8 py-8">
        {/* Left Content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-20">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            What will you <span className="text-orange-500">Unravel</span> today?
          </h1>
          <DynamicText />
          <div className="flex space-x-4 justify-center lg:justify-start">
            <NavLink to="/service">
              <button className="bg-[#EC993D] text-black px-5 py-3 rounded-xl flex items-center space-x-2 hover:bg-[#d8802c] transition duration-300">
                <span>Book a Session</span>
                <img src={right} alt="Arrow Icon" className="h-3" />
              </button>
            </NavLink>
            <NavLink to="/login">
              <button className="flex items-center space-x-2 text-black px-5 py-3 rounded-xl hover:bg-[#d8802c] transition duration-300">
                <span>Join Community</span>
                <img src={right} alt="Arrow Icon" className="h-3" />
              </button>
            </NavLink>
          </div>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mt-8 lg:mt-0">
          <img src={landing} alt="Illustration" className="max-w-full" />
        </div>
      </div>

      {/* Therapy Section */}
      <div className="bg-[url('C:/Users/Admin/Desktop/Unravel/Frontend/src/assets/therapy.png')] bg-cover bg-center py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Therapy</h2>
          <p className="text-gray-600">Home &gt; Therapy</p>
        </div>
      </div>

      {/* Healing Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-6">
        {/* Left Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Healing takes time, and <span className="font-bold text-gray-900">asking for help is a</span>
            <br />
            <span className="font-bold text-gray-900 mt-4 block">
              <span className="text-orange-500">COURAGEOUS</span> step.
            </span>
          </h2>
          <NavLink to="/service">
            <button className="bg-[#EC993D] text-black px-5 py-3 rounded-xl flex items-center space-x-2 hover:bg-[#d8802c] transition duration-300">
              <span>Book a Session</span>
              <img src={right} alt="Arrow Icon" className="h-3" />
            </button>
          </NavLink>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <img src={appoint} alt="Person Relaxing" className="max-w-[60%]" />
        </div>
      </div>

      {/* Meet our Therapists Section */}
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Meet our Therapists</h2>
        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 mt-8">
          {therapists.map((therapist, index) => (
            <div key={therapist._id || index} className="bg-white shadow-lg rounded-xl p-6 text-center w-80">
              <img
                src={
                  therapist.image
                    ? `http://localhost:3001/${therapist.image}`
                    : "https://via.placeholder.com/150?text=No+Image"
                }
                alt={therapist.name}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{therapist.name}</h3>
              <p className="text-gray-600 text-sm font-bold">{therapist.specialization}</p>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet consecte adipiscing elit amet hendrerit pretium nulla sed.
              </p>
              <NavLink to="/service">
                <button className="mt-4 bg-[#EC993D] text-black px-5 py-2 rounded-xl hover:bg-[#d8802c] transition duration-300">
                  Book Now
                </button>
              </NavLink>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-[url('C:/Users/Admin/Desktop/Unravel/Frontend/src/assets/therapy.png')] bg-cover bg-center py-8 mt-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Community</h2>
          <p className="text-gray-600">Home &gt; Community</p>
        </div>
      </div>

      {/* Community Healing Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 py-6">
        {/* Left Text Content */}
        <div className="lg:w-1/2 text-center lg:text-left">
          <h2 className="text-3xl font-semibold text-gray-900 mb-6">
            Alone we can do so little, together
            <br />
            <span className="font-bold text-gray-900 mt-4 block">
              <span className="text-orange-500">WE</span> can do so much.
            </span>
          </h2>
          <NavLink to="/login">
            <button className="bg-[#EC993D] text-black px-6 py-3 rounded-xl flex items-center space-x-2 hover:bg-[#d8802c] transition duration-300">
              <span>Community</span>
              <img src={right} alt="Arrow Icon" className="h-3" />
            </button>
          </NavLink>
        </div>

        {/* Right Image */}
        <div className="lg:w-1/2 mt-8 lg:mt-0 flex justify-center">
          <img src={community} alt="Community Illustration" className="max-w-[90%]" />
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-white py-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-8">Benefits Of Joining A Group</h2>
        <div className="flex flex-wrap justify-center gap-6 px-6">
          {/* Benefit Cards */}
          <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center border border-gray-200">
            <img src={social} alt="Social Support" className="mx-auto mb-4" />
            <p className="font-medium text-gray-800">Increased</p>
            <p className="text-gray-600">Social Support</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center border border-gray-200">
            <img src={awareness} alt="Self Awareness" className="mx-auto mb-10" />
            <p className="font-medium text-gray-800">Enhanced</p>
            <p className="text-gray-600">Self-Awareness</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center border border-gray-200">
            <img src={skill} alt="Interpersonal Skills" className="mx-auto mb-6" />
            <p className="font-medium text-gray-800">Improved</p>
            <p className="text-gray-600">Interpersonal Skills</p>
          </div>
          <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center border border-gray-200">
            <img src={feedback} alt="Feedback and Validation" className="mx-auto mb-10" />
            <p className="font-medium text-gray-800">Opportunities For</p>
            <p className="text-gray-600">Feedback and Validation</p>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-[#FDE7B8] text-center py-6">
        <p className="text-gray-800 font-medium">Get in Touch</p>
        <p className="text-gray-600">unravel@gmail.com</p>
      </div>
    </div>
  );
};

export default Landing;
