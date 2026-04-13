import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UploadSyllabus from "./pages/UploadSyllabus";
import Tasks from "./pages/Tasks";
import Chat from "./pages/Chat";
import Auth from "./pages/Auth";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="text-white/50 text-sm m-auto">Re-synthesizing environment...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/upload" element={<ProtectedRoute><UploadSyllabus /></ProtectedRoute>} />
        <Route path="/tasks" element={<ProtectedRoute><Tasks /></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <div className="bg-[#000000] text-zinc-300 min-h-screen flex flex-col font-sans relative selection:bg-indigo-500/30">
      {/* Immersive Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none"></div>
      
      <BrowserRouter>
        <Navbar />
        <div className="flex flex-1 relative z-10 pt-[64px] w-full h-[calc(100vh)] overflow-hidden">
          <Sidebar />
          <div className="w-full md:pl-64 flex flex-col relative z-10 p-4 md:p-8 overflow-y-auto h-full">
            <AnimatedRoutes />
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;