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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="max-w-3xl w-full mx-auto flex flex-col h-full font-sans selection:bg-indigo-100 pb-2"
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-1">AI Assistant</h1>
        <p className="text-sm text-gray-500 font-medium">Your personal study companion.</p>
      </div>

      <div className="flex-1 overflow-y-auto mb-6 pr-2 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm font-medium">
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
                className={`max-w-[85%] text-[15px] leading-relaxed px-5 py-3.5 rounded-2xl shadow-sm ${
                  m.role === 'user' 
                  ? 'bg-gray-900 text-white rounded-br-sm' 
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
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
        className="relative flex items-center bg-white border border-gray-200 hover:border-gray-300 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all rounded-2xl overflow-hidden shadow-sm p-1.5"
      >
        <input 
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Ask me anything..."
          className="flex-1 bg-transparent border-none outline-none text-[15px] text-gray-900 placeholder-gray-400 py-3 pl-4 font-medium"
        />
        <button 
          type="submit" 
          disabled={!input.trim()}
          className="bg-gray-900 text-white p-2.5 mr-1 rounded-xl hover:bg-gray-800 disabled:opacity-30 transition-colors shadow-sm"
        >
          <SendHorizonal size={18} />
        </button>
      </form>
    </motion.div>
  );
}