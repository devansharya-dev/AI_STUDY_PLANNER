const buildMessage = ({ type, data }) => {
  switch (type) {
    case 'SYLLABUS_PROCESSED':
      return `Your syllabus has been analyzed successfully.\n\nWe identified ${data?.topicCount || 'multiple'} study topics and generated your personalized study roadmap.\n\nYou can now begin organizing your sessions and tracking your learning progress inside AI Study Planner.`;

    case 'DAILY_REMINDER':
      return `It's time to dive in.\n\nYou have ${data?.pendingCount || 'a few'} pending tasks curated for your study session today. Consistent daily action is the secret to mastery.\n\nLog in now to review your queue and make today count.`;

    case 'STREAK_ALERT':
      return `Incredible momentum!\n\nYou've maintained a focused study streak for ${data?.streakDays || 0} consecutive days. Your dedication to your learning goals is truly setting you apart.\n\nKeep pushing your boundaries. We're here to optimize the rest of your journey.`;

    case 'WELCOME':
      return `Initialization Complete.\n\nHyy there! Welcome to our portal. We are incredibly excited to have you onboard.\n\nYour AI Study Planner is now ready to help you absolutely destroy procrastination. Log in now to spin up your very first optimized study queue.\n\nStay focused,\nThe AI Study Planner Team`;

    default:
      return `You have a new update in your AI Study Planner.\n\nPlease log in to your dashboard to review the latest changes to your study roadmap.`;
  }
};

module.exports = {
  buildMessage
};
