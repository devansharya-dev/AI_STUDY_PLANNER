const express = require("express");
const router = express.Router();

const { reschedule } = require("../controllers/rescheduleController");
const authMiddleware = require("../middleware/authMiddleware");

// 🔹 Reschedule tasks
router.post("/reschedule", authMiddleware, reschedule);

module.exports = router;