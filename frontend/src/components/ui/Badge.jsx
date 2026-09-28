const VARIANTS = {
  brass: "bg-brass/10 text-brass-soft border-brass/30",
  verdigris: "bg-verdigris/10 text-verdigris-soft border-verdigris/30",
  signal: "bg-signal/10 text-signal-soft border-signal/30",
  neutral: "bg-ink-line/50 text-parchment-dim border-ink-line",
};

export default function Badge({ children, variant = "neutral", icon: Icon, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${VARIANTS[variant]} ${className}`}>
      {Icon && <Icon size={12} />}
      {children}
    </span>
  );
}