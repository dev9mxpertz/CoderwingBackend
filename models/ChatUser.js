const mongoose = require("mongoose");
const Chat = require("./Chat");  

const ChatUserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

ChatUserSchema.pre("remove", async function (next) {
  await Chat.deleteMany({ userId: this._id });
  next();
});

ChatUserSchema.pre("findOneAndRemove", async function (next) {
  await Chat.deleteMany({ userId: this._id });
  next();
});

module.exports = mongoose.model("ChatUser", ChatUserSchema);
