const supabase = require('../config/supabaseClient');

const createSyllabus = async (userId, syllabusData) => {
  const { title, description, topics } = syllabusData;

  // Insert syllabus
  const { data: syllabus, error: syllabusError } = await supabase
    .from('syllabus')
    .insert([{ title, description, user_id: userId }])
    .select()
    .single();

  if (syllabusError) throw syllabusError;

  // Insert topics if provided
  if (topics && topics.length > 0) {
    const topicsWithIds = topics.map(topic => ({
      ...topic,
      syllabus_id: syllabus.id,
      user_id: userId
    }));

    const { error: topicsError } = await supabase
      .from('topics')
      .insert(topicsWithIds);

    if (topicsError) throw topicsError;
  }

  return syllabus;
};

module.exports = {
  createSyllabus
};
