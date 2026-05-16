import { Link, useLocation } from "react-router-dom";
import { Copy, LayoutDashboard, CheckCircle2, MessageCircle } from "lucide-react";

export default function Sidebar() {
  const location = useLocation();
  
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={16} /> },
    { name: "Syllabus Upload", path: "/upload", icon: <Copy size={16} /> },
    { name: "Task Queue", path: "/tasks", icon: <CheckCircle2 size={16} /> },
    { name: "Assistant Space", path: "/chat", icon: <MessageCircle size={16} /> },
  ];

  return (
    <aside className="fixed left-0 top-[72px] z-40 hidden h-[calc(100vh-72px)] w-64 flex-col border-r border-[#5b3215]/10 bg-[#fffaf1]/55 p-4 backdrop-blur-xl md:flex">
      <div className="mb-4 mt-2 px-3 text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#8a5a2b]">Workspace</div>

      <div className="flex flex-col gap-1">
        {menu.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path} 
              className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition-all ${
                isActive 
                ? 'bg-[#17140f] text-[#fffaf1] shadow-[0_14px_28px_rgba(23,20,15,0.14)]' 
                : 'text-[#746b5f] hover:bg-[#efe1cc] hover:text-[#17140f]'
              }`}
            >
              <div className={`${isActive ? 'text-[#d7b98d]' : 'text-[#8a5a2b]'}`}>
                {item.icon}
              </div>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
