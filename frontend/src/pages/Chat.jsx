import { useState, useRef, useEffect } from "react";
import { streamChat } from "../services/chatService";
import { motion, AnimatePresence } from "framer-motion";
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
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1].text = "Error: Connection failed.";
        return updated;
      });
    }
  };

  return (
    <div className="max-w-3xl w-full mx-auto py-8 px-4 flex flex-col h-[calc(100vh-80px)]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">AI Assistant</h1>
        <p className="text-sm text-slate-400">Your personal study companion.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-slate-500 text-sm">
            How can I help you with your studies today?
          </div>
        )}
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i} 
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[85%] text-sm leading-relaxed px-5 py-3 rounded-2xl ${
                  m.role === 'user' 
                  ? 'bg-indigo-500 text-white rounded-br-sm' 
                  : 'bg-[#0f172a] text-slate-200 border border-slate-800 rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <form 
        onSubmit={send} 
        className="relative flex items-center bg-[#0f172a] border border-slate-700/50 hover:border-slate-600 focus-within:border-indigo-500/50 transition-colors rounded-2xl overflow-hidden shadow-lg p-1"
      >
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent border-none outline-none text-sm text-slate-200 placeholder-slate-500 py-3 pl-4"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-indigo-500 text-white p-2 mr-1 rounded-xl hover:bg-indigo-600 disabled:opacity-50 transition-colors"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </div>
  );
}