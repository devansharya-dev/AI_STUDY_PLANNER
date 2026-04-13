const { streamFromOllama, getChatHistory } = require("../services/chatService");

const chat = async (req, res) => {
  const userId = req.user?.id;
  const { message } = req.body;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  await streamFromOllama(userId, message, res);
};

const getHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    const history = await getChatHistory(userId);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: "Failed to get chat history" });
  }
};

module.exports = { chat, getHistory };