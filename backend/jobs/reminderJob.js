const { sendEmail } = require('../services/emailService');
const logger = require('../utils/logger');
const supabase = require('../config/supabaseClient'); // Imported to grab actual tasks

const sendDailyReminders = async () => {
  logger.info('Starting daily reminder job...');
  
  try {
    // 1. Fetch incomplete tasks with topics
    const { data: incompleteTasks, error } = await supabase
      .from('tasks')
      .select('*, topics(topic)')
      .eq('status', 'pending');

    if (error) {
      throw error;
    }

    if (!incompleteTasks || incompleteTasks.length === 0) {
      logger.info('No incomplete tasks. No reminders to send today.');
      return;
    }

    const tasksByUser = incompleteTasks.reduce((acc, task) => {
      if (!task.user_id) return acc;
      acc[task.user_id] = acc[task.user_id] || [];
      acc[task.user_id].push(task);
      return acc;
    }, {});

    const userIds = Object.keys(tasksByUser);

    // 2. Fetch user profiles for names
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, email')
      .in('id', userIds);
      
    const profileMap = (profiles || []).reduce((acc, p) => {
      acc[p.id] = p.email;
      return acc;
    }, {});

    // 3. Fetch completed tasks from yesterday
    const yesterdayStart = new Date();
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    const { data: yesterdayTasks } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('status', 'completed')
      .gte('completed_at', yesterdayStart.toISOString())
      .lte('completed_at', yesterdayEnd.toISOString())
      .in('user_id', userIds);

    const completedYesterdayByUser = (yesterdayTasks || []).reduce((acc, task) => {
      acc[task.user_id] = (acc[task.user_id] || 0) + 1;
      return acc;
    }, {});

    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    let sentCount = 0;

    const { buildMessage } = require('../utils/buildMessage');

    for (const [userId, tasks] of Object.entries(tasksByUser)) {
      // Calculate highest subject
      const subjectCounts = tasks.reduce((acc, task) => {
        const subject = task.topics?.topic || 'General';
        acc[subject] = (acc[subject] || 0) + 1;
        return acc;
      }, {});
      
      let highestSubject = 'General';
      let maxCount = 0;
      for (const [subj, count] of Object.entries(subjectCounts)) {
        if (count > maxCount) {
          maxCount = count;
          highestSubject = subj;
        }
      }

      const email = profileMap[userId] || 'student@example.com';
      const rawName = email.split('@')[0];
      const userName = rawName.charAt(0).toUpperCase() + rawName.slice(1);

      const completedYesterday = completedYesterdayByUser[userId] || 0;

      const subject = `You have ${tasks.length} pending tasks today in AI Study Planner`;
      
      const notificationText = buildMessage({ 
        type: 'DAILY_REMINDER', 
        data: { 
          userName,
          pendingCount: tasks.length,
          highestSubject,
          completedYesterday
        } 
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
