import React, { InputHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 7);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-muted">
            {label}
            {props.required && <span className="text-amber ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full bg-ink border rounded-lg px-3.5 py-2.5 text-sm text-coolwhite placeholder:text-slate-subtle transition-colors duration-default focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime ${
            error ? 'border-amber ring-amber/30' : 'border-hairline hover:border-slate-subtle'
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="text-xs text-amber font-medium flex items-center gap-1 mt-0.5">
            <span aria-hidden="true">•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', id, ...props }, ref) => {
    const selectId = id || props.name || Math.random().toString(36).substring(2, 7);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={selectId} className="text-xs font-semibold uppercase tracking-wider text-slate-muted">
            {label}
            {props.required && <span className="text-amber ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`w-full bg-ink border rounded-lg px-3.5 py-2.5 text-sm text-coolwhite transition-colors duration-default focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime cursor-pointer ${
            error ? 'border-amber ring-amber/30' : 'border-hairline hover:border-slate-subtle'
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-navy text-coolwhite py-1">
              {opt.label}
            </option>
          ))}
        </select>
        {error ? (
          <p className="text-xs text-amber font-medium flex items-center gap-1 mt-0.5">
            <span aria-hidden="true">•</span> {error}
          </p>
        ) : helperText ? (
          <p className="text-xs text-slate-muted mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
