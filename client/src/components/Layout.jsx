import { NavLink, useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [chatNotifications, setChatNotifications] = useState([]);

  // ================= COUNTS =================
  const unreadCount = notifications.length;
  const unreadChatCount = chatNotifications.length;

  // ================= LOGOUT =================
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // ================= FETCH NOTIFICATIONS =================
  const fetchNotifications = async () => {
    try {
      const res = await API.get("/notifications");
      setNotifications(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user]);

  // ================= SOCKET =================
  useEffect(() => {
    if (!user?._id) return;

    socket.emit("addUser", user._id);

    socket.on("getNotification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    socket.on("receiveMessage", (msg) => {
      const senderId =
        typeof msg.sender === "object" ? msg.sender._id : msg.sender;

      if (senderId !== user._id) {
        setChatNotifications((prev) => [...prev, msg]);
      }
    });

    return () => {
      socket.off("getNotification");
      socket.off("receiveMessage");
    };
  }, [user]);

  // ================= NAV STYLE =================
  const linkStyle = ({ isActive }) =>
    isActive
      ? "bg-purple-500 text-white px-3 py-1 rounded-lg shadow-md shadow-purple-400/40 scale-105 transition-all duration-200"
      : "text-gray-700 hover:text-purple-500 px-3 py-1 rounded-lg hover:bg-purple-50 transition-all duration-200";

  return (
    <div>
      {/* NAVBAR */}
      <nav className="bg-white shadow-md px-6 py-3 flex justify-between items-center">
        <h1
          onClick={() => navigate("/feed")}
          className="text-xl font-bold text-purple-600 cursor-pointer"
        >
          UNIverse
        </h1>

        {/* LINKS */}
        <div className="flex gap-6 font-medium items-center">
          <NavLink to="/feed" className={linkStyle}>
            Home
          </NavLink>
          <NavLink to="/users" className={linkStyle}>
            Users
          </NavLink>

          {/* CHAT */}
          <NavLink to="/chat" className={linkStyle}>
            <div className="relative flex items-center gap-1">
              Chat 
              {unreadChatCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs px-2 rounded-full animate-bounce">
                  {unreadChatCount}
                </span>
              )}
            </div>
          </NavLink>

          <NavLink to="/marketplace" className={linkStyle}>
            Marketplace
          </NavLink>
          <NavLink to="/cart" className={linkStyle}>
            Cart 🛒
          </NavLink>
          <NavLink to="/ai-chat" className={linkStyle}>
            AI Chat
          </NavLink>

          {user?.role !== "teacher" && (
            <NavLink to="/assignments" className={linkStyle}>
              Assignments
            </NavLink>
          )}

          {user?.role === "teacher" && (
            <NavLink
              to="/create-assignment"
              className="text-purple-600 font-bold"
            >
              Create Assignment
            </NavLink>
          )}

          {/* NOTIFICATIONS */}
          <NavLink to="/notifications" className="relative text-xl">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full animate-bounce">
                {unreadCount}
              </span>
            )}
          </NavLink>
        </div>

        {/* USER */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="font-medium">{user.name || "User"}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="bg-purple-500 text-white px-4 py-1 rounded"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
