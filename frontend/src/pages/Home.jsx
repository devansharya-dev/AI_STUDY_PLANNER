import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col justify-center items-center text-center px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs text-indigo-300 mb-8"
      >
        <Sparkles size={12} />
        <span>Simple, focused study planning.</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 max-w-3xl leading-tight"
      >
        Less planning.<br/>More focused learning.
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg text-slate-400 font-light max-w-xl mb-10 leading-relaxed"
      >
        Upload your syllabus and let AI orchestrate a calm, step-by-step daily queue. Focus on the actual work.
      </motion.p>

      <motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4, duration: 0.5 }}
         className="flex items-center gap-4"
      >
        <Link 
          to="/upload" 
          className="group flex items-center gap-2 px-7 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium text-sm transition-colors shadow-sm"
        >
          Get Started
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}