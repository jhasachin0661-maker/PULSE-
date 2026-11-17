import React from 'react';
import { ActivityEvent } from '../../types/team';
import { History, ArrowRight, UserCheck, UserX, UserPlus, UserMinus, Edit3 } from 'lucide-react';
import { formatRelativeTime } from '../../utils/date';

export interface ActivityPreviewProps {
  activity: ActivityEvent[];
  onViewAll: () => void;
}

export const ActivityPreview: React.FC<ActivityPreviewProps> = ({ activity, onViewAll }) => {
  const latestFive = activity.slice(0, 5);

  const getEventIcon = (event: ActivityEvent) => {
    switch (event.type) {
      case 'availability':
        return event.newValue ? (
          <UserCheck className="w-3.5 h-3.5 text-mint" />
        ) : (
          <UserX className="w-3.5 h-3.5 text-amber" />
        );
      case 'member_added':
        return <UserPlus className="w-3.5 h-3.5 text-lime" />;
      case 'member_deleted':
        return <UserMinus className="w-3.5 h-3.5 text-red-400" />;
      case 'member_edited':
        return <Edit3 className="w-3.5 h-3.5 text-slate-muted" />;
      default:
        return <History className="w-3.5 h-3.5 text-slate-muted" />;
    }
  };

  return (
    <div className="bg-graphite/40 border border-hairline rounded-xl p-5 shadow-card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-lime" />
          <h3 className="text-sm font-bold font-heading text-coolwhite tracking-tight">
            Recent Activity
          </h3>
        </div>
        <button
          onClick={onViewAll}
          className="text-xs text-lime hover:text-lime-hover font-semibold flex items-center gap-1 transition-colors group"
        >
          View all
          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {latestFive.length === 0 ? (
        <div className="py-8 text-center text-xs text-slate-muted">
          No recorded activity events yet.
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {latestFive.map((item) => (
            <div
              key={item.id}
              className="flex items-start gap-3 p-2 rounded-lg bg-navy/40 border border-hairline/40 hover:border-slate-subtle/60 transition-colors"
            >
              <div className="p-1.5 rounded bg-ink/70 border border-hairline flex-shrink-0 mt-0.5">
                {getEventIcon(item)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-coolwhite font-medium leading-snug">
                  {item.message}
                </p>
                <span className="text-[11px] font-mono text-slate-muted block mt-0.5">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
