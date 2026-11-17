import React, { useState, useMemo } from 'react';
import { ActivityEvent, ActivityEventType } from '../../types/team';
import { ActivityItem } from './ActivityItem';
import { History, Filter, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

export interface ActivityTimelineProps {
  activity: ActivityEvent[];
  onClearActivity: () => void;
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({
  activity,
  onClearActivity,
}) => {
  const [typeFilter, setTypeFilter] = useState<'ALL' | ActivityEventType>('ALL');

  const filteredActivity = useMemo(() => {
    if (typeFilter === 'ALL') return activity;
    return activity.filter((item) => item.type === typeFilter);
  }, [activity, typeFilter]);

  return (
    <div className="flex flex-col gap-5">
      {/* Filters & Actions Bar */}
      <div className="bg-graphite/40 border border-hairline rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-muted mr-1 font-semibold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5 text-lime" />
            Filter by:
          </div>

          <button
            onClick={() => setTypeFilter('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'ALL'
                ? 'bg-lime text-ink font-semibold'
                : 'bg-navy text-slate-muted hover:text-coolwhite border border-hairline'
            }`}
          >
            All Events ({activity.length})
          </button>
          <button
            onClick={() => setTypeFilter('availability')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'availability'
                ? 'bg-mint text-ink font-semibold'
                : 'bg-navy text-slate-muted hover:text-coolwhite border border-hairline'
            }`}
          >
            Availability Toggles
          </button>
          <button
            onClick={() => setTypeFilter('member_added')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'member_added'
                ? 'bg-lime text-ink font-semibold'
                : 'bg-navy text-slate-muted hover:text-coolwhite border border-hairline'
            }`}
          >
            Additions
          </button>
          <button
            onClick={() => setTypeFilter('member_edited')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'member_edited'
                ? 'bg-graphite-light text-coolwhite font-semibold'
                : 'bg-navy text-slate-muted hover:text-coolwhite border border-hairline'
            }`}
          >
            Edits
          </button>
          <button
            onClick={() => setTypeFilter('member_deleted')}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors ${
              typeFilter === 'member_deleted'
                ? 'bg-red-500 text-coolwhite font-semibold'
                : 'bg-navy text-slate-muted hover:text-coolwhite border border-hairline'
            }`}
          >
            Deletions
          </button>
        </div>

        {activity.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearActivity}
            className="text-amber hover:text-amber/90"
            title="Clear activity log"
          >
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Clear Log
          </Button>
        )}
      </div>

      {/* Main Timeline List */}
      {filteredActivity.length === 0 ? (
        <div className="bg-graphite/30 border border-hairline rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <History className="w-10 h-10 text-slate-muted opacity-40 mb-3" />
          <p className="text-base font-semibold text-coolwhite">No activity events found</p>
          <p className="text-xs text-slate-muted mt-1 max-w-sm">
            {activity.length === 0
              ? 'Status changes, additions, and modifications will be recorded here.'
              : 'No events match the selected event type filter.'}
          </p>
        </div>
      ) : (
        <div className="pt-2">
          {filteredActivity.map((event) => (
            <ActivityItem key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};
