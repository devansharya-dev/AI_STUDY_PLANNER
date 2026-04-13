export const streamChat = async (message, onChunk) => {
  const token = localStorage.getItem("token");
  const res = await fetch("http://localhost:5000/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { "Authorization": `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ message }),
  });

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let fullText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    fullText += chunk;

    onChunk(fullText);
  }
};