import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import DatePage from './pages/DatePage';
import Appointment from './pages/Appointment';
import UserSidebar from "./components/UserSidebar";
import Admin from './pages/Admin';
import Recent from './pages/Recent';
import Post from './pages/Post';
import Feed from './pages/Feed';
import Help from './pages/Help';
import Landing from './pages/Landing';
import ServiceSelection from './pages/ServiceSelection';
import { Forgotpassword, ResetPassword } from './pages/ForgotPassword';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/service" element={<ServiceSelection />} />
          <Route path="/date" element={<DatePage />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/forgot" element={<Forgotpassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/admin" element={<Admin />} />

          {/* Protected Routes with Sidebar */}
          <Route path="/recent" element={<UserSidebar><Recent /></UserSidebar>} />
          <Route path="/post" element={<UserSidebar><Post /></UserSidebar>} />
          <Route path="/feed" element={<UserSidebar><Feed /></UserSidebar>} />
          <Route path="/help" element={<UserSidebar><Help /></UserSidebar>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
