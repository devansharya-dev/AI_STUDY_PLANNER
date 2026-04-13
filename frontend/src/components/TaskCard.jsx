import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function TaskCard({ task, onToggle, index }) {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`flex items-center gap-4 py-3 border-b border-slate-800/50 group cursor-pointer`}
        onClick={() => onToggle(task)}
    >
      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors flex-shrink-0
          ${task.is_completed ? 'border-indigo-500 bg-indigo-500' : 'border-slate-700 bg-transparent group-hover:border-slate-500'}`}>
        {task.is_completed && <Check size={12} className="text-white" />}
      </div>
      
      <div className="flex-1">
        <span className={`text-sm tracking-wide transition-colors
            ${task.is_completed ? 'line-through text-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
            {task.title || "Unnamed Task"}
        </span>
      </div>
    </motion.div>
  );
}