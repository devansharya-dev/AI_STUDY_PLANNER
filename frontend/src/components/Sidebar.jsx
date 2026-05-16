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
    <aside className="fixed left-0 md:left-auto top-[64px] w-64 h-[calc(100vh-64px)] hidden md:flex flex-col border-r border-gray-200 p-4 bg-transparent z-40">
      <div className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mb-4 mt-2 px-3">Workspace</div>

      <div className="flex flex-col gap-1">
        {menu.map((item, idx) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={idx} 
              to={item.path} 
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                isActive 
                ? 'bg-gray-100 text-gray-900 shadow-sm' 
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <div className={`${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`}>
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