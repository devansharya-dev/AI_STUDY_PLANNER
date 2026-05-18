const supabase = require('../config/supabaseClient');

const DAY_MS = 1000 * 60 * 60 * 24;

const toDateKey = (date) => new Date(date).toISOString().split('T')[0];

const getActiveStreak = (completionDates) => {
  if (!completionDates.length) return 0;

  const uniqueDates = [...new Set(completionDates.map(toDateKey))].sort().reverse();
  const todayKey = toDateKey(new Date());
  const yesterdayKey = toDateKey(Date.now() - DAY_MS);

  if (uniqueDates[0] !== todayKey && uniqueDates[0] !== yesterdayKey) {
    return 0;
  }

  let streak = 1;

  for (let i = 1; i < uniqueDates.length; i += 1) {
    const previous = new Date(uniqueDates[i - 1]);
    const current = new Date(uniqueDates[i]);
    const diffDays = Math.round((previous - current) / DAY_MS);

    if (diffDays !== 1) break;
    streak += 1;
  }

  return streak;
};

const getLongestStreak = (completionDates) => {
  if (!completionDates.length) return 0;

  const uniqueDates = [...new Set(completionDates.map(toDateKey))].sort();
  let longest = 1;
  let current = 1;

  for (let i = 1; i < uniqueDates.length; i += 1) {
    const previous = new Date(uniqueDates[i - 1]);
    const next = new Date(uniqueDates[i]);
    const diffDays = Math.round((next - previous) / DAY_MS);

    current = diffDays === 1 ? current + 1 : 1;
    longest = Math.max(longest, current);
  }

  return longest;
};

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all tasks for the user
    const { data: tasks, error: tasksError } = await supabase
      .from('tasks')
      .select(`
        status,
        due_date,
        completed_at,
        study_plans!inner (
          user_id
        )
      `)
      .eq('study_plans.user_id', userId);

    if (tasksError) throw tasksError;

    const taskRows = tasks || [];
    const totalTasks = taskRows.length;
    const completedTasks = taskRows.filter(t => t.status === 'completed').length;
    const remainingTasks = totalTasks - completedTasks;
    const pendingTasks = taskRows.filter(t => t.status === 'pending').length;
    const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    const pendingToday = taskRows.filter((task) => {
      if (task.status !== 'pending' || !task.due_date) return false;
      const dueDate = new Date(task.due_date);
      return dueDate >= todayStart && dueDate < tomorrowStart;
    }).length;

    const completedDates = taskRows
      .filter((task) => task.status === 'completed' && task.completed_at)
      .map((task) => task.completed_at);

    let currentStreak = getActiveStreak(completedDates);
    let longestStreak = getLongestStreak(completedDates);

    const { data: storedStats } = await supabase
      .from('user_stats')
      .select('current_streak, longest_streak, last_completed_date')
      .eq('user_id', userId)
      .maybeSingle();

    if (storedStats) {
      const todayKey = toDateKey(new Date());
      const yesterdayKey = toDateKey(Date.now() - DAY_MS);
      const lastCompletedKey = storedStats.last_completed_date
        ? toDateKey(storedStats.last_completed_date)
        : null;

      if (lastCompletedKey === todayKey || lastCompletedKey === yesterdayKey) {
        currentStreak = Math.max(currentStreak, storedStats.current_streak || 0);
      }

      longestStreak = Math.max(longestStreak, storedStats.longest_streak || 0);
    }

    return res.status(200).json({
      data: {
        totalTasks,
        completedTasks,
        remainingTasks,
        progressPercentage,
        currentStreak,
        longestStreak,
        pendingTasks,
        pendingToday
      }
    });
  } catch (error) {
    return res.status(400).json({ error: error.message || 'Error fetching stats' });
  }
};

module.exports = {
  getDashboardStats
};
