import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from './pages/Signup';
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
        </Routes>
        </BrowserRouter>
      
    </div>
  )
}

export default App
