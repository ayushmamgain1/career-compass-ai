import { motion } from "motion/react";
import { CircleAlert } from "lucide-react";

export default function FormError({ message }) {
  if (!message) return null;

  return (
    <motion.div
      role="alert"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 text-sm text-signal-soft bg-signal/10 border border-signal/30 rounded-lg px-3.5 py-2.5 mb-5"
    >
      <CircleAlert size={16} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </motion.div>
  );
}