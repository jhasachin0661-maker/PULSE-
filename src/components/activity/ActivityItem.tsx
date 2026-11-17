import React from 'react';
import { ActivityEvent } from '../../types/team';
import { UserCheck, UserX, UserPlus, UserMinus, Edit3, Clock } from 'lucide-react';
import { formatRelativeTime, formatExactDateTime } from '../../utils/date';
import { Badge } from '../ui/Badge';

export interface ActivityItemProps {
  event: ActivityEvent;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ event }) => {
  const getBadgeAndIcon = () => {
    switch (event.type) {
      case 'availability':
        return {
          icon: event.newValue ? (
            <UserCheck className="w-4 h-4 text-mint" />
          ) : (
            <UserX className="w-4 h-4 text-amber" />
          ),
          badge: (
            <Badge
              variant={event.newValue ? 'available' : 'unavailable'}
              dot
              size="sm"
            >
              {event.newValue ? 'Marked Available' : 'Marked Unavailable'}
            </Badge>
          ),
        };
      case 'member_added':
        return {
          icon: <UserPlus className="w-4 h-4 text-lime" />,
          badge: (
            <Badge variant="accent" size="sm">
              Member Added
            </Badge>
          ),
        };
      case 'member_deleted':
        return {
          icon: <UserMinus className="w-4 h-4 text-red-400" />,
          badge: (
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-950/40 text-red-300 border border-red-800/40">
              Member Removed
            </span>
          ),
        };
      case 'member_edited':
        return {
          icon: <Edit3 className="w-4 h-4 text-slate-muted" />,
          badge: (
            <Badge variant="neutral" size="sm">
              Profile Updated
            </Badge>
          ),
        };
      default:
        return {
          icon: <Clock className="w-4 h-4 text-slate-muted" />,
          badge: null,
        };
    }
  };

  const { icon, badge } = getBadgeAndIcon();

  return (
    <div className="relative pl-8 pb-7 last:pb-1 group">
      {/* Timeline vertical connector line */}
      <div className="absolute left-[13px] top-6 bottom-0 w-[2px] bg-hairline/60 group-last:hidden" />

      {/* Timeline icon node */}
      <div className="absolute left-0 top-1 w-7 h-7 rounded-lg bg-navy border border-hairline flex items-center justify-center shadow-sm group-hover:border-lime/40 transition-colors">
        {icon}
      </div>

      <div className="bg-graphite/30 border border-hairline/80 rounded-xl p-4 flex flex-col gap-2 hover:border-slate-subtle/70 transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm text-coolwhite font-heading">
              {event.memberName}
            </span>
            {badge}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono text-slate-muted" title={formatExactDateTime(event.createdAt)}>
            <Clock className="w-3 h-3 opacity-60" />
            <span>{formatRelativeTime(event.createdAt)}</span>
          </div>
        </div>

        <p className="text-xs text-slate-muted leading-relaxed">
          {event.message}
        </p>
      </div>
    </div>
  );
};
