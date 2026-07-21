import React from 'react';

export type BadgeVariant = 'success' | 'warning' | 'error' | 'neutral';

interface StatusBadgeProps {
  label: string;
  value: string | number;
  variant?: BadgeVariant;
  pulse?: boolean;
}

const variantStyles: Record<BadgeVariant, { dot: string; border: string; text: string }> = {
  success: {
    dot: 'bg-emerald-500',
    border: 'border-emerald-500/30 bg-emerald-500/10',
    text: 'text-emerald-400',
  },
  warning: {
    dot: 'bg-amber-500',
    border: 'border-amber-500/30 bg-amber-500/10',
    text: 'text-amber-400',
  },
  error: {
    dot: 'bg-rose-500',
    border: 'border-rose-500/30 bg-rose-500/10',
    text: 'text-rose-400',
  },
  neutral: {
    dot: 'bg-slate-400',
    border: 'border-slate-700 bg-slate-800/50',
    text: 'text-slate-300',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  label,
  value,
  variant = 'neutral',
  pulse = false,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all ${styles.border}`}
    >
      <span className="relative flex h-2 w-2">
        {pulse && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${styles.dot}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${styles.dot}`} />
      </span>
      <span className="text-slate-400 font-sans">{label}:</span>
      <span className={`font-semibold ${styles.text}`}>{value}</span>
    </div>
  );
};