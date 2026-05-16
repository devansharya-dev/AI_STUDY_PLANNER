import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function TaskCard({ task, onToggle, index }) {
  return (
    <motion.div 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.03 }}
        className={`flex items-center gap-4 p-4 rounded-xl border group cursor-pointer transition-all duration-300
          ${task.status === 'completed' ? 'bg-gray-50 border-transparent shadow-none' : 'bg-white border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'}`}
        onClick={() => onToggle(task.id, task.status === 'completed' ? 'pending' : 'completed')}
    >
      <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0 border
          ${task.status === 'completed' ? 'border-indigo-500 bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.4)]' : 'border-gray-300 bg-transparent group-hover:border-gray-400'}`}>
        {task.status === 'completed' && <Check size={12} className="text-white" strokeWidth={3} />}
      </div>
      
      <div className="flex-1">
        <span className={`text-[15px] font-medium tracking-wide transition-colors
            ${task.status === 'completed' ? 'line-through text-gray-400' : 'text-gray-800 group-hover:text-black'}`}>
            {task.topic || "No Topic"}
        </span>
      </div>
      
      {task.status !== 'completed' && (
        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-500">
          Pending
        </span>
      )}
    </motion.div>
  );
}