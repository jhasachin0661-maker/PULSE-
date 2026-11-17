import React, { useState } from 'react';
import { Sidebar, NavItemKey } from './Sidebar';
import { Topbar } from './Topbar';
import { useTeam } from '../../context/TeamContext';

export interface PageShellProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  onOpenAddMember: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  currentTab,
  onSelectTab,
  onOpenAddMember,
  title,
  subtitle,
  children,
}) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { metrics } = useTeam();

  return (
    <div className="min-h-screen bg-ink text-coolwhite flex">
      {/* Sidebar Navigation */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={onSelectTab}
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
        totalMembers={metrics.total}
        availableMembers={metrics.available}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <Topbar
          onOpenMobileNav={() => setIsMobileNavOpen(true)}
          onOpenAddMember={onOpenAddMember}
          title={title}
          subtitle={subtitle}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-200">
          {children}
        </main>

        {/* Footer with storage disclosure and system notes */}
        <footer className="border-t border-hairline/60 py-4 px-4 sm:px-8 text-center sm:flex sm:items-center sm:justify-between text-xs text-slate-muted">
          <div>
            PULSE Operations Console • 100% Frontend Architecture
          </div>
          <div className="mt-1 sm:mt-0 font-mono text-[11px]">
            Data stored locally via browser <span className="text-lime">localStorage</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
