import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  variant?: 'lime' | 'mint' | 'amber' | 'slate';
  badge?: string;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  variant = 'slate',
  badge,
  className = '',
}) => {
  const accentStyles = {
    lime: 'border-l-2 border-l-lime text-lime',
    mint: 'border-l-2 border-l-mint text-mint',
    amber: 'border-l-2 border-l-amber text-amber',
    slate: 'border-l-2 border-l-slate-subtle text-slate-muted',
  };

  const iconBgStyles = {
    lime: 'bg-lime/10 text-lime border border-lime/25',
    mint: 'bg-mint/10 text-mint border border-mint/25',
    amber: 'bg-amber/10 text-amber border border-amber/25',
    slate: 'bg-graphite text-slate-muted border border-hairline',
  };

  return (
    <div
      className={`bg-graphite/40 border border-hairline rounded-xl p-5 flex flex-col justify-between shadow-card hover:border-slate-subtle/80 transition-all ${accentStyles[variant]} ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-muted">
          {label}
        </span>
        <div className={`p-2 rounded-lg flex-shrink-0 ${iconBgStyles[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between gap-2">
        <span className="text-3xl font-extrabold font-heading text-coolwhite tabular-nums tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="text-xs font-medium font-mono px-2 py-0.5 rounded bg-navy text-slate-muted border border-hairline">
            {badge}
          </span>
        )}
      </div>

      {subtext && (
        <p className="text-xs text-slate-muted mt-2 truncate flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-slate-subtle" />
          {subtext}
        </p>
      )}
    </div>
  );
};
