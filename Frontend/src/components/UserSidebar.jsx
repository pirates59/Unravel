import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import io from "socket.io-client";

// Asset imports – adjust paths as needed
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
import notifyImg from "../assets/notify.png"; // Placeholder image for no notifications

// --------------------------
// Notification Component
// --------------------------
const Notification = ({
  realtimeNotifications = [],
  clearRealtime,
  token,
  apiBaseUrl,
}) => {
  const navigate = useNavigate();
  const [fetchedNotifications, setFetchedNotifications] = useState([]);

  // Fetch notifications from the API
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${apiBaseUrl}/api/notification`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const notifs = res.data.notifications || [];
        setFetchedNotifications(notifs);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [apiBaseUrl, token]);

  // Merge realtime and fetched notifications, sorting by creation date (newest first)
  const combinedNotifications = [
    ...realtimeNotifications,
    ...fetchedNotifications,
  ];
  combinedNotifications.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  // Mark one notification as read and navigate to its post's comments section
  const markAsRead = async (id, postId) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/notification/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (clearRealtime) clearRealtime();
      setFetchedNotifications(
        fetchedNotifications.map((n) =>
          n._id === id ? { ...n, state: true } : n
        )
      );
      navigate(`/post/${postId}/comments`);
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/notification`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (clearRealtime) clearRealtime();
      setFetchedNotifications(
        fetchedNotifications.map((n) => ({ ...n, state: true }))
      );
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  // Helper: Build full URL for profile images
  const getImageUrl = (profileImage) => {
    if (!profileImage || profileImage === "default-avatar.png") {
      return "/assets/default-avatar.png";
    }
    if (profileImage.startsWith("http")) {
      return profileImage;
    }
    return `${apiBaseUrl}/uploads/${profileImage}`;
  };

  // Helper: Format notification date
  const formatDate = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy 'at' h:mmaaa");
  };

  return (
    <div className="absolute right-4 top-10 w-[500px] bg-white border border-neutral-300 rounded-md z-20 overflow-y-auto max-h-[50vh]">
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-xl">Notifications</h2>
        <button className="text-sm text-blue-600" onClick={markAllAsRead}>
          Mark all as read
        </button>
      </div>
      <hr className="border-neutral-300" />
      {combinedNotifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-4">
          <img src={notifyImg} alt="No notifications" className="w-6 h-6" />
          <p className="text-gray-500 mt-2">No notifications</p>
        </div>
      ) : (
        combinedNotifications.map((notification) => (
          <div
            key={notification._id}
            className={`flex items-center gap-3 px-4 py-3 border-b border-neutral-300 ${
              notification.state ? "bg-white" : "bg-purple-100 cursor-pointer"
            }`}
            onClick={() => markAsRead(notification._id, notification.postId)}
          >
            <img
              src={getImageUrl(notification.actorProfileImage)}
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm">
                <strong>{notification.actorName}</strong>{" "}
                {notification.type === "like"
                  ? "liked your post"
                  : "commented on your post"}
              </span>
              <span className="text-xs text-gray-500">
                {formatDate(notification.createdAt)}
              </span>
            </div>
          </div>
        ))
      )}
      {combinedNotifications.filter((n) => !n.state).length > 0 && (
        <div className="text-center py-2 text-sm text-gray-700">
          {combinedNotifications.filter((n) => !n.state).length} unread{" "}
          {combinedNotifications.filter((n) => !n.state).length === 1
            ? "notification"
            : "notifications"}
        </div>
      )}
    </div>
  );
};

// --------------------------
// UserSidebar Component
// --------------------------
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
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";
  const token = localStorage.getItem("token");

  // Fetch unread count from API on mount
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

  // Set up Socket.IO connection and listen for incoming notifications
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

  // When the notification panel is opened, clear realtime notifications (and badge count)
  useEffect(() => {
    if (showNotification) {
      setSocketNotifications([]);
      setUnreadCount(0);
    }
  }, [showNotification]);

  return (
    <div className="flex h-screen">
      {/* Sidebar Navigation */}
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

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end items-center p-4 bg-white relative">
          <div className="relative">
            {/* Notification icon with red badge */}
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
            {/* Notification dropdown */}
            {showNotification && (
              <Notification
                token={token}
                apiBaseUrl={apiBaseUrl}
                realtimeNotifications={socketNotifications}
                clearRealtime={() => {
                  setSocketNotifications([]);
                  setUnreadCount(0);
                }}
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
    </div>
  );
};

export default UserSidebar;
