import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
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
  
  if (loading) return <div className="text-gray-400 text-sm m-auto">Re-synthesizing environment...</div>;
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    const scrollRoot = document.getElementById("app-scroll-root");
    if (scrollRoot) {
      scrollRoot.scrollTop = 0;
      scrollRoot.scrollLeft = 0;
    }
  }, [location.pathname]);

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
    <div className="h-dvh w-full overflow-hidden bg-[#fffaf1] text-[#17140f] font-sans selection:bg-[#d7b98d]/40">
      <BrowserRouter>
        <Navbar />
        <div className="flex h-full w-full pt-[72px]">
          <Sidebar />
          <main
            id="app-scroll-root"
            className="flex-1 overflow-y-auto px-4 pb-8 pt-5 sm:px-6 md:pl-[18rem] md:pr-8 md:pt-8"
          >
            <AnimatedRoutes />
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
