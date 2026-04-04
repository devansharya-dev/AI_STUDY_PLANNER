import { useState } from "react";
import { streamChat } from "../services/chatService";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input || loading) return;

    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    setInput("");
    setLoading(true);

    let botText = "";

    setMessages((prev) => [...prev, { role: "bot", text: "" }]);

    await streamChat(input, (chunk) => {
      botText = chunk;

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].text = botText;
        return updated;
      });
    });

    setLoading(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>AI Study Chat</h2>

      <div style={{ minHeight: 300, marginBottom: 20 }}>
        {messages.map((m, i) => (
          <div key={i}>
            <b>{m.role}:</b> {m.text}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask anything..."
      />

      <button onClick={handleSend}>
        {loading ? "Thinking..." : "Send"}
      </button>
    </div>
  );
}