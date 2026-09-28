import { motion } from "motion/react";
import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-brass text-ink hover:bg-brass-soft border border-brass",
  secondary: "bg-transparent text-parchment border border-ink-line hover:border-brass/60 hover:text-brass",
  ghost: "bg-transparent text-parchment-dim border border-transparent hover:text-parchment hover:bg-ink-raised",
  danger: "bg-signal/10 text-signal-soft border border-signal/40 hover:bg-signal/20",
};

const SIZES = {
  sm: "text-sm px-3 py-1.5 gap-1.5",
  md: "text-sm px-4 py-2.5 gap-2",
  lg: "text-base px-6 py-3 gap-2.5",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  fullWidth = false,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <motion.button
      type={type}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="animate-spin" size={16} />
      ) : (
        Icon && iconPosition === "left" && <Icon size={16} />
      )}
      {children}
      {!loading && Icon && iconPosition === "right" && <Icon size={16} />}
    </motion.button>
  );
}