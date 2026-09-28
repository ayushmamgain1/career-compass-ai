import { motion } from "motion/react";

// A rotating compass needle rather than a generic spinner - small detail,
// but it's the kind of thing that makes the app feel considered.
export default function Loader({ size = 32, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8">
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
      >
        <circle cx="16" cy="16" r="14" fill="none" stroke="var(--color-ink-line)" strokeWidth="2" />
        <path d="M16 4 L19 16 L16 28 L13 16 Z" fill="var(--color-brass)" opacity="0.9" />
      </motion.svg>
      {label && <p className="text-sm text-parchment-dim font-mono">{label}</p>}
    </div>
  );
}