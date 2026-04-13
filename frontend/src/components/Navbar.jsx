import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 w-full h-[64px] bg-black/50 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-10 border-b border-white/[0.04]">
      <div className="w-full flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tighter text-white hover:text-zinc-300 transition-colors flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-white flex items-center justify-center shadow-[0_0_12px_rgba(255,255,255,0.4)]"></div>
          <span className="font-semibold tracking-tight">StudySpace</span>
        </Link>
  
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link to="/" className={`transition-colors duration-200 ${location.pathname === '/' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>Overview</Link>
          <Link to="/chat" className={`transition-colors duration-200 ${location.pathname === '/chat' ? 'text-white' : 'text-zinc-500 hover:text-white'}`}>Ask AI</Link>
          
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-xs text-zinc-500 uppercase tracking-wider hidden sm:block">Online</span>
              </div>
              <button 
                onClick={logout} 
                className="px-3 py-1.5 rounded-lg border border-white/10 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-5 py-2 rounded-lg bg-white text-black font-semibold hover:bg-zinc-200 transition-colors text-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}