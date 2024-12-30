import React, { useState } from "react";
import Topbar from "../components/Topbar";
import Footer from "../components/Footer";
import service from "../assets/service.png";
import calendar from "../assets/calendar.png";
import leftarrow from "../assets/leftarrow.png";
import user from "../assets/user.png";
import close from "../assets/close.png";
import appoint from "../assets/appoint.png";

const DatePage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const renderDaysInMonth = () => {
  const days = [];
  const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
  const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

  // Empty slots for days before the first day of the month
  for (let i = 0; i < startDate.getDay(); i++) {
    days.push(
      <div key={`empty-${i}`} className="w-8 h-8 "></div>
    );
  }

  // Days of the current month
  for (let day = startDate.getDate(); day <= endDate.getDate(); day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    days.push(
      <button
        key={day}
        className={`w-8 h-8 flex items-center justify-center ml-3 rounded-full ${
          selectedDate?.toDateString() === date.toDateString()
            ? "bg-green-500 text-white"
            : "hover:bg-gray-200"
        }`}
        onClick={() => setSelectedDate(date)}
      >
        {day}
      </button>
    );
  }

  return days;
};


const renderTimes = () => {
  const times = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];
  return (
    <div className="flex gap-2 justify-start mr-24 whitespace-nowrap">
      {times.map((time) => (
        <button
          key={time}
          className={`w-24 h-10 border rounded-lg text-sm font-medium ${
            selectedTime === time
              ? "bg-green-500 text-white"
              : "hover:bg-gray-200"
          }`}
          onClick={() => setSelectedTime(time)}
        >
          {time}
        </button>
      ))}
    </div>
  );
};



  const handleMonthChange = (direction) => {
    setCurrentDate((prevDate) => {
      const newMonth = prevDate.getMonth() + direction;
      return new Date(prevDate.getFullYear(), newMonth, 1);
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
        {/* Left Section */}
        <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg">
          {/* Sidebar */}
          <div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
            <ul className="space-y-3">
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-2 top-1/2 transform -translate-y-1/2 h-5 w-5 bg-[#4BB543] rounded-full border-2 border-white shadow-lg"></div>
                <div className="flex items-center">
                  <img src={service} alt="Service Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Service Selection</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Date and Time</span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-3 top-1/2 transform -translate-y-1/2 h-4 w-4 bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={user} alt="User Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">Your Information</span>
                </div>
              </li>
            </ul>
          </div>

           <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <img src={leftarrow} alt="Back Icon" className="h-4 w-4" />
                  <h2 className="text-lg font-bold">Date and Time</h2>
                </div>
                <img src={close} alt="Close Icon" className="h-5 w-5" />
              </div>

              {/* Month Box */}
              <div className="mb-6 p-4 border rounded-lg shadow-lg" style={{ boxShadow: "0px 0px 10px #FFFFFF" }}>
                {/* Month Selector */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => handleMonthChange(-1)}
                    className="text-lg font-semibold"
                  >
                    &lt;
                  </button>
                  <h3 className="text-lg font-bold text-[#B05677]">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button
                    onClick={() => handleMonthChange(1)}
                    className="text-lg font-semibold"
                  >
                    &gt;
                  </button>
                </div>

                {/* Weekday Header */}
                <div className="grid grid-cols-7 mb-2 text-sm font-semibold text-center">
                  {daysOfWeek.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                {/* Calendar */}
                <div className="grid grid-cols-7 gap-2">{renderDaysInMonth()}</div>
              </div>

              {/* Times */}
              <div className="flex space-x-2 justify-center">{renderTimes()}</div>
            </div>

            {/* Button at the Bottom */}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-green-500 text-white py-1 px-4 h-8 rounded-lg font-semibold text-sm"
                onClick={() =>
                  alert(
                    `Selected Date: ${
                      selectedDate?.toDateString() || "None"
                    }, Time: ${selectedTime || "None"}`
                  )
                }
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        {/* Right Image Section */}
        <div className="ml-16 mt-4">
          <img
            src={appoint}
            alt="Appointment Illustration"
            className="h-[480px]"
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DatePage;
