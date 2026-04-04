const { streamFromOllama } = require("../services/chatService");

const chat = async (req, res) => {
  const userId = req.user?.id;
  const { message } = req.body;

  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  await streamFromOllama(userId, message, res);
};

module.exports = { chat };