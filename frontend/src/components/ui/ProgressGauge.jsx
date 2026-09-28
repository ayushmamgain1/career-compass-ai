import { motion } from "motion/react";
import { scoreTier } from "../../utils/format";

export default function ProgressGauge({ value = 0, max = 100, size = 140, strokeWidth = 10, label }) {
  const normalizedValue = Math.max(0, Math.min(value, max));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = normalizedValue / max;
  const { color, label: tierLabel } = scoreTier(normalizedValue, max);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--color-ink-line)" strokeWidth={strokeWidth} />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference * (1 - progress) }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-3xl font-semibold text-parchment">{Math.round(normalizedValue)}</span>
          <span className="font-mono text-xs text-parchment-dim">/ {max}</span>
        </div>
      </div>
      {label && <p className="mt-3 text-sm text-parchment-dim">{label}</p>}
      <p className="text-xs font-medium" style={{ color }}>{tierLabel}</p>
    </div>
  );
}