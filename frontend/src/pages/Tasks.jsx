import useTasks from "../hooks/useTasks";
import { Check, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Tasks() {
  const { tasks, toggle } = useTasks();

  const completedCount = tasks?.filter(t => t.status === 'completed').length || 0;
  const totalCount = tasks?.length || 0;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full font-sans selection:bg-indigo-100 flex flex-col"
    >
      <div className="shrink-0 mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 border-b border-gray-200 pb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">Your Queue</h1>
          <p className="text-lg text-gray-500 font-medium">Daily activities and focused sessions.</p>
        </div>
        <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-white border border-gray-200 rounded-xl shadow-sm">
          <Calendar size={18} className="text-indigo-500" />
          <span className="text-gray-800 font-bold text-sm tracking-widest uppercase">
            {completedCount} / {totalCount} Done
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 pr-2 space-y-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <AnimatePresence>
          {tasks?.map((task) => (
            <motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={() => toggle(task.id, task.status === 'completed' ? 'pending' : 'completed')}
              className={`group flex items-center justify-between border-2 rounded-2xl px-6 py-5 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md hover:-translate-y-1 ${
                task.status === 'completed' 
                  ? 'bg-gray-50 border-gray-100 opacity-60 hover:opacity-100' 
                  : 'bg-white border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-6 w-full">
                <div className={`w-7 h-7 shrink-0 rounded-lg border-2 flex items-center justify-center transition-colors duration-300 ${
                  task.status === 'completed' 
                    ? 'bg-indigo-500 border-indigo-500' 
                    : 'border-gray-300 bg-gray-50 group-hover:border-indigo-400'
                }`}>
                  {task.status === 'completed' && <Check size={16} className="text-white" strokeWidth={4} />}
                </div>
                <span className={`text-lg md:text-xl font-semibold transition-all duration-300 ${
                  task.status === 'completed' ? 'text-gray-400 line-through decoration-2' : 'text-gray-800'
                }`}>
                  {task.topic || "No Topic"}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {(!tasks || tasks.length === 0) && (
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border-2 border-gray-200 border-dashed">
              <p className="text-gray-500 text-xl font-bold mb-2">Your queue is empty.</p>
              <p className="text-gray-400 text-base font-medium">Upload a new syllabus to automatically generate your tasks.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}