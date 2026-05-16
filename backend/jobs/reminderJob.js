const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');
const supabase = require('../config/supabaseClient'); // Imported to grab actual tasks

const sendDailyReminders = async () => {
  logger.info('Starting daily reminder job...');
  
  try {
    // 1. Fetch incomplete tasks
    const { data: incompleteTasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('status', 'pending');

    if (error) {
      throw error;
    }

    if (!incompleteTasks || incompleteTasks.length === 0) {
      logger.info('No incomplete tasks. No reminders to send today.');
      return;
    }

   
    const tasksByUser = incompleteTasks.reduce((acc, task) => {
      acc[task.user_id] = acc[task.user_id] || [];
      acc[task.user_id].push(task);
      return acc;
    }, {});

    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    let sentCount = 0;

    const { buildMessage } = require('../utils/buildMessage');

    for (const [userId, tasks] of Object.entries(tasksByUser)) {
      // Create dynamically generated email content
      const subject = `You have ${tasks.length} pending tasks today in AI Study Planner`;
      
      const notificationText = buildMessage({ 
        type: 'DAILY_REMINDER', 
        data: { pendingCount: tasks.length } 
      });

      const result = await sendEmail({
        to: testEmail,
        subject,
        text: notificationText,
      });

      if (result.success) sentCount++;
    }

    logger.info(`Reminder job completed successfully. Sent ${sentCount} emails.`);
  } catch (err) {
    logger.error('Reminder job completed with errors: ' + err.message);
  }
};

module.exports = {
  sendDailyReminders,
};
