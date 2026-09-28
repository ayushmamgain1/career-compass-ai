import { Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../features/ui/uiSlice";

export default function Topbar() {
  const dispatch = useDispatch();
  const onlineCount = useSelector((state) => state.ui.onlineUserIds.length);

  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-16 border-b border-ink-line bg-ink-raised">
      <button onClick={() => dispatch(toggleSidebar())} className="text-parchment hover:text-brass transition-colors">
        <Menu size={22} />
      </button>
      <span className="font-display text-parchment">Career Compass</span>
      <span className={`w-1.5 h-1.5 rounded-full ${onlineCount > 0 ? "bg-verdigris" : "bg-parchment-dim"}`} title="Connection status" />
    </header>
  );
}