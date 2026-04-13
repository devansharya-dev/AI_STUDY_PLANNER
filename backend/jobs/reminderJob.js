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
      .eq('is_completed', false);

    if (error) {
      throw error;
    }

    if (!incompleteTasks || incompleteTasks.length === 0) {
      logger.info('No incomplete tasks. No reminders to send today.');
      return;
    }

    // Since we don't have an admin auth client to fetch user emails, 
    // we'll simulate sorting by user_id and sending to a TEST_EMAIL or generic placeholder.
    const tasksByUser = incompleteTasks.reduce((acc, task) => {
      acc[task.user_id] = acc[task.user_id] || [];
      acc[task.user_id].push(task);
      return acc;
    }, {});

    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    let sentCount = 0;

    for (const [userId, tasks] of Object.entries(tasksByUser)) {
      // Create dynamically generated email content
      const subject = `You have ${tasks.length} pending tasks today in AI Study Planner`;
      const htmlList = tasks.map(t => `<li>${t.title}</li>`).join('');
      const htmlBody = `
        <h3>System Priority Alert</h3>
        <p>You have pending items in your queue. Please execute them to maintain progress:</p>
        <ul>${htmlList}</ul>
        <p>Stay focused!</p>
      `;

      // In production, we would map userId to an email here.
      const result = await sendEmail({
        to: testEmail, // Mock mapping
        subject,
        text: `You have ${tasks.length} pending tasks waiting to be executed.`,
        html: htmlBody,
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
