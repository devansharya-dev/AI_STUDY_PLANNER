import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";
import { motion } from "framer-motion";
import { Activity, Target, Clock, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

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

  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length || 1;
  const percent = Math.round((completed / total) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full h-full font-sans text-gray-900 selection:bg-indigo-100 flex flex-col"
    >
      
      {/* --- HEADER --- */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="shrink-0 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8"
      >
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full mb-4">
            <div className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">System Active</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">
            Mission Control
          </h1>
          <p className="text-lg text-gray-500 font-medium">
            A bird's eye view of your intellectual progress.
          </p>
        </div>
      </motion.div>

      <div className="flex-1 overflow-y-auto pb-12 pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* --- STATS GRID --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10"
        >
          {/* Progress Card */}
          <div className="group relative overflow-hidden bg-white border-2 border-gray-100 hover:border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-500 rounded-3xl p-8 md:p-10">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity duration-500">
              <Activity size={180} strokeWidth={1} className="text-indigo-900 rotate-12 -translate-y-10 translate-x-10" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 text-indigo-500 mb-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                </div>
                <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400">Completion Rate</h3>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-8xl font-black tracking-tighter text-gray-900">{percent}</span>
                <span className="text-4xl text-gray-300 font-bold">%</span>
              </div>
              
              <div className="mt-10 w-full h-4 bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                <motion.div
                  className="h-full bg-indigo-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Active Queue Card */}
          <div className="group relative overflow-hidden bg-gray-900 border-2 border-gray-800 shadow-sm hover:shadow-xl transition-all duration-500 rounded-3xl p-8 md:p-10">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
              <Target size={180} strokeWidth={1} className="text-white -rotate-12 -translate-y-10 translate-x-10" />
            </div>
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 text-indigo-400 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700">
                    <Zap size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="text-sm uppercase tracking-widest font-bold text-gray-400">Active Queue</h3>
                </div>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-8xl font-black tracking-tighter text-white">{tasks.length - completed}</span>
                  <span className="text-lg font-bold tracking-widest uppercase text-gray-500">Remaining</span>
                </div>
                <p className="mt-4 text-lg text-gray-400 font-medium">Out of {tasks.length} total objectives generated by AI.</p>
              </div>
              
              <Link to="/tasks" className="mt-8 self-start inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 hover:bg-gray-100 rounded-xl font-bold text-sm transition-colors">
                View Queue
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>

        {/* --- UP NEXT SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="bg-white border-2 border-gray-100 shadow-sm rounded-3xl p-8 md:p-10"
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-extrabold text-gray-900 flex items-center gap-3">
              <Clock size={24} className="text-indigo-500" />
              Up Next
            </h3>
            <Link to="/tasks" className="text-sm font-bold text-indigo-500 hover:text-indigo-600">See All</Link>
          </div>
          
          <div className="space-y-4">
            {tasks.slice(0, 5).map((t, i) => {
              const isCompleted = t.status === 'completed';
              return (
                <div 
                  key={t.id || i} 
                  className={`group flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-300 ${
                    isCompleted ? 'bg-gray-50 border-gray-100' : 'bg-white border-gray-100 hover:border-indigo-100 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-3 h-3 rounded-full transition-colors ${
                      isCompleted ? 'bg-gray-300' : 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                    }`} />
                    <div className={`text-lg md:text-xl font-bold transition-colors ${
                      isCompleted ? 'line-through text-gray-400' : 'text-gray-800 group-hover:text-gray-900'
                    }`}>
                        {t.topic || "Unidentified Focus"}
                    </div>
                  </div>
                  
                  <span className={`text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full ${
                    isCompleted ? 'bg-gray-100 text-gray-500' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                  }`}>
                    {t.status || 'pending'}
                  </span>
                </div>
              );
            })}
            
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
                <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6">
                  <CheckCircle2 strokeWidth={2.5} size={32} className="text-indigo-400" />
                </div>
                <p className="text-gray-900 text-2xl font-extrabold mb-2">All caught up.</p>
                <p className="text-gray-500 text-lg font-medium">Your queue is entirely clear. Take a break.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}