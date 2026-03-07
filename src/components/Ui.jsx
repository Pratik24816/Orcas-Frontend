export const PrimaryButton = ({ children, ...props }) => (
  <button
    className="px-5 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:opacity-90 transition"
    {...props}
  >
    {children}
  </button>
);

export const GhostButton = ({ children, ...props }) => (
  <button
    className="px-5 py-3 rounded-xl border border-brand-blue text-brand-deep font-semibold hover:bg-brand-soft transition"
    {...props}
  >
    {children}
  </button>
);

export const Card = ({ children, className = '' }) => (
  <div className={`glass-card shadow-glass rounded-2xl p-6 ${className}`}>{children}</div>
);
