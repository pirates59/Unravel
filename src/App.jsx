import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import DatePage from './pages/DatePage';
import Appointment from './pages/Appointment';
import ServiceSelection from './pages/ServiceSelection';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <Routes>
        {/* Public routes */}

        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/service" element={<ServiceSelection />} />
        <Route path="/date" element={<DatePage />} />
        <Route path="/appointment" element={<Appointment />} />
        </Routes>
        </BrowserRouter>
      
    </div>
  )
}

export default App
