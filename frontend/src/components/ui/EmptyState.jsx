export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6">
      {Icon && (
        <div className="w-14 h-14 rounded-full bg-ink-raised border border-ink-line flex items-center justify-center mb-4">
          <Icon size={24} className="text-brass-dim" />
        </div>
      )}
      <h3 className="font-display text-lg text-parchment mb-1.5">{title}</h3>
      {description && <p className="text-sm text-parchment-dim max-w-sm mb-5">{description}</p>}
      {action}
    </div>
  );
}