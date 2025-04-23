const mongoose = require("mongoose"); 
const Chat = require("../models/Chat");
const ChatUser = require("../models/ChatUser");
const socketStore = require("../utils/socketStore");

const sendMessage = async (req, res) => {
    const { userId, text } = req.body;

    if (!userId || !text) {
        return res.status(400).json({ error: "userId and text are required!" });
    }

    try {
        const chat = await Chat.findOneAndUpdate(
            { userId },
            { $push: { messages: { sender: "user", text } } },
            { new: true, upsert: true }
        );
        res.json({ success: true, chat });
    } catch (error) {
        console.error("Error saving message:", error);
        res.status(500).json({ error: "Error saving message" });
    }
};




const replyMessage = async (req, res) => {
    try {
      console.log("Received /reply request:", req.body);
      const { userId, text } = req.body;
  
      if (!userId || !text) {
        return res.status(400).json({ error: "userId and text are required" });
      }
  
      const chat = await Chat.findOne({ userId });
  
      if (!chat) {
        return res.status(404).json({ error: "Chat not found for this user" });
      }
  
      chat.messages.push({ sender: "admin", text, timestamp: new Date() });
      await chat.save();
  
      const socketId = socketStore.getUser(userId);
      const io = req.app.get("socketio");
  
      if (io && socketId) {
        console.log(`Emitting to socket ${socketId} for user ${userId}`);
        io.to(socketId).emit("adminMessage", {
          sender: "admin",
          message: text,
          timestamp: new Date(),
        });
      } else {
        console.log("User is offline or socket not found");
      }
  
      res.status(200).json({ success: true, message: "Message sent successfully" });
    } catch (error) {
      console.error("Error in /reply API:", error);
      res.status(500).json({ error: "Internal server error", details: error.message });
    }
  };
  
  


  


const getAllChats = async (req, res) => {
    try {
        const chats = await Chat.find()
            .populate("userId", "name email")
            .populate("messages.sender", "name email"); 
        res.status(200).json(chats);
    } catch (error) {
        console.error("Error fetching chats:", error);
        res.status(500).json({ msg: "Internal Server Error" });
    }
};
const getUserChat = async (req, res) => {
    try {
        const userId = req.params.userId;
        console.log("Received userId:", userId); 

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ msg: "Invalid userId format" });
        }

        const chat = await Chat.findOne({ userId }).populate("messages.sender", "name email");

        if (!chat) {
            return res.status(404).json({ messages: [] });
        }

        res.status(200).json(chat);
    } catch (error) {
        console.error("Error getting chat:", error);  
        res.status(500).json({ msg: "Error getting chat" });
    }
};


const startChat = async (req, res) => {
    try {
      const { name, email } = req.body;
  
      if (!name || !email) {
        return res.status(400).json({ msg: "Name and email are required" });
      }
  
      let user = await ChatUser.findOne({ email });
  
      if (!user) {
        user = new ChatUser({ name, email });
        await user.save(); 
      }
  
      
      let chat = await Chat.findOneAndUpdate(
        { userId: user._id },
        { $setOnInsert: { userId: user._id, messages: [] } },
        { new: true, upsert: true }
      );
  
      res.status(201).json({ msg: "Chat started", userId: user._id });
    } catch (error) {
      console.error("Error starting chat:", error);
      res.status(500).json({ msg: "Internal Server Error" });
    }
  };
  
  

module.exports = { sendMessage, replyMessage, getUserChat, getAllChats, startChat };
