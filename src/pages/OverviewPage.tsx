import React from 'react';
import { useTeam } from '../context/TeamContext';
import { MetricCard } from '../components/dashboard/MetricCard';
import { TeamPulse } from '../components/dashboard/TeamPulse';
import { DepartmentBreakdown } from '../components/dashboard/DepartmentBreakdown';
import { ActivityPreview } from '../components/dashboard/ActivityPreview';
import { Users, CheckCircle2, XCircle, TrendingUp, UserPlus, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';

export interface OverviewPageProps {
  onNavigateToMembers: () => void;
  onNavigateToActivity: () => void;
  onOpenAddMember: () => void;
  onSelectDepartmentFilter?: (dept: string) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onNavigateToMembers,
  onNavigateToActivity,
  onOpenAddMember,
  onSelectDepartmentFilter,
}) => {
  const { metrics, state } = useTeam();
  const { total, available, unavailable, availabilityRate, departmentStats } = metrics;

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards: Asymmetric Composition */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Total Roster"
          value={total}
          icon={Users}
          variant="slate"
          badge={`${metrics.activeRolesCount} Roles`}
          subtext="Total collaborators registered"
        />
        <MetricCard
          label="Available Now"
          value={available}
          icon={CheckCircle2}
          variant="mint"
          badge={total > 0 ? `${Math.round((available / total) * 100)}%` : '0%'}
          subtext="Ready for immediate deployment"
        />
        <MetricCard
          label="Unavailable"
          value={unavailable}
          icon={XCircle}
          variant="amber"
          badge={total > 0 ? `${Math.round((unavailable / total) * 100)}%` : '0%'}
          subtext="In focus time, meetings, or leave"
        />
        <MetricCard
          label="Availability Rate"
          value={`${availabilityRate}%`}
          icon={TrendingUp}
          variant="lime"
          badge={availabilityRate >= 70 ? 'HEALTHY' : 'ATTENTION'}
          subtext="Target benchmark: 70%+"
        />
      </div>

      {/* Main Feature Panel: Team Pulse Monitor */}
      <TeamPulse metrics={metrics} />

      {/* Quick Actions Row */}
      <div className="bg-graphite/30 border border-hairline rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-muted">
            Quick Actions:
          </span>
          <span className="text-xs text-coolwhite">
            Manage your local operations team seamlessly
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onNavigateToMembers}>
            <Users className="w-3.5 h-3.5 mr-1.5" />
            View Team Roster
            <ArrowRight className="w-3 h-3 ml-1 opacity-70" />
          </Button>
          <Button variant="primary" size="sm" onClick={onOpenAddMember}>
            <UserPlus className="w-3.5 h-3.5 mr-1.5" />
            Add Collaborator
          </Button>
        </div>
      </div>

      {/* Bottom Grid: Department Breakdown & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <DepartmentBreakdown
            stats={departmentStats}
            onSelectDepartment={(dept) => {
              if (onSelectDepartmentFilter) {
                onSelectDepartmentFilter(dept);
              }
              onNavigateToMembers();
            }}
          />
        </div>

        <div className="lg:col-span-5">
          <ActivityPreview
            activity={state.activity}
            onViewAll={onNavigateToActivity}
          />
        </div>
      </div>
    </div>
  );
};
