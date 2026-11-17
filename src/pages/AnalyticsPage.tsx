import React from 'react';
import { useTeam } from '../context/TeamContext';
import { BarChart3, PieChart, Users, CheckCircle2, XCircle, ShieldAlert, Briefcase } from 'lucide-react';
import { Badge } from '../components/ui/Badge';

export const AnalyticsPage: React.FC = () => {
  const { metrics, state } = useTeam();
  const { total, available, unavailable, availabilityRate, departmentStats } = metrics;

  // Derive role distribution from current roster
  const roleMap: Record<string, { total: number; available: number }> = {};
  state.members.forEach((m) => {
    const role = m.role.trim() || 'Unassigned';
    if (!roleMap[role]) {
      roleMap[role] = { total: 0, available: 0 };
    }
    roleMap[role].total += 1;
    if (m.isAvailable) {
      roleMap[role].available += 1;
    }
  });

  const roleStats = Object.entries(roleMap)
    .map(([role, data]) => ({
      role,
      total: data.total,
      available: data.available,
      unavailable: data.total - data.available,
      rate: Math.round((data.available / data.total) * 100),
    }))
    .sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info Note */}
      <div className="p-4 rounded-xl bg-navy/60 border border-hairline flex items-start gap-3">
        <BarChart3 className="w-5 h-5 text-lime flex-shrink-0 mt-0.5" />
        <div className="text-xs text-slate-muted leading-relaxed">
          <strong className="text-coolwhite">Live Computed Analytics:</strong> All metrics, ratios, and distributions are derived purely from your current active roster state. In compliance with privacy standards, no telemetry or external analytics services are used.
        </div>
      </div>

      {/* Top 3 High-Level Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-graphite/40 border border-hairline rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-muted">Availability Ratio</span>
            <Badge variant={availabilityRate >= 70 ? 'available' : 'unavailable'} dot size="sm">
              {availabilityRate >= 70 ? 'Target Met' : 'Sub-Target'}
            </Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold font-heading text-coolwhite tabular-nums">
              {availabilityRate}%
            </span>
            <span className="text-xs text-slate-muted">ready to deploy</span>
          </div>
          <div className="w-full h-2.5 bg-ink rounded-full overflow-hidden flex border border-hairline">
            <div className="h-full bg-mint" style={{ width: `${availabilityRate}%` }} />
            <div className="h-full bg-amber/80" style={{ width: `${100 - availabilityRate}%` }} />
          </div>
        </div>

        <div className="bg-graphite/40 border border-hairline rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-muted">Headcount Status</span>
            <Users className="w-4 h-4 text-slate-muted" />
          </div>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="p-2.5 rounded-lg bg-navy/80 border border-mint/20">
              <span className="text-xs text-mint font-semibold block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Available
              </span>
              <span className="text-2xl font-bold font-heading text-coolwhite tabular-nums mt-0.5 block">
                {available}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-navy/80 border border-amber/20">
              <span className="text-xs text-amber font-semibold block flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" /> Unavailable
              </span>
              <span className="text-2xl font-bold font-heading text-coolwhite tabular-nums mt-0.5 block">
                {unavailable}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-graphite/40 border border-hairline rounded-xl p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-slate-muted">Organizational Span</span>
            <PieChart className="w-4 h-4 text-lime" />
          </div>
          <div className="flex items-baseline justify-between mt-1">
            <div>
              <span className="text-3xl font-extrabold font-heading text-coolwhite tabular-nums">
                {departmentStats.length}
              </span>
              <span className="text-xs text-slate-muted block">Departments</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-extrabold font-heading text-lime tabular-nums">
                {metrics.activeRolesCount}
              </span>
              <span className="text-xs text-slate-muted block">Distinct Roles</span>
            </div>
          </div>
          <p className="text-[11px] text-slate-muted mt-auto pt-1">
            Average {(total / (departmentStats.length || 1)).toFixed(1)} collaborators per department
          </p>
        </div>
      </div>

      {/* Department Breakdown Matrix */}
      <div className="bg-graphite/40 border border-hairline rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
          <div>
            <h3 className="text-base font-bold font-heading text-coolwhite">
              Departmental Readiness Matrix
            </h3>
            <p className="text-xs text-slate-muted mt-0.5">
              Current operational capacity calculated per functional unit
            </p>
          </div>
          <span className="text-xs font-mono text-lime bg-lime/10 px-2.5 py-1 rounded border border-lime/30">
            {departmentStats.length} Active Units
          </span>
        </div>

        {departmentStats.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-muted">
            No departments found. Add team members to generate matrix.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {departmentStats.map((item) => (
              <div
                key={item.department}
                className="p-4 rounded-xl bg-navy/60 border border-hairline/80 flex flex-col gap-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-semibold text-sm text-coolwhite font-heading">
                      {item.department}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-ink text-slate-muted border border-hairline">
                      {item.total} {item.total === 1 ? 'member' : 'members'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono">
                    <span className="text-mint flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                      {item.available} Available
                    </span>
                    <span className="text-amber flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber" />
                      {item.unavailable} Busy
                    </span>
                    <span className="font-bold text-coolwhite px-2 py-0.5 rounded bg-graphite border border-hairline">
                      {item.rate}%
                    </span>
                  </div>
                </div>

                {/* Visual Stacked Bar */}
                <div className="w-full h-3 bg-ink rounded-full overflow-hidden flex border border-hairline">
                  <div
                    className="h-full bg-mint transition-all duration-300"
                    style={{ width: `${item.rate}%` }}
                    title={`${item.available} available`}
                  />
                  <div
                    className="h-full bg-amber/80 transition-all duration-300"
                    style={{ width: `${100 - item.rate}%` }}
                    title={`${item.unavailable} unavailable`}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Role Breakdown Table */}
      <div className="bg-graphite/40 border border-hairline rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-between pb-4 border-b border-hairline mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-lime" />
            <h3 className="text-base font-bold font-heading text-coolwhite">
              Role Distribution & Allocation
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-muted">
            {roleStats.length} Unique Titles
          </span>
        </div>

        {roleStats.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-muted">
            No roles recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-navy/70 border-b border-hairline text-slate-muted font-mono uppercase">
                  <th className="py-2.5 px-3">Role Title</th>
                  <th className="py-2.5 px-3 text-center">Total Assigned</th>
                  <th className="py-2.5 px-3 text-center">Available</th>
                  <th className="py-2.5 px-3 text-center">Unavailable</th>
                  <th className="py-2.5 px-3 text-right">Readiness</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-hairline/40">
                {roleStats.map((r) => (
                  <tr key={r.role} className="hover:bg-navy/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-coolwhite">{r.role}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-slate-muted">{r.total}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-mint font-medium">{r.available}</td>
                    <td className="py-2.5 px-3 text-center font-mono text-amber">{r.unavailable}</td>
                    <td className="py-2.5 px-3 text-right">
                      <span
                        className={`font-mono font-bold ${
                          r.rate >= 70 ? 'text-mint' : r.rate > 0 ? 'text-amber' : 'text-slate-muted'
                        }`}
                      >
                        {r.rate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
