import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await fetchTasks();
      setTasks(data || []);
    } catch(e) {}
  };

  const completed = tasks.filter(t => t.is_completed).length;
  const total = tasks.length || 1;
  const percent = Math.round((completed / total) * 100);

  return (
    <div className="max-w-2xl w-full mx-auto py-12 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-2xl font-semibold tracking-tight text-white mb-1">Dashboard</h1>
        <p className="text-sm text-slate-400">Quick glance at your progress and priorities.</p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4 mb-12"
      >
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">Completion</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold text-white tracking-tight">{percent}%</span>
          </div>
        </div>
        <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6">
          <div className="text-xs text-slate-400 mb-2 uppercase tracking-wide font-medium">Tasks Left</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-semibold text-white tracking-tight">{tasks.length - completed}</span>
            <span className="text-sm text-slate-500 mb-1 font-medium">/ {tasks.length}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-sm font-medium text-white mb-4 border-b border-slate-800/50 pb-2">Up Next</h3>
        <div className="space-y-1">
          {tasks.slice(0, 4).map((t, i) => (
            <div key={t.id || i} className="flex gap-3 items-center py-2 border-b border-slate-800/30">
              <div className={`w-1.5 h-1.5 rounded-full ${t.is_completed ? 'bg-slate-700' : 'bg-indigo-500'}`} />
              <div className={`text-sm tracking-wide ${t.is_completed ? 'line-through text-slate-600' : 'text-slate-300'}`}>
                  {t.title}
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-slate-500 text-sm py-4">
              All caught up. Start a new plan to continue.
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}