// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ServiceSelection from './pages/ServiceSelection';
import DatePage from './pages/DatePage';
import Appointment from './pages/Appointment';
import { ForgotPassword, ResetPassword } from './pages/ForgotPassword';
import Profile from './pages/Profile';
import Therapist from './components/Therapist';

// Admin components and pages
import Admin from './components/Admin';
import AdminAppointment from './pages/AdminAppointment';
import AdminRooms from './pages/AdminRooms';
import AdminCenter from './pages/AdminCenter';
import AdminTherapist from './pages/AdminTherapist';
import Users from './pages/Users';
import Filtration from './pages/Filtration';

// User components and pages
import UserSidebar from './components/UserSidebar';
import Recent from './pages/Recent';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import Feed from './pages/Feed';
import UserRoom from './pages/UserRoom';
import Wellness from './pages/Wellness';
import Chat from './pages/Chat';
import Help from './pages/Help';
import Setting from './pages/Setting';

// A wrapper for routes that require authentication and optional role checking
const ProtectedRoute = ({ children, role }) => {
  // Retrieve the stored role from localStorage
  const storedRole = localStorage.getItem('role');

  // If no role is stored, redirect to login
  if (!storedRole) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and does not match, redirect to login
  if (role && storedRole !== role) {
    return <Navigate to="/login" replace />;
  }

  // Otherwise render the protected component
  return children;
};

// Main App component
export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/service" element={<ServiceSelection />} />
          <Route path="/date" element={<DatePage />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/therapist" element={<Therapist />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminAppointment"
            element={
              <ProtectedRoute role="admin">
                <Admin>
                  <AdminAppointment />
                </Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminRooms"
            element={
              <ProtectedRoute role="admin">
                <Admin>
                  <AdminRooms />
                </Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminCenter"
            element={
              <ProtectedRoute role="admin">
                <Admin>
                  <AdminCenter />
                </Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/AdminTherapist"
            element={
              <ProtectedRoute role="admin">
                <Admin>
                  <AdminTherapist />
                </Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Users"
            element={
              <ProtectedRoute role="admin">
                <Admin>
                  <Users />
                </Admin>
              </ProtectedRoute>
            }
          />
          <Route
            path="/Filtration"
            element={
              <ProtectedRoute role="admin">
                <Admin>
                  <Filtration />
                </Admin>
              </ProtectedRoute>
            }
          />

          {/* User Protected Routes */}
          <Route
            path="/recent"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Recent />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/post"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Post />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/editpost"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <EditPost />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/feed"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Feed />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/rooms"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <UserRoom />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/wellness"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Wellness />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat/:roomId"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Chat />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/help"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Help />
                </UserSidebar>
              </ProtectedRoute>
            }
          />
          <Route
            path="/setting"
            element={
              <ProtectedRoute role="user">
                <UserSidebar>
                  <Setting />
                </UserSidebar>
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes for users to /rooms */}
          <Route path="*" element={<Navigate to="/rooms" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
