import { motion } from "motion/react";
import { Check } from "lucide-react";

export default function CourseLine({ stages = [] }) {
  return (
    <div className="w-full overflow-x-auto pb-2">
      <div className="flex items-start min-w-140">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 260, damping: 20 }}
                className={`relative w-11 h-11 rounded-full flex items-center justify-center border-2 ${
                  stage.completed ? "bg-brass border-brass" : stage.current ? "bg-ink-raised border-brass" : "bg-ink-raised border-ink-line"
                }`}
              >
                {stage.completed ? (
                  <Check size={18} className="text-ink" strokeWidth={3} />
                ) : (
                  <stage.icon size={18} className={stage.current ? "text-brass" : "text-parchment-dim"} />
                )}
                {stage.current && !stage.completed && (
                  <motion.span
                    className="absolute inset-0 rounded-full border-2 border-brass"
                    animate={{ scale: [1, 1.4], opacity: [0.6, 0] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "easeOut" }}
                  />
                )}
              </motion.div>
              <span className={`text-xs font-medium text-center max-w-20 ${stage.completed || stage.current ? "text-parchment" : "text-parchment-dim"}`}>
                {stage.label}
              </span>
            </div>
            {i < stages.length - 1 && (
              stage.completed ? (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.12 + 0.1, duration: 0.4 }}
                  style={{ originX: 0 }}
                  className="h-0.5 flex-1 mx-1 bg-brass"
                />
              ) : (
                <div className="h-0 flex-1 mx-1 border-t-2 border-dashed border-ink-line" />
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}