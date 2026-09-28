import { NavLink } from "react-router-dom";
import { Compass, FileText, Briefcase, Map, Mic, User, LogOut, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { closeSidebar } from "../../features/ui/uiSlice";
import { initials } from "../../utils/format";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Compass },
  { to: "/resume", label: "Resume", icon: FileText },
  { to: "/jobs", label: "Jobs", icon: Briefcase },
  { to: "/roadmap", label: "Roadmap", icon: Map },
  { to: "/interviews", label: "Interviews", icon: Mic },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar({ mobile = false }) {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleNavClick = () => {
    if (mobile) dispatch(closeSidebar());
  };

  return (
    <div className="flex flex-col h-full bg-ink-raised border-r border-ink-line w-64">
      <div className="flex items-center justify-between px-5 h-16 border-b border-ink-line">
        <div className="flex items-center gap-2.5">
          <Compass size={22} className="text-brass" />
          <span className="font-display text-lg text-parchment tracking-tight">Career Compass</span>
        </div>
        {mobile && (
          <button onClick={() => dispatch(closeSidebar())} className="text-parchment-dim hover:text-parchment">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-5 space-y-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors duration-150 border-l-2 ${
                isActive ? "bg-ink text-brass border-brass" : "text-parchment-dim border-transparent hover:text-parchment hover:bg-ink/50"
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-ink-line">
        <div className="flex items-center gap-3 px-2 py-2 mb-1">
          <div className="w-8 h-8 rounded-full bg-brass/15 border border-brass/30 flex items-center justify-center text-xs font-semibold text-brass-soft font-mono">
            {initials(user?.name || "?")}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-parchment truncate">{user?.name}</p>
            <p className="text-xs text-parchment-dim truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-parchment-dim hover:text-signal-soft hover:bg-signal/5 transition-colors duration-150 w-full"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </div>
  );
}