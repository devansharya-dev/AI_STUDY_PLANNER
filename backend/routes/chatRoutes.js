// backend/routes/chatRoutes.js
const express = require("express");
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const { chat, getHistory } = require("../controllers/chatController");

// send message
router.post("/", authMiddleware, chat);

// get chat history
router.get("/history", authMiddleware, getHistory);

module.exports = router;