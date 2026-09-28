export default function Input({ label, error, hint, icon: Icon, className = "", id, ...props }) {
  const inputId = id || props.name;
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-parchment-dim mb-1.5">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-parchment-dim" />}
        <input
          id={inputId}
          className={`w-full bg-ink border rounded-lg px-3.5 py-2.5 text-sm text-parchment placeholder:text-parchment-dim/60 focus:outline-none focus:ring-2 focus:ring-brass/50 focus:border-brass transition-colors duration-150 ${Icon ? "pl-9" : ""} ${error ? "border-signal/60" : "border-ink-line"} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-signal-soft">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-parchment-dim">{hint}</p>}
    </div>
  );
}