const buildMessage = ({ type, data }) => {
  switch (type) {
    case 'SYLLABUS_PROCESSED':
      return `Your syllabus has been analyzed successfully.\n\nWe identified ${data?.topicCount || 'multiple'} study topics and generated your personalized study roadmap.\n\nYou can now begin organizing your sessions and tracking your learning progress inside AI Study Planner.`;

    case 'DAILY_REMINDER':
      return `Hi ${data?.userName || 'Student'},\n\nYou currently have ${data?.pendingCount || 0} pending study tasks remaining today.\n\nYour highest pending workload is in ${data?.highestSubject || 'your subjects'}, so focus there first before moving to smaller subjects.\n\nYou completed ${data?.completedYesterday || 0} tasks yesterday — keep that momentum going and try not to break your consistency streak.\n\nConsistent daily progress beats last-minute cramming every time.`;

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
