const supabase = require('../config/supabaseClient');

const getWeeklySummary = async (userId) => {
  try {
    // 1. Fetch user email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', userId)
      .maybeSingle();

    const email = profile?.email || "No Data";

    // 2. Fetch user stats for currentStreak
    const { data: stats } = await supabase
      .from('user_stats')
      .select('current_streak')
      .eq('user_id', userId)
      .maybeSingle();

    const currentStreak = stats?.current_streak || 0;

    // 3. Fetch all tasks for this user
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select(`
        id,
        status,
        completed_at,
        topics!inner (
          topic
        ),
        study_plans!inner (
          user_id
        )
      `)
      .eq('study_plans.user_id', userId);

    if (error) {
      console.error("Error fetching tasks for weekly summary:", error);
    }

    const allTasks = tasks || [];
    
    let completedTasks = 0; // within last 7 days
    let pendingTasks = 0;
    const subjectCompletedCount = {};
    const subjectPendingCount = {};

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    allTasks.forEach(task => {
      let subject = "No Data";
      if (task.topics && task.topics.topic) {
        try {
          const parsed = JSON.parse(task.topics.topic);
          if (parsed.subject) {
            subject = parsed.subject;
          }
        } catch (e) {
          // Fallback if not valid JSON
        }
      }

      if (task.status === 'completed') {
        let isWithinLast7Days = false;
        
        if (task.completed_at) {
          const completedAtDate = new Date(task.completed_at);
          if (completedAtDate >= sevenDaysAgo) {
            isWithinLast7Days = true;
          }
        } else {
          
        }

        if (isWithinLast7Days) {
          completedTasks++;
        }
        
        subjectCompletedCount[subject] = (subjectCompletedCount[subject] || 0) + 1;
      } else {
        pendingTasks++;
        subjectPendingCount[subject] = (subjectPendingCount[subject] || 0) + 1;
      }
    });

    const totalTasks = allTasks.length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    let strongestSubject = "No Data";
    let maxCompleted = -1;
    for (const [sub, count] of Object.entries(subjectCompletedCount)) {
      if (count > maxCompleted) {
        maxCompleted = count;
        strongestSubject = sub;
      }
    }

    let weakestSubject = "No Data";
    let maxPending = -1;
    for (const [sub, count] of Object.entries(subjectPendingCount)) {
      if (count > maxPending) {
        maxPending = count;
        weakestSubject = sub;
      }
    }

    let estimatedNextWeekLoad = "Light";
    if (pendingTasks >= 16) {
      estimatedNextWeekLoad = "Heavy";
    } else if (pendingTasks >= 6) {
      estimatedNextWeekLoad = "Moderate";
    }

    return {
      userId,
      email,
      completedTasks,
      pendingTasks,
      currentStreak,
      completionRate,
      strongestSubject,
      weakestSubject,
      estimatedNextWeekLoad
    };
  } catch (error) {
    console.error("Weekly summary error:", error);
    return {
      userId,
      email: "No Data",
      completedTasks: 0,
      pendingTasks: 0,
      currentStreak: 0,
      completionRate: 0,
      strongestSubject: "No Data",
      weakestSubject: "No Data",
      estimatedNextWeekLoad: "Light"
    };
  }
};

const getAllWeeklySummaries = async () => {
  try {
    const { data: users, error } = await supabase
      .from('profiles')
      .select('id, email');

    if (error) {
      console.error("Error fetching users for weekly summaries:", error);
      throw error;
    }

    if (!users || users.length === 0) return [];

    const validUsers = users.filter(u => u.email);

    const summaries = await Promise.all(
      validUsers.map(async (user) => {
        return await getWeeklySummary(user.id);
      })
    );

    return summaries;
  } catch (err) {
    console.error("getAllWeeklySummaries error:", err);
    throw err;
  }
};

module.exports = {
  getWeeklySummary,
  getAllWeeklySummaries
};
