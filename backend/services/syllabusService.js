const supabase = require('../config/supabaseClient');

const parseSyllabus = (text) => {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(l => l.length > 0);
  if (lines.length === 0) return { subject: "Unknown Subject", topics: [] };

  let currentSubject = "Unknown Subject";
  let currentUnit = "General";
  const parsedTopics = [];
  
  // Detect subject names from syllabus structure
  const subjectMatch = lines.find(l => /^(?:course|subject|syllabus)[:\-]?\s+(.+)$/i.test(l));
  if (subjectMatch) {
    const match = subjectMatch.match(/^(?:course|subject|syllabus)[:\-]?\s+(.+)$/i);
    currentSubject = match[1].trim();
  } else if (lines[0] && lines[0].length < 100) {
    currentSubject = lines[0].replace(/^(?:course syllabus|syllabus)[:\-]?\s*/i, '').trim();
  }

  const unitRegex = /^(?:unit|chapter|week|module|section)\s+\d+[:\-]?\s*(.*)$/i;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip if it's the subject line or the first line (if we used it as subject)
    if (line === currentSubject || /^(?:course|subject|syllabus)[:\-]?\s+(.+)$/i.test(line) || (i === 0 && currentSubject === lines[0].replace(/^(?:course syllabus|syllabus)[:\-]?\s*/i, '').trim())) {
      continue;
    }

    const unitMatch = line.match(unitRegex);
    if (unitMatch) {
      currentUnit = line;
      continue;
    }

    let topicName = line.replace(/^[-*•]\s*/, '').trim();
    if (topicName.length > 2) {
      parsedTopics.push({
        subject: currentSubject,
        unit: currentUnit,
        topic: topicName
      });
    }
  }

  return { subject: currentSubject, topics: parsedTopics };
};

const upsertSyllabusService = async (userId, title, content) => {
  const parsedData = parseSyllabus(content);
  let finalTitle = title;
  
  if (!finalTitle || finalTitle.toLowerCase().includes('raw syllabus') || finalTitle.toLowerCase().includes('untitled')) {
    finalTitle = parsedData.subject;
  }

  // Use UPSERT for syllabus
  const { data: syllabus, error: syllabusError } = await supabase
    .from('syllabus')
    .upsert(
      {
        user_id: userId,
        title: finalTitle,
        content: content
      },
      {
        onConflict: "user_id,title"
      }
    )
    .select()
    .single();

  if (syllabusError) throw syllabusError;

  // Insert topics if we have them
  if (parsedData.topics && parsedData.topics.length > 0) {
    await supabase.from('topics').delete().eq('syllabus_id', syllabus.id);

    const topicsWithIds = parsedData.topics.map(tObj => ({
      syllabus_id: syllabus.id,
      topic: JSON.stringify(tObj) // Store structured syllabus hierarchy
    }));

    const { error: topicsError } = await supabase
      .from('topics')
      .insert(topicsWithIds);

    if (topicsError) {
      console.error("Topics insert error:", topicsError);
    }
  }

  return { syllabus_id: syllabus.id, topics: parsedData.topics };
};

const getSyllabusAnalyticsService = async (userId) => {
  // Fetch all syllabus for user
  const { data: syllabuses, error: syllabusError } = await supabase
    .from('syllabus')
    .select('id, title')
    .eq('user_id', userId);

  if (syllabusError) throw syllabusError;
  
  if (!syllabuses || syllabuses.length === 0) {
    return {
      totalTopics: 0,
      subjects: 0,
      hardestSubject: "None",
      largestSubject: "None",
      estimatedWeeks: 0,
      dailyStudyLoad: 0
    };
  }

  const syllabusIds = syllabuses.map(s => s.id);

  // Fetch all topics for these syllabuses
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('id, syllabus_id, topic')
    .in('syllabus_id', syllabusIds);

  if (topicsError) throw topicsError;

  // Parse topics from JSON strings
  const parsedTopics = [];
  if (topics) {
    topics.forEach(t => {
      try {
        const obj = JSON.parse(t.topic);
        if (obj.subject) {
          parsedTopics.push(obj);
        } else {
          parsedTopics.push({ subject: "Core Subjects", unit: "General", topic: t.topic });
        }
      } catch (e) {
        parsedTopics.push({ subject: "Core Subjects", unit: "General", topic: t.topic });
      }
    });
  }

  const totalTopics = parsedTopics.length;
  
  if (totalTopics === 0) {
    return {
      totalTopics: 0,
      subjects: syllabuses.length,
      hardestSubject: "None",
      largestSubject: "None",
      estimatedWeeks: 0,
      dailyStudyLoad: 0
    };
  }

  // Count topics per subject (using real subject names)
  const subjectSet = new Set();
  const subjectTopicCounts = {};

  parsedTopics.forEach(t => {
    subjectSet.add(t.subject);
    subjectTopicCounts[t.subject] = (subjectTopicCounts[t.subject] || 0) + 1;
  });
  
  // Calculate subjects based on detected unique subjects or fallback
  const subjects = subjectSet.size || syllabuses.length;

  let maxTopics = -1;
  let largestSubjectName = "None";

  for (const [sub, count] of Object.entries(subjectTopicCounts)) {
    if (count > maxTopics) {
      maxTopics = count;
      largestSubjectName = sub;
    }
  }

  // Calculate estimatedWeeks and dailyStudyLoad based on logic requested:
  // deterministic, simple logic
  const estimatedWeeks = Math.max(1, Math.ceil(totalTopics / 20));
  const dailyStudyLoad = Math.max(1, Math.ceil(totalTopics / (estimatedWeeks * 7)));

  return {
    totalTopics,
    subjects,
    hardestSubject: largestSubjectName, // as manually estimated using topic count
    largestSubject: largestSubjectName,
    estimatedWeeks,
    dailyStudyLoad
  };
};

module.exports = {
  upsertSyllabusService,
  getSyllabusAnalyticsService
};
