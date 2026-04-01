const cron = require('node-cron');
const logger = require('../utils/logger');
const reminderJob = require('../jobs/reminderJob');

const init = () => {
  logger.info('Initializing Scheduler Service...');

  // Schedule job: runs every morning at 9:00 AM
  // For quick local testing, you can change '0 9 * * *' to '* * * * *' (every minute)
  cron.schedule('0 9 * * *', async () => {
    logger.info('Executing scheduled job: sendDailyReminders');
    await reminderJob.sendDailyReminders();
  });

  logger.info('Scheduler Service successfully initialized.');
};

module.exports = {
  init,
};
