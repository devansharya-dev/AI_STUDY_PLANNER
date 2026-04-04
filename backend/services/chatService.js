const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const supabase = require("../config/supabaseClient");

const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11500";
const MODEL = process.env.OLLAMA_MODEL || "llama3";

/* ---------------- CHAT HISTORY ---------------- */

async function getChatHistory(userId) {
  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(20);

  return data || [];
}

/* ---------------- USER CONTEXT ---------------- */

async function getUserContext(userId) {
  const { data: topics } = await supabase
    .from("topics")
    .select("topic")
    .limit(20);

  const { data: tasks } = await supabase
    .from("tasks")
    .select("title, is_completed, due_date")
    .eq("user_id", userId)
    .order("due_date", { ascending: true })
    .limit(10);

  return {
    topics: topics || [],
    tasks: tasks || [],
  };
}

/* ---------------- HELPERS ---------------- */

function getTodayTasks(tasks) {
  const today = new Date().toISOString().split("T")[0];

  return tasks.filter(
    (t) => t.due_date?.startsWith(today) && !t.is_completed
  );
}

function getProgress(tasks) {
  const total = tasks.length || 1;
  const completed = tasks.filter((t) => t.is_completed).length;

  return {
    total,
    completed,
    percent: Math.round((completed / total) * 100),
  };
}

/* ---------------- SAVE MESSAGE ---------------- */

async function saveMessage(userId, role, content) {
  await supabase.from("messages").insert([
    {
      user_id: userId,
      role,
      content,
    },
  ]);
}

/* ---------------- PROMPT ---------------- */

function buildPrompt(history, context, message) {
  const historyText = history
    .map((m) => `${m.role}: ${m.content}`)
    .join("\n");

  const topicsText = context.topics.map((t) => t.topic).join(", ");

  const tasksText = context.tasks
    .map((t) => `${t.title} (${t.is_completed ? "done" : "pending"})`)
    .join("\n");

  const progress = getProgress(context.tasks);

  return `
You are an AI Study Planner Assistant.

USER PROGRESS:
${progress.completed}/${progress.total} completed (${progress.percent}%)

USER TOPICS:
${topicsText}

USER TASKS:
${tasksText}

RULES:
- Give practical study advice
- Use tasks data
- Prefer pending tasks
- Be concise
- No generic answers

Conversation:
${historyText}

User: ${message}
Assistant:
`;
}

/* ---------------- MAIN STREAM FUNCTION ---------------- */

async function streamFromOllama(userId, message, res) {
  const history = await getChatHistory(userId);
  const context = await getUserContext(userId);

  /* 🔥 SMART DIRECT RESPONSE (NO AI NEEDED) */
  if (message.toLowerCase().includes("today")) {
    const todayTasks = getTodayTasks(context.tasks);

    if (todayTasks.length > 0) {
      const response =
        "📚 Today you should focus on:\n" +
        todayTasks.map((t) => `- ${t.title}`).join("\n");

      await saveMessage(userId, "user", message);
      await saveMessage(userId, "assistant", response);

      return res.end(response);
    } else {
      const response = "✅ You have no pending tasks for today.";

      await saveMessage(userId, "user", message);
      await saveMessage(userId, "assistant", response);

      return res.end(response);
    }
  }

  /* 🔥 AI RESPONSE */
  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: buildPrompt(history, context, message),
      stream: true,
      options: { temperature: 0.3 },
    }),
  });

  let fullText = "";

  for await (const chunk of response.body) {
    const text = chunk.toString();

    try {
      const lines = text.split("\n").filter(Boolean);

      for (let line of lines) {
        const parsed = JSON.parse(line);

        if (parsed.response) {
          fullText += parsed.response;
          res.write(parsed.response);
        }
      }
    } catch {}
  }

  await saveMessage(userId, "user", message);
  await saveMessage(userId, "assistant", fullText);

  res.end();
}

module.exports = {
  streamFromOllama,
};