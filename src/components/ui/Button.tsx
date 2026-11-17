import React, { ButtonHTMLAttributes, forwardRef } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading = false, disabled, children, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-default active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 select-none cursor-pointer';

    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2 min-h-[42px] sm:min-h-[40px] gap-2',
      lg: 'text-base px-5 py-2.5 min-h-[46px] gap-2.5',
    };

    const variantStyles = {
      primary:
        'bg-lime text-ink hover:bg-lime-hover shadow-card font-semibold focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink',
      secondary:
        'bg-graphite text-coolwhite hover:bg-graphite-light border border-hairline shadow-sm hover:border-slate-subtle',
      danger:
        'bg-red-950/40 text-red-300 border border-red-800/50 hover:bg-red-900/40 hover:border-red-600/70',
      ghost:
        'text-slate-muted hover:text-coolwhite hover:bg-navy/80 active:bg-navy',
      outline:
        'border border-hairline text-coolwhite hover:border-lime/40 hover:text-lime bg-transparent',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
