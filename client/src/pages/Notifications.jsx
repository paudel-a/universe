import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  // ======================
  // FETCH NOTIFICATIONS
  // ======================
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // ======================
  // CLICK NOTIFICATION
  // ======================
  const handleClick = async (notification) => {
    try {
      // 1. mark as read only if unread
      if (!notification.isRead) {
        await API.put(`/notifications/read/${notification._id}`);

        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notification._id ? { ...n, isRead: true } : n,
          ),
        );
      }

      // 2. navigate safely
      const postId = notification.post?._id || notification.post;

      if (postId) {
        navigate(`/post/${postId}`);
      } else {
        console.warn("No post ID found in notification");
      }
    } catch (err) {
      console.error("Notification click error:", err);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Notifications</h1>

      {notifications.length === 0 ? (
        <p className="text-gray-500">No notifications yet</p>
      ) : (
        notifications.map((n) => (
          <div
            key={n._id}
            onClick={() => handleClick(n)}
            className={`p-4 rounded-xl shadow cursor-pointer transition relative hover:bg-gray-50
              ${n.isRead ? "bg-white" : "bg-blue-50 border-l-4 border-blue-500"}
            `}
          >
            {/* 🔵 unread dot */}
            {!n.isRead && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}

            <p>
              <strong>{n.sender?.name || "Someone"}</strong>{" "}
              {n.type === "post" && "created a new post"}
              {n.type === "like" && "liked your post"}
              {n.type === "comment" && "commented on your post"}
            </p>

            <p className="text-xs text-gray-400">
              {new Date(n.createdAt).toLocaleString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
