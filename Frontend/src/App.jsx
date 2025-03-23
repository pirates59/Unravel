import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Signup from './pages/Signup';
import DatePage from './pages/DatePage';
import Appointment from './pages/Appointment';
import UserSidebar from "./components/UserSidebar";
import Admin from './components/Admin';
import AdminAppointment from './pages/AdminAppointment';
import AdminTherapist from './pages/AdminTherapist';
import AdminRooms from './pages/AdminRooms';
import Users from './pages/Users';
import Recent from './pages/Recent';
import Profile from './pages/Profile';
import Post from './pages/Post';
import EditPost from './pages/EditPost';
import Feed from './pages/Feed';
import Help from './pages/Help';
import UserRoom from './pages/UserRoom';
import Filtration from './pages/Filtration';
import Chat from "./pages/Chat";
import Therapist from './components/Therapist';
import Landing from './pages/Landing';
import ServiceSelection from './pages/ServiceSelection';
import { ForgotPassword, ResetPassword } from './pages/ForgotPassword';


const ProtectedRoute = ({ children, role }) => {
  const storedRole = localStorage.getItem("role");
  if (!storedRole) {
    return <Navigate to="/login" />;
  }
  if (role && storedRole !== role) {
    return <Navigate to="/login" />;
  }
  return children;
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/service" element={<ServiceSelection />} />
          <Route path="/date" element={<DatePage />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/forgot" element={<ForgotPassword />} />
          <Route path="/reset" element={<ResetPassword />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/therapist" element={<Therapist />} />
          
          {/* Admin Protected Route */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          } />
        
<Route path="/AdminAppointment" element={
            <ProtectedRoute role="admin">
              <Admin>
                <AdminAppointment />
              </Admin>
            </ProtectedRoute>
          } />
          <Route path="/AdminRooms" element={
            <ProtectedRoute role="admin">
              <Admin>
                <AdminRooms />
              </Admin>
            </ProtectedRoute>
          } />
          <Route path="/AdminTherapist" element={
            <ProtectedRoute role="admin">
              <Admin>
                <AdminTherapist />
              </Admin>
            </ProtectedRoute>
          } />
<Route path="/Users" element={
            <ProtectedRoute role="admin">
              <Admin>
                <Users />
              </Admin>
            </ProtectedRoute>
          } />
          <Route path="/Filtration" element={
            <ProtectedRoute role="admin">
              <Admin>
                <Filtration />
              </Admin>
            </ProtectedRoute>
          } />
          {/* User Protected Routes */}
          <Route path="/recent" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <Recent />
              </UserSidebar>
            </ProtectedRoute>
          } />
          <Route path="/post" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <Post />
              </UserSidebar>
            </ProtectedRoute>
          } />
          <Route path="/editpost" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <EditPost />
              </UserSidebar>
            </ProtectedRoute>
          } />
          <Route path="/feed" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <Feed />
              </UserSidebar>
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <UserRoom />
              </UserSidebar>
            </ProtectedRoute>
          } />
           <Route path="/chat/:roomId" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <Chat />
              </UserSidebar>
            </ProtectedRoute>
          } />
            <Route path="*" element={<Navigate to="/rooms" replace />} />
            

          <Route path="/help" element={
            <ProtectedRoute role="user">
              <UserSidebar>
                <Help />
              </UserSidebar>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
