
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import DatePage from './pages/DatePage';
import Appointment from './pages/Appointment';
import Sidebar from './components/Sidebar';
import UserSidebar from './components/UserSidebar';
import Landing from './pages/Landing';
import ServiceSelection from './pages/ServiceSelection';
import { Forgotpassword,ResetPassword } from './pages/ForgotPassword';

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
        <Route path="/forgot" element={<Forgotpassword />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/sidebar" element={<Sidebar/>} />
        <Route path="/UserSidebar" element={<UserSidebar/>} />
        </Routes>
        </BrowserRouter>
      
    </div>

  )
}

export default App
