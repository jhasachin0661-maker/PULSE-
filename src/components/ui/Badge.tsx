import React from 'react';

export interface BadgeProps {
  variant?: 'available' | 'unavailable' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  dot = false,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2',
  };

  const variantStyles = {
    available:
      'bg-mint/15 text-mint border border-mint/30 font-medium',
    unavailable:
      'bg-amber/15 text-amber border border-amber/30 font-medium',
    neutral:
      'bg-graphite/60 text-slate-muted border border-hairline',
    accent:
      'bg-lime/10 text-lime border border-lime/30 font-medium',
  };

  const dotStyles = {
    available: 'bg-mint shadow-[0_0_8px_rgba(99,214,177,0.6)]',
    unavailable: 'bg-amber shadow-[0_0_8px_rgba(242,180,91,0.6)]',
    neutral: 'bg-slate-muted',
    accent: 'bg-lime shadow-[0_0_8px_rgba(198,243,107,0.6)]',
  };

  return (
    <span
      className={`inline-flex items-center rounded-md tabular-nums tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotStyles[variant]}`}
          aria-hidden="true"
        />
      )}
      <span>{children}</span>
    </span>
  );
};
