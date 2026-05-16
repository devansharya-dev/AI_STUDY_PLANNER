import useTasks from "../hooks/useTasks";
import { Check, Calendar } from "lucide-react";
import { motion as Motion, AnimatePresence } from "framer-motion";

export default function Tasks() {
  const { tasks, toggle } = useTasks();

  const completedCount = tasks?.filter(t => t.status === 'completed').length || 0;
  const totalCount = tasks?.length || 0;

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-5xl selection:bg-[#d7b98d]/40"
    >
      <div className="mb-8 flex flex-col gap-6 border-b border-[#5b3215]/10 pb-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow mb-3">Daily work</p>
          <h1 className="font-heading text-5xl font-bold tracking-normal text-[#17140f] md:text-6xl">Your Queue</h1>
          <p className="mt-3 text-lg font-semibold text-[#746b5f]">Daily activities and focused sessions.</p>
        </div>
        <div className="inline-flex items-center gap-3 rounded-full border border-[#8a5a2b]/15 bg-[#8a5a2b]/10 px-5 py-3 shadow-sm">
          <Calendar size={18} className="text-[#8a5a2b]" />
          <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#8a5a2b]">
            {completedCount} / {totalCount} Done
          </span>
        </div>
      </div>

      <div className="space-y-3 pb-12">
        <AnimatePresence>
          {tasks?.map((task) => (
            <Motion.div 
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={() => toggle(task.id, task.status === 'completed' ? 'pending' : 'completed')}
              className={`group flex cursor-pointer items-center justify-between rounded-2xl border px-5 py-5 transition-all duration-300 ${
                task.status === 'completed' 
                  ? 'border-[#5b3215]/10 bg-[#efe1cc]/50 opacity-70 hover:opacity-100' 
                  : 'premium-card hover:-translate-y-0.5 hover:border-[#8a5a2b]/30'
              }`}
            >
              <div className="flex items-center gap-6 w-full">
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${
                  task.status === 'completed' 
                    ? 'border-[#60785f] bg-[#60785f]' 
                    : 'border-[#8a5a2b]/25 bg-[#fffdf8] group-hover:border-[#8a5a2b]'
                }`}>
                  {task.status === 'completed' && <Check size={16} className="text-[#fffaf1]" strokeWidth={4} />}
                </div>
                <span className={`text-lg font-extrabold transition-all duration-300 md:text-xl ${
                  task.status === 'completed' ? 'text-[#9b907f] line-through decoration-2' : 'text-[#31281f] group-hover:text-[#17140f]'
                }`}>
                  {task.topic || "No Topic"}
                </span>
              </div>
            </Motion.div>
          ))}
        </AnimatePresence>
        
        {(!tasks || tasks.length === 0) && (
          <div className="premium-card flex flex-col items-center justify-center rounded-2xl border-dashed px-4 py-24 text-center">
              <p className="mb-2 text-xl font-extrabold text-[#17140f]">Your queue is empty.</p>
              <p className="text-base font-semibold text-[#746b5f]">Upload a new syllabus to automatically generate your tasks.</p>
          </div>
        )}
      </div>
    </Motion.div>
  );
}
