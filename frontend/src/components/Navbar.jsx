import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 w-full h-[64px] bg-white/80 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-10 border-b border-gray-200">
      <div className="w-full flex items-center justify-between">
        <Link to="/" className="text-lg font-bold tracking-tighter text-gray-900 hover:text-gray-600 transition-colors flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-black flex items-center justify-center shadow-[0_0_12px_rgba(0,0,0,0.1)]"></div>
          <span className="font-semibold tracking-tight">StudySpace</span>
        </Link>
  
        <div className="flex gap-6 items-center text-sm font-medium">
          <Link to="/" className={`transition-colors duration-200 ${location.pathname === '/' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Overview</Link>
          <Link to="/chat" className={`transition-colors duration-200 ${location.pathname === '/chat' ? 'text-black' : 'text-gray-500 hover:text-black'}`}>Ask AI</Link>
          
          {user ? (
            <div className="flex items-center gap-4 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                <span className="text-xs text-gray-500 uppercase tracking-wider hidden sm:block">Online</span>
              </div>
              <button 
                onClick={logout} 
                className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 hover:text-black hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link to="/auth" className="px-5 py-2 rounded-lg bg-black text-white font-semibold hover:bg-gray-800 transition-colors text-sm shadow-[0_0_15px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}