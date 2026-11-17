import React from 'react';
import { Menu, Plus, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { getCurrentDateFormatted } from '../../utils/date';

export interface TopbarProps {
  onOpenMobileNav: () => void;
  onOpenAddMember: () => void;
  title: string;
  subtitle?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  onOpenMobileNav,
  onOpenAddMember,
  title,
  subtitle,
}) => {
  const currentDate = getCurrentDateFormatted();

  return (
    <header className="sticky top-0 z-20 bg-ink/90 backdrop-blur-md border-b border-hairline h-16 sm:h-20 flex items-center px-4 sm:px-8 justify-between">
      {/* Left side: Hamburger (mobile) + Titles */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-muted hover:text-coolwhite hover:bg-graphite/40 rounded-lg transition-colors"
          aria-label="Open mobile navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-xl font-extrabold font-heading text-coolwhite tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs text-slate-muted truncate hidden sm:block mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right side: Current Date indicator + Add Member CTA */}
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        {/* Date pill */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-navy/80 border border-hairline text-xs font-mono text-slate-muted">
          <Calendar className="w-3.5 h-3.5 text-lime" />
          <span>{currentDate}</span>
        </div>

        {/* Add Member CTA button */}
        <Button
          variant="primary"
          size="sm"
          onClick={onOpenAddMember}
          className="shadow-glow-lime min-h-[40px] px-3.5 sm:px-4"
        >
          <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
          <span>Add Member</span>
        </Button>
      </div>
    </header>
  );
};
