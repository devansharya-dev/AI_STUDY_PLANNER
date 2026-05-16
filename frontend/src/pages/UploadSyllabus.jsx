import { useState, useRef } from "react";
import { uploadSyllabus } from "../services/syllabusService";
import { generateStudyPlan } from "../services/planService";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { FileText, AlignLeft, UploadCloud, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UploadSyllabus() {
  const [mode, setMode] = useState("pdf"); 
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if ((mode === "text" && !text) || (mode === "pdf" && !file) || loading) return;
    setLoading(true);
    try {
      const payload = mode === "text" ? text : file;
      const response = await uploadSyllabus(payload);

      await generateStudyPlan({
        syllabus_id: response.syllabus?.id || response.syllabus_id || response.id,
        start_date: new Date().toISOString(),
        duration_days: days,
      });
      navigate("/tasks");
    } catch (e) {
      alert("Error: " + (e.response?.data?.error || e.message));
    }
    setLoading(false);
  };

  const isBtnDisabled = (mode === "text" && !text) || (mode === "pdf" && !file) || loading;

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative mx-auto flex w-full max-w-5xl flex-col items-center px-1 py-10 selection:bg-[#d7b98d]/40"
    >
      
      <div className="pointer-events-none absolute left-1/2 top-24 z-0 w-full -translate-x-1/2 overflow-hidden text-center">
        <h1 className="select-none whitespace-nowrap text-[13vw] font-extrabold tracking-tight text-[#5b3215]/[0.035]">
          UPLOAD / PARSE
        </h1>
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        
        {/* Dynamic Header */}
        <Motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="mb-9 text-center"
        >
          <div className="group mb-7 inline-flex cursor-pointer items-center gap-4 rounded-full border border-[#5b3215]/10 bg-[#fffdf8]/85 p-1.5 pr-6 shadow-sm backdrop-blur-md">
            <div className="rounded-full bg-[#17140f] px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#fffaf1] transition-colors group-hover:bg-[#5b3215]">
              Step 1
            </div>
            <span className="text-sm font-bold tracking-wide text-[#746b5f]">
              Initialize Knowledge Engine
            </span>
          </div>

          <h1 className="font-heading text-5xl font-bold tracking-normal text-[#17140f] md:text-7xl">
            Feed the <span className="text-[#8a5a2b]">System.</span>
          </h1>
        </Motion.div>

        <div className="z-20 mb-8 flex gap-2 rounded-full border border-[#5b3215]/10 bg-[#fffdf8]/85 p-1.5 shadow-sm backdrop-blur-md">
          <button 
            onClick={() => setMode("pdf")}
            className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-extrabold tracking-wide transition-all duration-300 ${mode === "pdf" ? "scale-100 bg-[#17140f] text-[#fffaf1] shadow-[0_12px_24px_rgba(23,20,15,0.14)]" : "scale-95 text-[#746b5f] hover:scale-100 hover:text-[#17140f]"}`}
          >
            <FileText size={18} /> PDF File
          </button>
          <button 
            onClick={() => setMode("text")}
            className={`flex items-center gap-2 rounded-full px-7 py-3 text-sm font-extrabold tracking-wide transition-all duration-300 ${mode === "text" ? "scale-100 bg-[#17140f] text-[#fffaf1] shadow-[0_12px_24px_rgba(23,20,15,0.14)]" : "scale-95 text-[#746b5f] hover:scale-100 hover:text-[#17140f]"}`}
          >
            <AlignLeft size={18} /> Raw Text
          </button>
        </div>

        <div className="relative z-20 w-full perspective-1000">
          <Motion.div 
            className="premium-panel relative w-full overflow-hidden rounded-2xl p-4 md:p-8"
            animate={{ 
              rotateX: isHovered ? 2 : 0, 
              rotateY: isHovered ? -1 : 0,
              boxShadow: isHovered ? "0 40px 100px -25px rgba(67,45,22,0.24)" : "0 22px 70px rgba(67,45,22,0.08)" 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            <AnimatePresence mode="wait">
              {mode === "pdf" && (
                <Motion.div 
                  key="pdf"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="group w-full"
                >
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex h-[250px] w-full cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border border-dashed border-[#8a5a2b]/25 bg-[#efe1cc]/35 transition-all duration-300 hover:border-[#8a5a2b]/60 hover:bg-[#efe1cc]/55 md:h-[350px]"
                  >
                    {!file ? (
                      <div className="z-10 flex flex-col items-center gap-6 transition-transform duration-500 group-hover:scale-105">
                        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-[#8a5a2b]/15 bg-[#fffdf8] text-[#8a5a2b] shadow-sm transition-colors duration-500 group-hover:bg-[#8a5a2b] group-hover:text-[#fffaf1]">
                          <UploadCloud size={40} className="group-hover:animate-bounce" />
                        </div>
                        <p className="text-xl font-extrabold tracking-tight text-[#31281f]">Drag and drop syllabus PDF</p>
                      </div>
                    ) : (
                      <div className="z-10 flex flex-col items-center gap-4">
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-[#60785f]/20 bg-[#60785f]/10 text-[#60785f] shadow-sm">
                          <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-extrabold tracking-tight text-[#17140f]">{file.name}</h3>
                        <p className="font-semibold text-[#746b5f]">Ready for AI processing</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="mt-4 rounded-full bg-[#efe1cc] px-6 py-2 text-sm font-extrabold text-[#746b5f] transition-colors hover:bg-red-50 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  </div>
                </Motion.div>
              )}

              {mode === "text" && (
                <Motion.div 
                  key="text"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full"
                >
                  <textarea
                    placeholder="Enter raw text directives or syllabus content here..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="h-[250px] w-full resize-none rounded-2xl border border-[#5b3215]/10 bg-[#fffdf8] p-8 text-lg font-semibold leading-relaxed text-[#17140f] shadow-inner transition-all placeholder:text-[#9b907f] focus:border-[#8a5a2b]/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#8a5a2b]/10 md:h-[350px] md:text-xl"
                  />
                </Motion.div>
              )}
            </AnimatePresence>

            <div className="mt-8 flex flex-col items-center justify-between gap-6 border-t border-[#5b3215]/10 pt-8 md:flex-row">
              <div className="flex w-full items-center gap-4 overflow-hidden rounded-2xl border border-[#5b3215]/10 bg-[#efe1cc]/45 px-6 py-3 shadow-inner md:w-auto">
                <span className="w-24 text-xs font-extrabold uppercase tracking-[0.2em] text-[#746b5f]">Timeline</span>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-20 bg-transparent text-center text-3xl font-extrabold text-[#17140f] focus:outline-none"
                  min="1"
                  max="365"
                />
                <span className="w-12 text-sm font-extrabold tracking-wide text-[#746b5f]">DAYS</span>
              </div>

              <Motion.button
                whileHover={!isBtnDisabled ? { scale: 1.05 } : {}}
                whileTap={!isBtnDisabled ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={isBtnDisabled}
                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-[#17140f] px-10 py-5 text-lg font-extrabold uppercase tracking-[0.18em] text-[#fffaf1] shadow-[0_22px_45px_rgba(23,20,15,0.18)] transition-all hover:bg-[#5b3215] disabled:cursor-not-allowed disabled:opacity-35 md:w-auto"
              >
                {!isBtnDisabled && <div className="absolute inset-0 z-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>}
                
                <span className="relative z-10">{loading ? "PROCESSING..." : "LAUNCH"}</span>
                {!loading && <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
              </Motion.button>
            </div>

          </Motion.div>
        </div>

      </div>
    </Motion.div>
  );
}
