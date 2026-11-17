import React from 'react';
import { Check, X } from 'lucide-react';

export interface AvailabilitySwitchProps {
  id: string;
  memberName: string;
  isAvailable: boolean;
  onToggle: (id: string) => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
}

export const AvailabilitySwitch: React.FC<AvailabilitySwitchProps> = ({
  id,
  memberName,
  isAvailable,
  onToggle,
  disabled = false,
  size = 'md',
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onToggle(id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onToggle(id);
    }
  };

  const isSmall = size === 'sm';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isAvailable}
      aria-label={`Toggle availability for ${memberName}. Currently ${isAvailable ? 'Available' : 'Unavailable'}`}
      disabled={disabled}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group relative inline-flex items-center flex-shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-default border focus:outline-none focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
        isSmall ? 'w-12 h-6' : 'w-14 h-7'
      } ${
        isAvailable
          ? 'bg-mint/20 border-mint/50 hover:bg-mint/30'
          : 'bg-amber/15 border-amber/40 hover:bg-amber/25'
      } ${disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
    >
      <span className="sr-only">
        {isAvailable ? 'Mark unavailable' : 'Mark available'}
      </span>

      {/* Track background subtle indicators */}
      <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none text-[9px] font-bold font-mono">
        <span
          className={`transition-opacity duration-default ${
            isAvailable ? 'opacity-90 text-mint' : 'opacity-0'
          }`}
        >
          ON
        </span>
        <span
          className={`transition-opacity duration-default ${
            !isAvailable ? 'opacity-80 text-amber' : 'opacity-0'
          }`}
        >
          OFF
        </span>
      </span>

      {/* Thumb / Knob */}
      <span
        className={`pointer-events-none inline-flex items-center justify-center transform rounded-full shadow-md transition-transform duration-default ${
          isSmall ? 'w-5 h-5' : 'w-6 h-6'
        } ${
          isAvailable
            ? (isSmall ? 'translate-x-6' : 'translate-x-7') + ' bg-mint text-ink'
            : 'translate-x-0 bg-amber text-ink'
        }`}
      >
        {isAvailable ? (
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        ) : (
          <X className="w-3.5 h-3.5 stroke-[3]" />
        )}
      </span>
    </button>
  );
};
