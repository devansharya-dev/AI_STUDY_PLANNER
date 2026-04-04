// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();

const { chat, getHistory } = require("../controllers/chatController");

// send message
router.post("/", chat);

// get chat history
router.get("/history", getHistory);

module.exports = router;