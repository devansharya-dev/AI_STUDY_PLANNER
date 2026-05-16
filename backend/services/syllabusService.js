const supabase = require('../config/supabaseClient');
const extractTopics = require('./aiService');

const upsertSyllabusService = async (userId, title, content) => {
  // Use UPSERT for syllabus
  const { data: syllabus, error: syllabusError } = await supabase
    .from('syllabus')
    .upsert(
      {
        user_id: userId,
        title: title,
        content: content
      },
      {
        onConflict: "user_id,title"
      }
    )
    .select()
    .single();

  if (syllabusError) throw syllabusError;

  // AI Extraction of topics
  console.log("Calling AI...");
  const topics = await extractTopics(content);
  console.log("TOPICS:", topics);

  // Insert topics if we have them
  // We can skip deleting old topics since the user didn't request it,
  // but if needed, we'd delete them here.
  if (topics && topics.length > 0) {
    const topicsWithIds = topics.map(topicName => ({
      topic: topicName,
      syllabus_id: syllabus.id
    }));

    const { error: topicsError } = await supabase
      .from('topics')
      .insert(topicsWithIds);

    if (topicsError) {
      console.error("Topics insert error:", topicsError);
      // Depending on strictness, we might throw or just log.
      // throw topicsError;
    }
  }

  return { syllabus_id: syllabus.id, topics };
};

module.exports = {
  upsertSyllabusService
};
