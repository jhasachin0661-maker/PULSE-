import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { useToast } from '../components/ui/Toast';
import { ActivityTimeline } from '../components/activity/ActivityTimeline';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { History, ShieldCheck } from 'lucide-react';

export const ActivityLogPage: React.FC = () => {
  const { state, clearActivity } = useTeam();
  const { success } = useToast();
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleConfirmClear = () => {
    clearActivity();
    success('Activity Log Cleared', 'All recorded operations events have been purged.');
    setIsClearConfirmOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner Notice */}
      <div className="bg-navy/70 border border-hairline rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-lime/10 text-lime border border-lime/30">
            <History className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold font-heading text-coolwhite">
              Operations Audit Trail
            </h2>
            <p className="text-xs text-slate-muted">
              Chronological log of all availability changes, collaborator enrollments, edits, and removals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs font-mono text-slate-muted bg-ink px-3 py-1.5 rounded-lg border border-hairline flex-shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-mint" />
          <span>Bounded: Latest 100 Events</span>
        </div>
      </div>

      {/* Main Activity Timeline Component */}
      <ActivityTimeline
        activity={state.activity}
        onClearActivity={() => setIsClearConfirmOpen(true)}
      />

      {/* Clear Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        onClose={() => setIsClearConfirmOpen(false)}
        onConfirm={handleConfirmClear}
        title="Clear Activity Log"
        message="Are you sure you want to clear all recorded activity events? This will remove the event history permanently from localStorage while preserving your team roster."
        confirmLabel="Clear Log"
        cancelLabel="Keep Events"
        variant="danger"
      />
    </div>
  );
};
