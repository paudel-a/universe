import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate(); // ✅ REQUIRED

  useEffect(() => {
    // get current user from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(storedUser);

    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  // ✅ CHAT FUNCTION
  const handleChatUser = (user) => {
    if (!user?._id) {
      console.log("❌ Invalid user:", user);
      return;
    }

    navigate(`/chat?sellerId=${user._id}`);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Users</h2>

      <div className="grid grid-cols-2 gap-4">
        {users
          // ✅ FIXED ID CHECK
          .filter((u) => u._id !== currentUser?._id)
          .map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-xl shadow flex items-center justify-between"
            >
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>

              <button
                onClick={() => handleChatUser(user)} // ✅ FIXED
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Chat
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Users;
