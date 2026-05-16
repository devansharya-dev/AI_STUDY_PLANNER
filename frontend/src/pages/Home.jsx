import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Upload, ListChecks, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="mx-auto flex min-h-[calc(100dvh-120px)] w-full max-w-6xl flex-col justify-center px-1 py-10 selection:bg-[#d7b98d]/40">
      <Motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-[#5b3215]/10 bg-[#fffdf8]/80 px-4 py-2 text-xs font-extrabold text-[#746b5f] shadow-sm"
      >
        <Sparkles size={14} className="text-[#8a5a2b]" />
        <span className="uppercase tracking-[0.18em] text-[10px]">Premium study planning</span>
      </Motion.div>

      <Motion.h1 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-4xl font-heading text-5xl font-bold leading-[0.95] tracking-normal text-[#17140f] sm:text-6xl md:text-7xl"
      >
        Less planning.
        <span className="block text-[#8a5a2b]">More focused learning.</span>
      </Motion.h1>
      
      <Motion.p 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-6 max-w-2xl text-lg font-semibold leading-8 text-[#746b5f] md:text-xl"
      >
        Upload your syllabus and let AI orchestrate a calm, step-by-step daily queue. Focus on the actual work.
      </Motion.p>

      <Motion.div
         initial={{ opacity: 0, y: 15 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4, duration: 0.5 }}
         className="mt-10 flex flex-wrap items-center gap-4"
      >
        <Link 
          to="/upload" 
          className="group flex items-center gap-2 rounded-full bg-[#17140f] px-8 py-4 font-extrabold tracking-wide text-[#fffaf1] shadow-[0_22px_45px_rgba(23,20,15,0.18)] transition-all hover:-translate-y-0.5 hover:bg-[#5b3215]"
        >
          Get Started
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </Motion.div>

      <div className="mt-14 grid gap-4 md:grid-cols-3">
        {[
          { icon: Upload, title: "Upload syllabus", copy: "PDF or raw text becomes a structured study map." },
          { icon: ListChecks, title: "Daily queue", copy: "Tasks stay visible, calm, and easy to complete." },
          { icon: MessageCircle, title: "Ask AI", copy: "Clarify a topic without leaving the workspace." },
        ].map((item) => (
          <div key={item.title} className="premium-card rounded-2xl p-5">
            <item.icon className="mb-5 text-[#8a5a2b]" size={22} />
            <h2 className="text-base font-extrabold text-[#17140f]">{item.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-6 text-[#746b5f]">{item.copy}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
