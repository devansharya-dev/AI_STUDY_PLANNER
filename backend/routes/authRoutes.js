const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { authLimiter } = require('../middleware/rateLimiter');

// 🔹 Sign Up Route
router.post('/signup', authLimiter, authController.signup);

// 🔹 Log In Route
router.post('/login', authLimiter, authController.login);

// 🔹 Get Current User Profile (Protected)
router.get('/me', authMiddleware, authController.getMe);

// 🔹 Log Out Route (Protected)
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
