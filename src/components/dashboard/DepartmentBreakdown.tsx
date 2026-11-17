import React from 'react';
import { DepartmentStats } from '../../types/team';
import { Layers } from 'lucide-react';

export interface DepartmentBreakdownProps {
  stats: DepartmentStats[];
  onSelectDepartment?: (dept: string) => void;
}

export const DepartmentBreakdown: React.FC<DepartmentBreakdownProps> = ({
  stats,
  onSelectDepartment,
}) => {
  if (stats.length === 0) {
    return (
      <div className="bg-graphite/40 border border-hairline rounded-xl p-5 flex flex-col items-center justify-center text-center py-10">
        <Layers className="w-8 h-8 text-slate-muted mb-2 opacity-60" />
        <p className="text-sm font-semibold text-coolwhite">No Department Data</p>
        <p className="text-xs text-slate-muted mt-1">
          Add team members with departments to see breakdowns.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-graphite/40 border border-hairline rounded-xl p-5 shadow-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-lime" />
          <h3 className="text-sm font-bold font-heading text-coolwhite tracking-tight">
            Department Availability
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-muted">
          {stats.length} {stats.length === 1 ? 'Unit' : 'Units'}
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {stats.map((dept) => {
          return (
            <div
              key={dept.department}
              onClick={() => onSelectDepartment?.(dept.department)}
              className={`flex flex-col gap-1.5 p-2 rounded-lg transition-colors ${
                onSelectDepartment ? 'hover:bg-navy/60 cursor-pointer' : ''
              }`}
            >
              <div className="flex items-baseline justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-coolwhite">{dept.department}</span>
                  <span className="font-mono text-[11px] text-slate-muted">
                    ({dept.available}/{dept.total})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`font-mono font-bold ${
                      dept.rate >= 75
                        ? 'text-mint'
                        : dept.rate >= 40
                        ? 'text-lime'
                        : 'text-amber'
                    }`}
                  >
                    {dept.rate}%
                  </span>
                </div>
              </div>

              {/* Stacked bar */}
              <div className="w-full h-2 bg-ink rounded-full overflow-hidden flex border border-hairline/40">
                <div
                  className="h-full bg-mint transition-all duration-300"
                  style={{ width: `${dept.rate}%` }}
                />
                <div
                  className="h-full bg-amber/70 transition-all duration-300"
                  style={{ width: `${100 - dept.rate}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
