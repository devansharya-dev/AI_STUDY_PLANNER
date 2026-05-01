/**
 * notificationRoutes.js
 * Endpoints for automation/notification integration
 */
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /
// Receives notifications (e.g. from n8n webhooks)
// Mount path in app.js should lead here (e.g. /api/v1/notifications)
router.post('/', notificationController.createNotification);

module.exports = router;
