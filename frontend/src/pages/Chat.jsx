import { useState, useRef, useEffect } from "react";
import { streamChat } from "../services/chatService";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { SendHorizonal } from "lucide-react";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: input }]);
    const currentInput = input;
    setInput("");

    setMessages(prev => [...prev, { role: "bot", text: "..." }]);
    let botText = "";

    try {
      await streamChat(currentInput, (chunk) => {
        botText = chunk;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].text = botText;
          return updated;
        });
      });
    } catch {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Error: Connection failed.";
        return updated;
      });
    }
  };

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mx-auto flex min-h-[calc(100dvh-132px)] w-full max-w-3xl flex-col selection:bg-[#d7b98d]/40"
    >
      <div className="mb-8 text-center">
        <p className="eyebrow mb-3">Companion</p>
        <h1 className="font-heading text-5xl font-bold tracking-normal text-[#17140f]">AI Assistant</h1>
        <p className="mt-2 text-sm font-semibold text-[#746b5f]">Your personal study companion.</p>
      </div>

      <div className="mb-6 flex-1 space-y-6 overflow-y-auto pr-2">
        {messages.length === 0 && (
          <div className="premium-card flex h-full min-h-64 items-center justify-center rounded-2xl text-sm font-bold text-[#746b5f]">
            How can I help you with your studies today?
          </div>
        )}
        <AnimatePresence>
          {messages.map((m, i) => (
            <Motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] text-[15px] leading-relaxed px-5 py-3.5 rounded-2xl shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-[#17140f] text-[#fffaf1] rounded-br-sm' 
                  : 'bg-[#fffdf8] text-[#31281f] border border-[#5b3215]/10 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <form 
        onSubmit={send} 
        className="premium-panel relative flex items-center overflow-hidden rounded-2xl p-1.5 transition-all focus-within:border-[#8a5a2b]/40 focus-within:ring-4 focus-within:ring-[#8a5a2b]/10"
      >
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask me anything..."
          className="flex-1 border-none bg-transparent py-3 pl-4 text-[15px] font-semibold text-[#17140f] outline-none placeholder:text-[#9b907f]"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="mr-1 rounded-xl bg-[#17140f] p-2.5 text-[#fffaf1] shadow-sm transition-colors hover:bg-[#5b3215] disabled:opacity-30"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </Motion.div>
  );
}
