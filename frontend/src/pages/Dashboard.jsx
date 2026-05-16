import { useEffect, useState } from "react";
import { fetchTasks } from "../services/taskService";
import { motion as Motion } from "framer-motion";
import { Activity, Target, Clock, CheckCircle2, ChevronRight, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTasks();
        setTasks(data || []);
      } catch {
        setTasks([]);
      }
    };

    load();
  }, []);

  const completed = tasks.filter(t => t.status === 'completed').length;
  const total = tasks.length || 1;
  const percent = Math.round((completed / total) * 100);

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-6xl selection:bg-[#d7b98d]/40"
    >
      <Motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col justify-between gap-6 border-b border-[#5b3215]/10 pb-8 md:flex-row md:items-end"
      >
        <div>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#60785f]/20 bg-[#60785f]/10 px-3 py-1.5">
            <div className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#60785f] opacity-50"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#60785f]"></span>
            </div>
            <span className="eyebrow text-[#60785f]">System Active</span>
          </div>
          <h1 className="font-heading text-5xl font-bold tracking-normal text-[#17140f] md:text-6xl">
            Mission Control
          </h1>
          <p className="mt-3 text-lg font-semibold text-[#746b5f]">
            A calm command center for your intellectual progress.
          </p>
        </div>
      </Motion.div>

      <div className="pb-12">
        <Motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-2"
        >
          <div className="premium-card group relative overflow-hidden rounded-2xl p-7 transition-all duration-500 hover:-translate-y-0.5 md:p-9">
            <div className="absolute right-0 top-0 p-8 opacity-[0.06] transition-opacity duration-500 group-hover:opacity-10">
              <Activity size={180} strokeWidth={1} className="translate-x-10 -translate-y-10 rotate-12 text-[#8a5a2b]" />
            </div>
            <div className="relative z-10">
              <div className="mb-8 flex items-center gap-3 text-[#8a5a2b]">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe1cc]">
                  <CheckCircle2 size={24} strokeWidth={2.5} />
                </div>
                <h3 className="eyebrow">Completion Rate</h3>
              </div>
              
              <div className="flex items-baseline gap-2">
                <span className="text-7xl font-extrabold tracking-tight text-[#17140f] md:text-8xl">{percent}</span>
                <span className="text-4xl font-extrabold text-[#c9b99f]">%</span>
              </div>
              
              <div className="mt-10 h-3 w-full overflow-hidden rounded-full border border-[#5b3215]/10 bg-[#efe1cc]">
                <Motion.div
                  className="relative h-full bg-[#8a5a2b]"
                  initial={{ width: 0 }}
                  animate={{ width: `${percent}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                >
                  <div className="absolute bottom-0 right-0 top-0 w-20 bg-gradient-to-r from-transparent to-white/30"></div>
                </Motion.div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-2xl border border-[#17140f] bg-[#17140f] p-7 shadow-[0_24px_60px_rgba(23,20,15,0.2)] transition-all duration-500 hover:-translate-y-0.5 md:p-9">
            <div className="absolute right-0 top-0 p-8 opacity-10 transition-opacity duration-500 group-hover:opacity-15">
              <Target size={180} strokeWidth={1} className="translate-x-10 -translate-y-10 -rotate-12 text-[#fffaf1]" />
            </div>
            <div className="relative z-10 flex h-full flex-col justify-between">
              <div>
                <div className="mb-8 flex items-center gap-3 text-[#d7b98d]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#fffaf1]/10 bg-[#fffaf1]/8">
                    <Zap size={24} strokeWidth={2.5} />
                  </div>
                  <h3 className="eyebrow text-[#d7b98d]">Active Queue</h3>
                </div>
                
                <div className="flex items-baseline gap-4">
                  <span className="text-7xl font-extrabold tracking-tight text-[#fffaf1] md:text-8xl">{tasks.length - completed}</span>
                  <span className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#b6a58c]">Remaining</span>
                </div>
                <p className="mt-4 text-lg font-semibold text-[#c9b99f]">Out of {tasks.length} total objectives generated by AI.</p>
              </div>
              
              <Link to="/tasks" className="mt-8 inline-flex self-start items-center gap-2 rounded-full bg-[#fffaf1] px-6 py-3 text-sm font-extrabold text-[#17140f] transition-colors hover:bg-[#efe1cc]">
                View Queue
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="premium-card rounded-2xl p-6 md:p-8"
        >
          <div className="mb-6 flex items-center justify-between">
            <h3 className="flex items-center gap-3 text-xl font-extrabold text-[#17140f]">
              <Clock size={24} className="text-[#8a5a2b]" />
              Up Next
            </h3>
            <Link to="/tasks" className="text-sm font-extrabold text-[#8a5a2b] hover:text-[#5b3215]">See All</Link>
          </div>
          
          <div className="space-y-4">
            {tasks.slice(0, 5).map((t, i) => {
              const isCompleted = t.status === 'completed';
              return (
                <div 
                  key={t.id || i} 
                  className={`group flex items-center justify-between rounded-2xl border p-5 transition-all duration-300 ${
                    isCompleted ? 'border-[#5b3215]/8 bg-[#efe1cc]/45' : 'border-[#5b3215]/10 bg-[#fffdf8] hover:border-[#8a5a2b]/30 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`h-3 w-3 rounded-full transition-colors ${
                      isCompleted ? 'bg-[#c9b99f]' : 'bg-[#8a5a2b]'
                    }`} />
                    <div className={`text-lg font-extrabold transition-colors md:text-xl ${
                      isCompleted ? 'text-[#9b907f] line-through' : 'text-[#31281f] group-hover:text-[#17140f]'
                    }`}>
                        {t.topic || "Unidentified Focus"}
                    </div>
                  </div>
                  
                  <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.16em] ${
                    isCompleted ? 'bg-[#efe1cc] text-[#746b5f]' : 'border border-[#8a5a2b]/15 bg-[#8a5a2b]/10 text-[#8a5a2b]'
                  }`}>
                    {t.status || 'pending'}
                  </span>
                </div>
              );
            })}
            
            {tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#5b3215]/20 bg-[#efe1cc]/40 py-20 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#fffdf8] shadow-sm">
                  <CheckCircle2 strokeWidth={2.5} size={32} className="text-[#8a5a2b]" />
                </div>
                <p className="mb-2 text-2xl font-extrabold text-[#17140f]">All caught up.</p>
                <p className="text-lg font-semibold text-[#746b5f]">Your queue is entirely clear. Take a break.</p>
              </div>
            )}
          </div>
        </Motion.div>
      </div>
    </Motion.div>
  );
}
