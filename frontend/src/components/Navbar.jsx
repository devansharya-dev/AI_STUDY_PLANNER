import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  
  return (
    <nav className="fixed top-0 left-0 z-50 flex h-[72px] w-full items-center justify-between border-b border-[#5b3215]/10 bg-[#fffaf1]/85 px-4 shadow-[0_10px_35px_rgba(67,45,22,0.06)] backdrop-blur-xl sm:px-6 md:px-10">
      <div className="w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 text-[#17140f] transition-colors hover:text-[#5b3215]">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#17140f] text-sm font-extrabold text-[#fffaf1] shadow-[0_12px_25px_rgba(23,20,15,0.18)]">S</div>
          <span className="font-heading text-2xl font-bold tracking-normal">StudySpace</span>
        </Link>
  
        <div className="flex items-center gap-2 text-sm font-bold">
          <NavLink to="/" className={({ isActive }) => `rounded-full px-3 py-2 transition-colors ${isActive ? 'bg-[#17140f] text-[#fffaf1]' : 'text-[#746b5f] hover:bg-[#efe1cc] hover:text-[#17140f]'}`}>Overview</NavLink>
          <NavLink to="/chat" className={({ isActive }) => `rounded-full px-3 py-2 transition-colors ${isActive ? 'bg-[#17140f] text-[#fffaf1]' : 'text-[#746b5f] hover:bg-[#efe1cc] hover:text-[#17140f]'}`}>Ask AI</NavLink>
          
          {user ? (
            <div className="ml-1 flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-full border border-[#60785f]/20 bg-[#60785f]/10 px-3 py-2 sm:flex">
                <div className="h-1.5 w-1.5 rounded-full bg-[#60785f]"></div>
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#60785f]">Online</span>
              </div>
              <button 
                onClick={logout} 
                className="inline-flex items-center gap-2 rounded-full border border-[#5b3215]/15 bg-[#fffdf8] px-3 py-2 text-sm font-bold text-[#5b3215] transition-colors hover:bg-[#efe1cc]"
              >
                <LogOut size={15} />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          ) : (
            <Link to="/auth" className="ml-1 rounded-full bg-[#17140f] px-5 py-2.5 text-sm font-extrabold text-[#fffaf1] shadow-[0_16px_30px_rgba(23,20,15,0.18)] transition-colors hover:bg-[#5b3215]">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
