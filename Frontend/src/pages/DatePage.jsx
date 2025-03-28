import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, NavLink } from "react-router-dom";
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
  const [bookedDates, setBookedDates] = useState({});
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

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
  const timeSlots = ["8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM"];

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const { data } = await axios.get("http://localhost:3001/booked-dates", {
          params: {
            month: currentDate.getMonth() + 1,
            year: currentDate.getFullYear(),
          },
        });
        setBookedDates(data);
      } catch (error) {
        console.error("Failed to fetch booked dates:", error);
      }
    };

    fetchBookedDates();
  }, [currentDate]);

  useEffect(() => {
    const storedBooking = JSON.parse(localStorage.getItem("temporaryBooking"));
    if (storedBooking) {
      setSelectedDate(new Date(storedBooking.date));
      setSelectedTime(storedBooking.time);
    }
  }, []);

  const handleMonthChange = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const handleDateChange = (date) => {
    const localDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
    setSelectedDate(localDate);
    setSelectedTime("");
    localStorage.setItem("temporaryBooking", JSON.stringify({ date: localDate.toISOString(), time: "" }));
  };

  const handleTimeChange = (time) => {
    setSelectedTime(time);
    localStorage.setItem(
      "temporaryBooking",
      JSON.stringify({ date: selectedDate.toISOString(), time })
    );
  };

  const handleBooking = () => {
    if (!selectedDate || !selectedTime) {
      setShowError(true);
      return;
    }

    setShowError(false);
    navigate("/appointment");
  };

  const renderDaysInMonth = () => {
    const days = [];
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time for correct comparison
  
    for (let i = 0; i < startDate.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
  
    for (let day = 1; day <= endDate.getDate(); day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      date.setHours(0, 0, 0, 0);
  
      const isPastDate = date < today && date.toDateString() !== today.toDateString();
      const isBooked = bookedDates[`${date.getFullYear()}-${date.getMonth() + 1}-${day}`];
  
      days.push(
        <button
          key={day}
          disabled={isPastDate || (isBooked && isBooked.isFullyBooked)}
          className={`w-8 h-8 flex items-center justify-center rounded-full
             ${isPastDate ? "text-gray-400 cursor-not-allowed" : ""}
            ${isBooked && isBooked.isFullyBooked ? "bg-red-400 text-white cursor-not-allowed" : ""}
            ${selectedDate?.toDateString() === date.toDateString() ? "bg-green-500 text-white" : "hover:bg-gray-200"}
          `}
          onClick={() => !isPastDate && handleDateChange(date)}
        >
          {day}
        </button>
      );
    }
  
    return days;
  };
  
  
  const renderTimes = () => {
    const formattedDate = selectedDate
      ? `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`
      : null;

    const bookedTimes = formattedDate
      ? bookedDates[formattedDate]?.times || []
      : [];

    return (
      <div className="flex flex-wrap gap-3">
        {timeSlots.map((time) => (
          <button
            key={time}
            disabled={bookedTimes.includes(time)}
            className={`w-24 h-10 border rounded-lg text-sm ${
              bookedTimes.includes(time)
                ? "bg-gray-300 cursor-not-allowed"
                : selectedTime === time
                ? "bg-green-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handleTimeChange(time)}
          >
            {time}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex-1 bg-[#EDF6FF] flex items-center justify-center px-20">
        <div className="flex w-[800px] h-[500px] bg-white rounded-lg shadow-lg">
          <div className="w-[250px] bg-[#FEE8C9] rounded-l-lg p-4 flex flex-col justify-start">
          <ul className="space-y-3">
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={service} alt="Service Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">
                    Service Selection
                  </span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px]  bg-[#4BB543] rounded-full border-1 shadow-lg"></div>
                <div className="flex items-center">
                  <img src={calendar} alt="Calendar Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">
                    Date and Time
                  </span>
                </div>
              </li>
              <li className="relative flex items-center bg-white rounded-lg p-3">
                <div className="absolute -right-0 mr-4 top-1/2 transform -translate-y-1/2 h-[16px] w-[16px] bg-white rounded-full border-2 border-[#000000] shadow-lg"></div>
                <div className="flex items-center">
                  <img src={user} alt="User Icon" className="h-5 w-5" />
                  <span className="ml-2 font-semibold text-sm">
                    Your Information
                  </span>
                </div>
              </li>
            </ul>

          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <NavLink to="/service">
                    <img
                      src={leftarrow}
                      alt="Back Icon"
                      className="h-4 w-4 cursor-pointer"
                    />
                  </NavLink>
                  <h2 className="text-lg font-bold">Date and Time</h2>
                </div>
                  <NavLink to="/landing">
                <img src={close} alt="Close Icon" className="h-5 w-5" />
                </NavLink>
              </div>

              <div className="mb-6 p-4 border rounded-lg shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => handleMonthChange(-1)}>&lt;</button>
                  <h3 className="text-lg font-bold">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h3>
                  <button onClick={() => handleMonthChange(1)}>&gt;</button>
                </div>
                <div className="grid grid-cols-7 gap-2">{renderDaysInMonth()}</div>
              </div>
              <div>{renderTimes()}</div>
              {showError && (
                <p className="text-red-500 text-sm mt-5">
                  Please select both a date and time to continue.
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                className="bg-green-500 text-white py-1 px-4 h-8 rounded-lg font-semibold text-sm"
                onClick={handleBooking}
              >
                Continue
              </button>
            </div>
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

export default DatePage;