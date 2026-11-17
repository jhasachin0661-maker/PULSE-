import React from 'react';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  History,
  Settings,
  ShieldCheck,
  X,
} from 'lucide-react';

export type NavItemKey = 'overview' | 'members' | 'analytics' | 'activity' | 'settings';

export interface SidebarProps {
  currentTab: NavItemKey;
  onSelectTab: (tab: NavItemKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  totalMembers: number;
  availableMembers: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
  totalMembers,
  availableMembers,
}) => {
  const navItems = [
    {
      key: 'overview' as NavItemKey,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      key: 'members' as NavItemKey,
      label: 'Team Members',
      icon: Users,
      badge: `${availableMembers}/${totalMembers}`,
    },
    {
      key: 'analytics' as NavItemKey,
      label: 'Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      key: 'activity' as NavItemKey,
      label: 'Activity Log',
      icon: History,
      badge: null,
    },
    {
      key: 'settings' as NavItemKey,
      label: 'Settings',
      icon: Settings,
      badge: null,
    },
  ];

  const handleNavClick = (key: NavItemKey) => {
    onSelectTab(key);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-navy border-r border-hairline text-coolwhite select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-hairline/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-ink border border-lime/40 flex items-center justify-center text-lime shadow-glow-lime">
            <span className="font-extrabold font-heading text-sm tracking-wider">P</span>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold font-heading text-base tracking-wider text-coolwhite flex items-center gap-1.5">
              PULSE
              <span className="text-[10px] font-mono font-medium px-1.5 py-0.2 rounded bg-lime/10 text-lime border border-lime/30">
                v1.0
              </span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-muted">
              Ops Console
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onCloseMobile}
          className="lg:hidden text-slate-muted hover:text-coolwhite p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg"
          aria-label="Close navigation sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-3 flex flex-col gap-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-mono uppercase tracking-wider text-slate-subtle">
          Main Console
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => handleNavClick(item.key)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all group min-h-[44px] ${
                isActive
                  ? 'bg-ink text-lime border-l-2 border-l-lime shadow-sm font-semibold'
                  : 'text-slate-muted hover:text-coolwhite hover:bg-graphite/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-lime' : 'text-slate-muted group-hover:text-coolwhite'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded ${
                    isActive
                      ? 'bg-lime/15 text-lime border border-lime/30'
                      : 'bg-ink text-slate-muted border border-hairline/60'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Status / Local Storage disclosure badge */}
      <div className="p-4 border-t border-hairline/80 bg-ink/40">
        <div className="p-3 rounded-lg bg-navy/80 border border-hairline flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-coolwhite">
            <ShieldCheck className="w-4 h-4 text-mint flex-shrink-0" />
            <span>Local Persistence</span>
          </div>
          <p className="text-[11px] text-slate-muted leading-relaxed">
            Data is scoped to this browser profile. No cloud sync.
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop fixed sidebar */}
      <aside className="hidden lg:block w-64 h-screen fixed left-0 top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-ink/80 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Offcanvas Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-200 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};
