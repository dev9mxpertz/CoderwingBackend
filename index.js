const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./utils/db");

// Routers
const authRouter = require("./router/auth-router");
const chatRouter = require("./router/chatRouter");
const courseRouter = require("./router/course");

// Models (if used somewhere else)
const Chat = require("./models/Chat");
const User = require("./models/User");
const Course = require("./models/courses");

// Socket store
const socketStore = require("./utils/socketStore");

const app = express();
const server = http.createServer(app);

// ✅ Socket.IO with open CORS config
const io = new Server(server, {
  cors: {
    origin: true, // Allow all origins
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  },
});

// Store socket.io and online users in app
app.set("socketio", io);
const onlineUsers = {};
app.set("onlineUsers", onlineUsers);

// ✅ Express middleware
app.use(cors({
  origin: true, // Allow all origins
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/courses", courseRouter);

// ✅ Socket.IO logic
io.on("connection", (socket) => {
  console.log(`🔌 New client connected: ${socket.id}`);

  socket.on("userConnected", (userId) => {
    socketStore.setUser(userId, socket.id);
    console.log(`✅ User ${userId} connected with socket ID: ${socket.id}`);
    console.log("📡 Online users:", socketStore.getAll());
  });

  socket.on("adminMessage", ({ userId, message }) => {
    const targetSocketId = socketStore.getUser(userId);
    console.log("📨 Admin message - Online users:", socketStore.getAll());

    if (targetSocketId) {
      console.log("📬 Message sent to socket ID:", targetSocketId);
      io.to(targetSocketId).emit("adminMessage", { message });
    } else {
      console.log("❌ User not online:", userId);
    }
  });

  socket.on("disconnect", () => {
    socketStore.removeUser(socket.id);
    console.log(`🔌 Socket disconnected: ${socket.id}`);
  });
});

// ✅ Server start
const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
