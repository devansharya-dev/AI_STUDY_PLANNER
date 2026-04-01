const supabase = require('../config/supabaseClient');

const DIFFICULTY_WEIGHT = {
  easy: 1,
  medium: 2,
  hard: 3
};

// MAIN FUNCTION
const generateStudyPlan = async (userId, syllabusId, planData) => {
  const {
    start_date = new Date(),
    duration_days = 7
  } = planData;

  // 1. Fetch topics
  const { data: topics, error } = await supabase
    .from('topics')
    .select('*')
    .eq('syllabus_id', syllabusId);

  if (error) throw error;
  if (!topics || topics.length === 0) {
    throw new Error('No topics found');
  }

  // 2. Enrich topics
  let enrichedTopics = topics.map(t => ({
    ...t,
    difficulty: t.difficulty || "medium",
    weight: DIFFICULTY_WEIGHT[t.difficulty] || 2
  }));

  // Shuffle to balance load
  enrichedTopics = shuffle(enrichedTopics);

  // 3. Create study plan
  const { data: plan, error: planError } = await supabase
    .from('study_plans')
    .insert([{
      syllabus_id: syllabusId,
      user_id: userId,
      start_date,
      duration_days
    }])
    .select()
    .single();

  if (planError) throw planError;

  const tasks = [];
  const DAILY_CAPACITY = 4;

  let topicQueue = [...enrichedTopics];
  let completedTopics = [];

  // 4. Generate daily schedule
  for (let day = 0; day < duration_days; day++) {
    const dueDate = new Date(start_date);
    dueDate.setDate(dueDate.getDate() + day);

    const isRevisionDay = (day + 1) % 3 === 0;

    // 🔹 REVISION DAY
    if (isRevisionDay) {
      const revisionSet = completedTopics.slice(-5);

      revisionSet.forEach(topic => {
        tasks.push({
          plan_id: plan.id,
          topic_id: topic.id,
          user_id: userId,
          title: `Revision: ${topic.topic}`,
          due_date: dueDate.toISOString(),
          is_completed: false
        });
      });

      continue;
    }

    // 🔹 STUDY DAY
    let usedCapacity = 0;

    while (
      topicQueue.length &&
      usedCapacity + topicQueue[0].weight <= DAILY_CAPACITY
    ) {
      const topic = topicQueue.shift();

      tasks.push({
        plan_id: plan.id,
        topic_id: topic.id,
        user_id: userId,
        title: topic.topic,
        due_date: dueDate.toISOString(),
        is_completed: false
      });

      usedCapacity += topic.weight;
      completedTopics.push(topic);
    }
  }

  // 🔥 HANDLE LEFTOVER TOPICS (auto-extend plan)
  let extraDay = duration_days;

  while (topicQueue.length) {
    const dueDate = new Date(start_date);
    dueDate.setDate(dueDate.getDate() + extraDay);

    let usedCapacity = 0;

    while (
      topicQueue.length &&
      usedCapacity + topicQueue[0].weight <= DAILY_CAPACITY
    ) {
      const topic = topicQueue.shift();

      tasks.push({
        plan_id: plan.id,
        topic_id: topic.id,
        user_id: userId,
        title: topic.topic,
        due_date: dueDate.toISOString(),
        is_completed: false
      });

      usedCapacity += topic.weight;
      completedTopics.push(topic);
    }

    extraDay++;
  }

  // 🔹 FINAL REVISION DAY
  const finalDate = new Date(start_date);
  finalDate.setDate(finalDate.getDate() + extraDay);

  completedTopics.forEach(topic => {
    tasks.push({
      plan_id: plan.id,
      topic_id: topic.id,
      user_id: userId,
      title: `Final Revision: ${topic.topic}`,
      due_date: finalDate.toISOString(),
      is_completed: false
    });
  });

  // 5. Insert tasks
  const { error: tasksError } = await supabase
    .from('tasks')
    .insert(tasks);

  if (tasksError) throw tasksError;

  return {
    plan,
    totalTopics: topics.length,
    tasksCount: tasks.length,
    extendedDays: extraDay
  };
};

// 🔹 Shuffle helper
function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

module.exports = {
  generateStudyPlan
};