import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col justify-center items-center text-center px-4 font-sans selection:bg-indigo-100">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs font-bold text-gray-600 mb-8 shadow-sm"
      >
        <Sparkles size={12} className="text-indigo-500" />
        <span className="uppercase tracking-widest text-[10px]">Simple, focused study planning</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-5xl md:text-7xl font-bold tracking-tighter text-gray-900 mb-6 max-w-3xl leading-tight"
      >
        Less planning.<br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">More focused learning.</span>
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-lg md:text-xl text-gray-500 font-medium max-w-2xl mb-10 leading-relaxed"
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
          className="group flex items-center gap-2 px-8 py-4 bg-gray-900 hover:bg-black text-white rounded-2xl font-bold tracking-wide transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          Get Started
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </motion.div>
    </div>
  );
}