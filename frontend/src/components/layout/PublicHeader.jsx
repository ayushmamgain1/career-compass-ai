import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function PublicHeader() {
  return (
    <header className="flex items-center justify-between px-6 sm:px-10 h-20 max-w-6xl mx-auto w-full">
      <Link to="/" className="flex items-center gap-2.5">
        <Compass size={24} className="text-brass" />
        <span className="font-display text-xl text-parchment tracking-tight">Career Compass</span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link to="/login" className="text-sm text-parchment-dim hover:text-parchment transition-colors">
          Sign in
        </Link>
        <Link to="/register" className="text-sm font-medium bg-brass text-ink px-4 py-2 rounded-lg hover:bg-brass-soft transition-colors">
          Get started
        </Link>
      </nav>
    </header>
  );
}