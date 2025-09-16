import { Link, useLocation } from "react-router-dom";
import { Home, Search, User, LogOut, PlusCircle, Heart } from "lucide-react";
import type { NavItem } from "../types/sidebar";

function NavItem({ to, icon: Icon, label }: NavItem) {
  const active = useLocation().pathname === to;

  return (
    <Link
      to={to}
      className={`flex text-md items-center gap-3 rounded-full px-4 py-2 mb-2 
        transition-colors
        ${
          active
            ? "bg-zinc-900/80 text-white"
            : "hover:bg-zinc-900/60 text-zinc-300"
        }`}
    >
      <Icon size={20} strokeWidth={2} fill={active ? "currentColor" : "none"} />
      <span className="font-medium">{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex ml-5 flex-col h-screen sticky top-0 p-4 border-r border-zinc-800 bg-zinc-950">
      <h1 className="text-4xl font-semibold text-green-600 mb-8">circle</h1>

      <nav className="flex-1">
        <NavItem to="/home" icon={Home} label="Home" />
        <NavItem to="/search" icon={Search} label="Search" />
        <NavItem to="/follows" icon={Heart} label="Follows" />
        <NavItem to="/profile" icon={User} label="Profile" />
      </nav>

      <Link
        to="/home"
        className="mb-6 mt-4 inline-flex items-center justify-center gap-2 rounded-full
                   bg-green-600 px-5 py-2 font-semibold text-zinc-900 hover:bg-green-500 transition-colors duration--300"
      >
        <PlusCircle size={18} />
        Create Post
      </Link>

      <button className="flex items-center gap-3 rounded-full px-4 py-2 text-zinc-300 hover:bg-zinc-900">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
}
