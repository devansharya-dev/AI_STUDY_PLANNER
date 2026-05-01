/**
 * notificationService.js
 * Logic for processing notifications
 */

// Optional table structure suggestion for Supabase:
// Table: notifications
// Columns:
// - id (uuid, primary key)
// - user_id (text/uuid)
// - message (text)
// - created_at (timestamptz, default: now())

exports.sendNotification = async ({ userId, message }) => {
    try {
        // Log the notification to the console as requested (for n8n integration base)
        console.log(`[Notification Service] Sending notification to User ${userId}: ${message}`);
        
        // Return a successful operation result
        return {
            success: true,
            data: { 
                userId, 
                message, 
                timestamp: new Date().toISOString() 
            }
        };
    } catch (error) {
        console.error(`[Notification Service] Error sending notification:`, error);
        throw new Error('Failed to process notification');
    }
};
