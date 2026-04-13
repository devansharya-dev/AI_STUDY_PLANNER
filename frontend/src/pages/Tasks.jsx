import useTasks from "../hooks/useTasks";
import TaskCard from "../components/TaskCard";
import { motion, AnimatePresence } from "framer-motion";

export default function Tasks() {
  const { tasks, toggle } = useTasks();

  const completedCount = tasks?.filter(t => t.is_completed).length || 0;
  const totalCount = tasks?.length || 0;

  return (
    <div className="max-w-2xl w-full mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 flex justify-between items-end border-b border-slate-800/50 pb-6"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Queue</h1>
          <p className="text-sm text-slate-400">Your planned activities for the day.</p>
        </div>
        <div className="text-slate-400 font-medium text-xs">
            {completedCount} / {totalCount} Done
        </div>
      </motion.div>

      <div className="space-y-1">
        <AnimatePresence>
          {tasks?.map((task, i) => (
            <TaskCard key={task.id} task={task} onToggle={toggle} index={i} />
          ))}
        </AnimatePresence>
        
        {(!tasks || tasks.length === 0) && (
            <div className="text-center py-20 text-slate-500 text-sm">
                No tasks available. Upload a syllabus to begin.
            </div>
        )}
      </div>
    </div>
  );
}