const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
require("dotenv").config();

// ======================
// MODELS
// ======================
const Message = require("./models/Message");

// ======================
// ROUTES
// ======================
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const marketplaceRoutes = require("./routes/marketplaceRoutes");
const messageRoutes = require("./routes/messageRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const aiRoutes = require("./routes/aiRoutes");

// ======================
// APP SETUP
// ======================
const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
  }),
);

// ======================
// API ROUTES
// ======================
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/marketplace", marketplaceRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);

app.use("/api/ai", aiRoutes);
app.use("/uploads", express.static("uploads"));

// ======================
// ROOT ROUTE
// ======================
app.get("/", (req, res) => {
  res.send("UNIverse API is running...");
});

// ======================
// SERVER + SOCKET.IO
// ======================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// attach io
app.set("io", io);

// ======================
// ONLINE USERS
// ======================
const onlineUsers = new Map();

// ======================
// SOCKET LOGIC
// ======================
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ----------------------
  // JOIN USER ROOM
  // ----------------------
  socket.on("addUser", (userId) => {
    socket.join(userId);

    onlineUsers.set(userId, socket.id);

    console.log("User joined room:", userId);
  });
  // ----------------------
  // SEND MESSAGE
  socket.on("sendMessage", async (data) => {
    console.log("MESSAGE RECEIVED:", data);

    try {
      const { sender, receiver, text } = data;

      const newMessage = await Message.create({
        sender,
        receiver,
        text,
      });

      io.to(receiver).emit("receiveMessage", {
        sender: sender,
        receiver: receiver,
        text: text,
      });

      io.to(sender).emit("receiveMessage", {
        sender: sender,
        receiver: receiver,
        text: text,
      });
    } catch (err) {
      console.error("Message error:", err.message);
    }
  });
  // ----------------------
  // SEND NOTIFICATION
  // ----------------------
  socket.on("sendNotification", ({ receiverId, notification }) => {
    const socketId = onlineUsers.get(receiverId);

    if (socketId) {
      io.to(socketId).emit("getNotification", notification);
    }
  });

  // ----------------------
  // DISCONNECT
  // ----------------------
  socket.on("disconnect", () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    console.log("User disconnected:", socket.id);
  });
});

// ======================
// MONGODB CONNECTION
// ======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log("MongoDB Error ❌:", err.message));

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
