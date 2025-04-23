const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./utils/db");
const authRouter = require("./router/auth-router");
const chatRouter = require("./router/chatRouter");
const courseRouter = require("./router/course");
const Chat = require("./models/Chat");
const User = require("./models/User");
const Course = require("./models/courses");
const socketStore = require("./utils/socketStore");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    credentials: true,
  },
});

app.set("socketio", io);
const onlineUsers = {};
app.set("onlineUsers", onlineUsers); 

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRouter);
app.use("/api/chat", chatRouter);
app.use("/api/courses", courseRouter);


io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);
  
    socket.on("userConnected", (userId) => {
      socketStore.setUser(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
      console.log("Online users:", socketStore.getAll());
    });
  
    socket.on("adminMessage", ({ userId, message }) => {
      const targetSocketId = socketStore.getUser(userId);
      console.log(" Online users:", socketStore.getAll());
  
      if (targetSocketId) {
        console.log(" Message sent to socket ID:", targetSocketId);
        io.to(targetSocketId).emit("adminMessage", { message });
      } else {
        console.log(" User not online:", userId);
      }
    });
  
    socket.on("disconnect", () => {
      socketStore.removeUser(socket.id);
      console.log(` Socket disconnected: ${socket.id}`);
    });
  });

const PORT = 5000;
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(` Server is running on port ${PORT}`);
  });
});
