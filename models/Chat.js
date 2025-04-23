const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "ChatUser", required: true },
    messages: [
      {
        sender: { type: String, enum: ["user", "admin"], required: true }, 
        text: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
      },
    ],
  },
  { timestamps: true }
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
