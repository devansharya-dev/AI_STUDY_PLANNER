/**
 * notificationController.js
 * Request handlers for notification operations
 */
const notificationService = require('../services/notificationService');

exports.createNotification = async (req, res, next) => {
    try {
        const { userId, message } = req.body;

        // Basic input validation
        if (!userId || !message) {
            return res.status(400).json({
                success: false,
                message: 'userId and message are required fields'
            });
        }

        // Call notification service to handle logic
        const result = await notificationService.sendNotification({ userId, message });

        res.status(201).json({
            success: true,
            message: 'Notification processed successfully',
            data: result.data
        });
    } catch (error) {
        // Pass to global error handler
        next(error);
    }
};
