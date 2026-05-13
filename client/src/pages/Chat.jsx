import { useEffect, useState } from "react";
import API from "../services/api";
import socket from "../socket";

function Chat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(true);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  // ================= FETCH USERS =================
  const fetchUsers = async () => {
    try {
      const res = await API.get("/users");
      setUsers(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= SOCKET RECEIVE =================
  useEffect(() => {
    const handler = (msg) => {
      if (
        selectedUser &&
        (msg.sender === selectedUser._id || msg.receiver === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handler);

    return () => {
      socket.off("receiveMessage", handler);
    };
  }, [selectedUser]);

  // ================= OPEN CHAT =================
  const openChat = async (user) => {
    setSelectedUser(user);

    try {
      const res = await API.get(`/messages/${user._id}`);
      setMessages(res.data);
    } catch (err) {
      console.log(err);
    }

    // 🔥 CLEAR NOTIFICATIONS WHEN CHAT OPENS (IMPORTANT FIX)
    try {
      await API.patch(`/notifications/mark-read/${user._id}`);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SEND MESSAGE =================
  const sendMessage = async () => {
    if (!text.trim() || !selectedUser) return;

    const msgData = {
      sender: currentUser.id,
      receiver: selectedUser._id,
      text: text.trim(),
    };

    try {
      const res = await API.post("/messages", msgData);

      setMessages((prev) => [...prev, res.data]);

      socket.emit("sendMessage", res.data);

      setText("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  // ================= ENTER KEY =================
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden border dark:border-gray-700">
        {/* ================= USERS SIDEBAR ================= */}
        <div className="w-1/3 border-r dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex flex-col">
          {/* HEADER */}
          <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center justify-between">
            <h2 className="font-bold text-xl text-black dark:text-white">
              Chats
            </h2>

            <button
              onClick={() => setDarkMode((prev) => !prev)}
              className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>

          {/* USERS */}
          <div className="overflow-y-auto flex-1">
            {users.map((u) => (
              <div
                key={u._id}
                onClick={() => openChat(u)}
                className={`p-4 cursor-pointer transition flex items-center gap-3 border-b dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  selectedUser?._id === u._id
                    ? "bg-gray-200 dark:bg-gray-700"
                    : ""
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold">
                  {u.name.charAt(0).toUpperCase()}
                </div>

                <div className="font-medium text-black dark:text-white">
                  {u.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ================= CHAT AREA ================= */}
        <div className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-900">
          {/* HEADER */}
          <div className="p-4 border-b dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
            <h2 className="font-semibold text-lg text-black dark:text-white">
              {selectedUser ? selectedUser.name : "Select a user"}
            </h2>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => {
              const senderId =
                typeof m.sender === "object" ? m.sender._id : m.sender;

              const isSender = senderId === currentUser?.id;

              return (
                <div
                  key={m._id || i}
                  className={`flex ${
                    isSender ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`px-4 py-2 max-w-[70%] wrap-break-word rounded-2xl shadow-md ${
                      isSender
                        ? "bg-blue-500 text-white rounded-br-sm"
                        : "bg-white dark:bg-gray-700 dark:text-white text-black rounded-bl-sm"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* INPUT */}
          {selectedUser && (
            <div className="p-4 bg-white dark:bg-gray-800 border-t dark:border-gray-700 flex items-center gap-3">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 bg-gray-100 dark:bg-gray-700 text-black dark:text-white border dark:border-gray-600 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-blue-400"
              />

              <button
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full transition"
              >
                Send
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
