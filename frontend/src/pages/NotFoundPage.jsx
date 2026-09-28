import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
      <Compass size={48} className="text-brass-dim mb-6" />
      <h1 className="font-display text-3xl text-parchment mb-2">Off the chart</h1>
      <p className="text-parchment-dim mb-8 max-w-sm">This page isn't on any route we've plotted. Let's get you back on course.</p>
      <Link to="/" className="bg-brass text-ink font-medium px-6 py-3 rounded-lg hover:bg-brass-soft transition-colors">
        Back to safety
      </Link>
    </div>
  );
}