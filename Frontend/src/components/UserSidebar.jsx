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

const UserSidebar = ({ children }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const username = localStorage.getItem("username") || "Guest";
  const profileImage = localStorage.getItem("profileImage")
    ? `http://localhost:3001/uploads/${localStorage.getItem("profileImage")}`
    : upload;

  const [showNotification, setShowNotification] = useState(false);
  const [socketNotifications, setSocketNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationOverlayPost, setNotificationOverlayPost] = useState(null);
  const [showNotificationOverlay, setShowNotificationOverlay] = useState(false);

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  const token = localStorage.getItem("token");

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
        <div className="mb-4">
          <img
            src={userlogo}
            alt="Logo"
            className="w-[300px] h-[70px] ml-[-14px] mt-[-14px]"
          />
        </div>
        <nav className="flex flex-col space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={plus} alt="Write Post" className="w-5 h-5" />
            <NavLink to="/post">
              <span>Write Post</span>
            </NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={feed} alt="Feed" className="w-5 h-5" />
            <NavLink to="/feed">
              <span>Feed</span>
            </NavLink>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={room} alt="Rooms" className="w-5 h-5" />
            <span>Rooms</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={wellness} alt="Wellness Center" className="w-5 h-5" />
            <span>Wellness Center</span>
          </div>
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={help} alt="I Need Help" className="w-5 h-5" />
            <NavLink to="/help">
              <span>I Need Help</span>
            </NavLink>
          </div>
        </nav>
        <div className="mt-auto flex flex-col space-y-6">
          <div className="flex items-center space-x-3 cursor-pointer hover:opacity-80">
            <img src={setting} alt="Settings" className="w-5 h-5" />
            <span>Settings</span>
          </div>
          <div
            onClick={handleLogout}
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80"
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
            )}
          </div>
          <div className="cursor-pointer w-8 h-8 rounded-full ml-4">
            <img
              src={profileImage}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
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