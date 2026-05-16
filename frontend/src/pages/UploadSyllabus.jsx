import { useState, useRef } from "react";
import { uploadSyllabus } from "../services/syllabusService";
import { generateStudyPlan } from "../services/planService";
import { motion, AnimatePresence } from "framer-motion";
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
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      className="w-full flex-1 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans selection:bg-indigo-100"
    >
      
      {/* Massive Background Typography Watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[15vw] font-black text-gray-900/[0.02] tracking-tighter whitespace-nowrap select-none">
          UPLOAD / PARSE
        </h1>
      </div>

      <div className="max-w-4xl w-full flex flex-col items-center relative z-10">
        
        {/* Dynamic Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-4 bg-white border border-gray-200 rounded-full p-1.5 pr-6 mb-8 shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest group-hover:bg-indigo-600 transition-colors">
              Step 1
            </div>
            <span className="text-gray-600 text-sm font-medium tracking-wide">
              Initialize Knowledge Engine
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-gray-900 mb-6 uppercase">
            Feed the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">System.</span>
          </h1>
        </motion.div>

        {/* Action Toggle */}
        <div className="flex gap-2 bg-white border border-gray-200 p-1.5 rounded-full mb-8 shadow-sm z-20">
          <button 
            onClick={() => setMode("pdf")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${mode === "pdf" ? "bg-gray-900 text-white shadow-md scale-100" : "text-gray-500 hover:text-gray-900 scale-95 hover:scale-100"}`}
          >
            <FileText size={18} /> PDF File
          </button>
          <button 
            onClick={() => setMode("text")}
            className={`flex items-center gap-2 px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-all duration-300 ${mode === "text" ? "bg-gray-900 text-white shadow-md scale-100" : "text-gray-500 hover:text-gray-900 scale-95 hover:scale-100"}`}
          >
            <AlignLeft size={18} /> Raw Text
          </button>
        </div>

        {/* The Core Upload/Interact Box */}
        <div className="w-full relative z-20 perspective-1000">
          <motion.div 
            className="w-full bg-white border border-gray-200 rounded-[2.5rem] p-4 md:p-8 relative overflow-hidden"
            animate={{ 
              rotateX: isHovered ? 2 : 0, 
              rotateY: isHovered ? -1 : 0,
              boxShadow: isHovered ? "0 40px 100px -20px rgba(0,0,0,0.1)" : "0 20px 50px -20px rgba(0,0,0,0.05)" 
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            
            <AnimatePresence mode="wait">
              {mode === "pdf" && (
                <motion.div 
                  key="pdf"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full group"
                >
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-[250px] md:h-[350px] bg-gray-50 hover:bg-gray-100 border border-dashed border-gray-300 hover:border-indigo-400 rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden"
                  >
                    {!file ? (
                      <div className="flex flex-col items-center gap-6 z-10 transition-transform duration-500 group-hover:scale-110">
                        <div className="w-24 h-24 bg-white border border-gray-200 shadow-sm rounded-full flex items-center justify-center text-gray-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors duration-500">
                          <UploadCloud size={40} className="group-hover:animate-bounce" />
                        </div>
                        <p className="text-xl font-bold tracking-tight text-gray-700">Drag & Drop Syllabus PDF</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-4 z-10">
                        <div className="w-20 h-20 bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-2xl flex items-center justify-center shadow-sm">
                          <FileText size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{file.name}</h3>
                        <p className="text-gray-500 font-medium">Ready for AI processing</p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setFile(null); }}
                          className="mt-4 px-6 py-2 bg-gray-200 hover:bg-red-100 hover:text-red-600 text-gray-700 rounded-full text-sm font-bold transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}
                    <input type="file" accept="application/pdf" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                  </div>
                </motion.div>
              )}

              {mode === "text" && (
                <motion.div 
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
                    className="w-full h-[250px] md:h-[350px] bg-gray-50 focus:bg-white border border-gray-200 focus:border-indigo-400 text-gray-900 placeholder-gray-400 text-lg md:text-xl font-medium focus:outline-none resize-none leading-relaxed p-8 rounded-[2rem] transition-all shadow-inner focus:shadow-md"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Controls */}
            <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-200 px-6 py-3 rounded-2xl w-full md:w-auto overflow-hidden">
                <span className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] w-24">Timeline</span>
                <input
                  type="number"
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-20 bg-transparent text-gray-900 text-3xl font-extrabold focus:outline-none text-center"
                  min="1"
                  max="365"
                />
                <span className="text-sm font-bold text-gray-500 w-12 tracking-wide">DAYS</span>
              </div>

              <motion.button
                whileHover={!isBtnDisabled ? { scale: 1.05 } : {}}
                whileTap={!isBtnDisabled ? { scale: 0.95 } : {}}
                onClick={handleSubmit}
                disabled={isBtnDisabled}
                className="w-full md:w-auto flex items-center justify-center gap-3 bg-gray-900 text-white shadow-lg px-10 py-5 rounded-2xl font-extrabold text-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed uppercase tracking-widest overflow-hidden relative group"
              >
                {/* Button Shine Effect */}
                {!isBtnDisabled && <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0"></div>}
                
                <span className="relative z-10">{loading ? "PROCESSING..." : "LAUNCH"}</span>
                {!loading && <ArrowRight size={24} className="relative z-10 group-hover:translate-x-2 transition-transform" />}
              </motion.button>
            </div>

          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}