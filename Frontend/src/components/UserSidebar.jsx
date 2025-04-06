// UserSidebar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

import userlogo from "../assets/userlogo.png";
import plus from "../assets/plus.png";
import feed from "../assets/feed.png";
import help from "../assets/help.png";
import room from "../assets/room.png";
import wellness from "../assets/wellness.png";
import setting from "../assets/setting.png";
import upload from "../assets/upload.jpg";
import logout from "../assets/logout.png";
import notificationIcon from "../assets/notification.png";

import Notification from "../components/Notification";
import Comment from "../components/Comment";

const UserSidebar = ({ children, openChangePassword }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const username = localStorage.getItem("username") || "Guest";
  const profileImage = localStorage.getItem("profileImage")
    ? `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`
    : upload;

  // State for notifications
  const [showNotification, setShowNotification] = useState(false);
  const [socketNotifications, setSocketNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOverlayPost, setNotificationOverlayPost] = useState(null);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);

  // State for user dropdown (for change password)
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  const token = localStorage.getItem("token");

  // Refs for click outside detection
  const notifRef = useRef(null);
  const userDropdownRef = useRef(null);
  const notificationIconRef = useRef(null);
  const userImageRef = useRef(null);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetched = res.data.notifications || [];
        const unreadFromFetched = fetched.filter((n) => !n.state).length;
        setUnreadCount(unreadFromFetched);
      } catch (err) {
        console.error("Error fetching unread notifications:", err);
      }
    };
    fetchUnreadCount();
  }, [apiBaseUrl, token]);

  useEffect(() => {
    const socket = io(apiBaseUrl);
    socket.emit("join", username);
    socket.on("notification", (notification) => {
      setSocketNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    });
    return () => {
      socket.disconnect();
    };
  }, [apiBaseUrl, username]);

  useEffect(() => {
    if (showNotification) {
      setSocketNotifications([]);
      setUnreadCount(0);
    }
  }, [showNotification]);

  // Close notification and user dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showNotification &&
        notifRef.current &&
        !notifRef.current.contains(e.target) &&
        !notificationIconRef.current.contains(e.target)
      ) {
        setShowNotification(false);
      }
      if (
        showUserDropdown &&
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target) &&
        !userImageRef.current.contains(e.target)
      ) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotification, showUserDropdown]);

  const openNotificationOverlay = async (postId) => {
    try {
      const res = await axios.get(`${apiBaseUrl}/api/posts/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotificationOverlayPost(res.data);
      setShowNotificationOverlay(true);
    } catch (err) {
      console.error("Error fetching post for notification overlay:", err);
    }
  };

  

  return (
    <div className="flex h-screen">
      <div className="w-64 bg-[#EC993D] text-white flex flex-col p-5">
        <div className="mb-10">
          <img
            src={userlogo}
            alt="Logo"
            className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]"
          />
        </div>
        <nav className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={plus} alt="Write Post" className="w-5 h-5" />
            <NavLink to="/post" className="flex-1">
              Write Post
            </NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={feed} alt="Feed" className="w-5 h-5" />
            <NavLink to="/feed" className="flex-1">
              Feed
            </NavLink>
          </div>
          <NavLink to="/room">
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
              <img src={room} alt="Rooms" className="w-5 h-5" />
              <span>Rooms</span>
            </div>
          </NavLink>
          <NavLink to="/wellness">
            <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
              <img src={wellness} alt="Wellness Center" className="w-5 h-5" />
              <span>Wellness Center</span>
            </div>
          </NavLink>
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={help} alt="I Need Help" className="w-5 h-5" />
            <NavLink to="/help" className="flex-1">
              I Need Help
            </NavLink>
          </div>
        </nav>
        <div className="mt-auto flex flex-col space-y-3">
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300">
            <img src={setting} alt="Settings" className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center space-x-3 cursor-pointer hover:bg-[#D97B28] hover:rounded p-2 transition-colors duration-300"
          >
            <img src={logout} alt="Logout" className="w-5 h-5" />
            <span>Logout</span>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-end items-center p-4 bg-white relative">
          <div className="relative">
            <img
              ref={notificationIconRef}
              src={notificationIcon}
              alt="Notification"
              className="w-6 h-6 cursor-pointer"
              onClick={() => setShowNotification((prev) => !prev)}
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 z-10 bg-red-500 rounded-full text-white text-xs flex items-center justify-center w-4 h-4">
                {unreadCount}
              </span>
            )}
            {showNotification && (
              <div ref={notifRef}>
                <Notification
                  token={token}
                  apiBaseUrl={apiBaseUrl}
                  realtimeNotifications={socketNotifications}
                  clearRealtime={() => {
                    setSocketNotifications([]);
                    setUnreadCount(0);
                  }}
                  onNotificationClick={openNotificationOverlay}
                />
              </div>
            )}
          </div>
          <div className="relative ml-4">
            <img
              ref={userImageRef}
              src={profileImage}
              alt="User Avatar"
              className="w-8 h-8 rounded-full cursor-pointer"
              onClick={() => setShowUserDropdown((prev) => !prev)}
            />
            
          </div>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">{children}</div>
      </div>

      {showNotificationOverlay && notificationOverlayPost && (
        <Comment
          post={notificationOverlayPost}
          postId={notificationOverlayPost._id}
          closeComments={() => {
            setShowNotificationOverlay(false);
            setNotificationOverlayPost(null);
          }}
        />
      )}
    </div>
  );
};

export default UserSidebar;
