import { motion } from "motion/react";

export default function Card({ children, className = "", hoverable = false, padding = "p-6", ...motionProps }) {
  return (
    <motion.div
      className={`panel rounded-2xl ${padding} ${
        hoverable ? "transition-all duration-200 hover:border-brass/40 hover:-translate-y-0.5 cursor-pointer" : ""
      } ${className}`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}