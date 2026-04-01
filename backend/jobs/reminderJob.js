const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');

const sendDailyReminders = async () => {
  logger.info('Starting daily reminder job...');
  
  // Custom business logic will go here to fetch users/reminders
  // For now, we use a sample email address for testing updates
  const testEmail = process.env.TEST_EMAIL || 'test@example.com';
  
  const result = await sendEmail({
    to: testEmail,
    subject: 'Your Daily Study Planner Reminder',
    text: 'Hello! This is your daily reminder to check your AI Study Planner.',
    html: '<h3>Hello!</h3><p>This is your daily reminder to check your AI Study Planner.</p>',
  });

  if (result.success) {
    logger.info('Reminder job completed successfully.');
  } else {
    logger.error('Reminder job completed with errors.');
  }
};

module.exports = {
  sendDailyReminders,
};
