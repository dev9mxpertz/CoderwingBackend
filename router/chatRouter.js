const express = require("express");
const router = express.Router();
const { sendMessage, replyMessage, getUserChat, getAllChats, startChat } = require("../controllers/chat-Controller"); 

router.post("/start", startChat);
router.post("/send", sendMessage);
router.post("/reply", replyMessage);
router.get("/:userId", getUserChat);  
router.get("/", getAllChats);  
module.exports = router;
