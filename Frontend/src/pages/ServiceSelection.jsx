import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import services from "../assets/service.png";
import calendar from "../assets/calendar.png";
import user from "../assets/user.png";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";

const ServiceSelection = () => {
  const [service, setService] = useState("");
  const [therapist, setTherapist] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const storedService = localStorage.getItem("selectedService");
    const storedTherapist = localStorage.getItem("selectedTherapist");

    if (location.state?.service) {
      setService(location.state.service);
    } else if (storedService) {
      setService(storedService);
    }

    if (location.state?.therapist) {
      setTherapist(location.state.therapist);
    } else if (storedTherapist) {
      setTherapist(storedTherapist);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!service) validationErrors.service = "Please select a service.";
    if (!therapist) validationErrors.therapist = "Please select a therapist.";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      localStorage.setItem("selectedService", service);
      localStorage.setItem("selectedTherapist", therapist);

      const response = await fetch("http://localhost:3001/service-selection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service, therapist }),
      });

      const result = await response.json();

      if (result.success) {
      
        navigate("/date", { state: { service, therapist } });
      } else {
        console.error(result.message);
        alert("Failed to save data: " + result.message);
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("An error occurred while saving the data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
        <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg">
          <div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
            <ul className="space-y-3">
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-[#4BB543] rounded-full border-1 shadow-lg"></div>
                <div className="flex items-center">
                  <img src={services} alt="Service Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Service Selection</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Date and Time</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={user} alt="User Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Your Information</span>
                </div>
              </li>
            </ul>
          </div>
          <div className="flex-1 p-6 flex flex-col">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold mb-4">Service Selection</h2>
              <NavLink to="/landing">
              <img src={close} alt="Close Icon" className="h-5 w-5 mb-4" />
                </NavLink>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-grow">
              <div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Service</label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                  >
                    <option value="">Select Service</option>
                    <option value="Individual Therapy (In-Person)">Individual Therapy (In-Person)</option>
                    <option value="Couple Therapy (In-Person)">Couple Therapy (In-Person)</option>
                  </select>
                  {errors.service && <p className="text-red-500 text-sm mt-1">{errors.service}</p>}
                </div>
                <div className="mb-4">
                  <label className="block mb-1 font-medium text-sm">Therapist</label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={therapist}
                    onChange={(e) => setTherapist(e.target.value)}
                  >
                    <option value="">Select Therapist</option>
                    <option value="Mr. Abhinash Thapa">Mr. Abhinash Thapa</option>
                    <option value="Mrs. Lekha Chaudhary">Mrs. Lekha Chaudhary</option>
                    <option value="Mr. Bijay Thakur">Mr. Bijay Thakur</option>
                  </select>
                  {errors.therapist && <p className="text-red-500 text-sm mt-1">{errors.therapist}</p>}
                </div>
              </div>
              <div className="flex justify-end mt-auto">
                <button
                  type="submit"
                  className="bg-green-500 text-white py-1 px-4 h-8 rounded-lg font-semibold text-sm"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="ml-16 mt-4">
          <img src={appoint} alt="Appointment Illustration" className="h-[480px]" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceSelection;
