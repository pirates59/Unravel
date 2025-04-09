// components/Notification.jsx
import React from "react";
import { format } from "date-fns";
import axios from "axios";
import notifyImg from "../assets/notify.png";

const Notification = ({
  realtimeNotifications = [],
  clearRealtime,
  token,
  apiBaseUrl,
  onNotificationClick,
}) => {
  const [fetchedNotifications, setFetchedNotifications] = React.useState([]);

  React.useEffect(() => {
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

  const combinedNotifications = [
    ...realtimeNotifications,
    ...fetchedNotifications,
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleNotificationClick = async (notification) => {
    try {
      await axios.put(
        `${apiBaseUrl}/api/notification/${notification._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (clearRealtime) clearRealtime();
      setFetchedNotifications(
        fetchedNotifications.map((n) =>
          n._id === notification._id ? { ...n, state: true } : n
        )
      );
      if (onNotificationClick) {
        onNotificationClick(notification.postId);
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  const getImageUrl = (profileImage) => {
    if (!profileImage || profileImage === "default-avatar.png") {
      return "/assets/default-avatar.png";
    }
    if (profileImage.startsWith("http")) {
      return profileImage;
    }
    return `${apiBaseUrl}/uploads/${profileImage}`;
  };

  const formatDateString = (dateString) => {
    return format(new Date(dateString), "MMMM dd, yyyy 'at' h:mmaaa");
  };

  return (
    <div className="absolute right-4 top-10 w-[500px] bg-white border border-neutral-300 rounded-md z-20 overflow-y-auto max-h-[50vh]">
      <div className="flex justify-between items-center px-4 py-3">
        <h2 className="text-xl">Notifications</h2>
        <button
          className="text-sm text-blue-600"
          onClick={async () => {
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
          }}
        >
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
            onClick={() => handleNotificationClick(notification)}
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
                {formatDateString(notification.createdAt)}
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

export default Notification;
