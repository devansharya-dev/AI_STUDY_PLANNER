const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// GET / => Returns standard list of users for n8n
router.get('/', userController.getUsers);
// GET /weekly-summary => Returns weekly progress analytics for ALL users for n8n
router.get('/weekly-summary', userController.getAllWeeklySummaries);

// GET /weekly-summary/:userId => Returns weekly progress analytics for n8n
router.get('/weekly-summary/:userId', userController.getWeeklySummary);

module.exports = router;
