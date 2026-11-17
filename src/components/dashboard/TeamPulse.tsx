import React from 'react';
import { Activity, Radio, CheckCircle2, AlertCircle } from 'lucide-react';
import { DerivedMetrics } from '../../types/team';

export interface TeamPulseProps {
  metrics: DerivedMetrics;
}

export const TeamPulse: React.FC<TeamPulseProps> = ({ metrics }) => {
  const { total, available, unavailable, availabilityRate } = metrics;

  return (
    <div className="bg-gradient-to-br from-navy via-navy to-graphite/60 border border-hairline rounded-xl p-6 shadow-panel relative overflow-hidden">
      {/* Background operational grid texture hint */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, #C6F36B 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative z-10 flex flex-col gap-5">
        {/* Top header row */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-lime/10 text-lime border border-lime/30">
              <Activity className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <h2 className="text-base font-bold font-heading text-coolwhite flex items-center gap-2">
                Team Pulse Monitor
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-mono text-lime bg-lime/10 border border-lime/20 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-ping" />
                  LIVE
                </span>
              </h2>
              <p className="text-xs text-slate-muted">
                Real-time workforce deployment readiness indicator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-muted bg-ink/70 px-3 py-1.5 rounded-lg border border-hairline">
            <Radio className="w-3.5 h-3.5 text-lime" />
            <span>Scope: Browser Local Persistence</span>
          </div>
        </div>

        {/* Main metric row: Big rate + Progress bar + Status pill summary */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-4 flex items-baseline gap-3">
            <span className="text-5xl md:text-6xl font-black font-heading text-lime tracking-tight tabular-nums">
              {availabilityRate}%
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wider text-coolwhite">
                Readiness Rate
              </span>
              <span className="text-xs text-slate-muted">
                {total === 0 ? 'No members in roster' : `${available} of ${total} available`}
              </span>
            </div>
          </div>

          <div className="md:col-span-8 flex flex-col gap-2.5">
            {/* Visual segmented/linear capacity bar */}
            <div className="flex items-center justify-between text-xs font-mono text-slate-muted mb-1">
              <span className="flex items-center gap-1.5 text-mint">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Available: {available} ({availabilityRate}%)
              </span>
              <span className="flex items-center gap-1.5 text-amber">
                <AlertCircle className="w-3.5 h-3.5" />
                Unavailable: {unavailable} ({total > 0 ? 100 - availabilityRate : 0}%)
              </span>
            </div>

            {/* High-visibility multi-state progress bar */}
            <div className="w-full h-3.5 bg-ink rounded-full p-0.5 border border-hairline overflow-hidden flex">
              {total > 0 ? (
                <>
                  <div
                    className="h-full bg-mint rounded-l-full transition-all duration-300 shadow-[0_0_10px_rgba(99,214,177,0.4)]"
                    style={{ width: `${availabilityRate}%` }}
                    title={`Available: ${available}`}
                  />
                  <div
                    className="h-full bg-amber/80 rounded-r-full transition-all duration-300 shadow-[0_0_10px_rgba(242,180,91,0.3)]"
                    style={{ width: `${100 - availabilityRate}%` }}
                    title={`Unavailable: ${unavailable}`}
                  />
                </>
              ) : (
                <div className="w-full h-full bg-hairline/50 rounded-full" />
              )}
            </div>

            {/* Operational status message */}
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-slate-muted">
                {total === 0
                  ? 'Add your first team member to begin tracking availability.'
                  : availabilityRate >= 70
                  ? 'Optimal operational capacity: team is well-positioned for active sprint tasks.'
                  : availabilityRate >= 40
                  ? 'Moderate operational capacity: workload adjustments may be required.'
                  : 'Low operational capacity: immediate attention recommended.'}
              </span>
              <span className="text-coolwhite font-mono font-medium hidden sm:inline">
                {metrics.activeRolesCount} Active Roles
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
