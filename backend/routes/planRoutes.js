const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/generate', authMiddleware, planController.generatePlan);

module.exports = router;
