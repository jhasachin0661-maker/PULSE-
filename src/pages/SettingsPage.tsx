import React, { useState } from 'react';
import { useTeam } from '../context/TeamContext';
import { useToast } from '../components/ui/Toast';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { STORAGE_KEY } from '../services/storage';
import {
  RotateCcw,
  Trash2,
  Database,
  HardDrive,
  AlertTriangle,
  Info,
  CheckCircle2,
  Terminal,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { state, resetDemoData, clearActivity } = useTeam();
  const { success } = useToast();

  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearLogConfirmOpen, setIsClearLogConfirmOpen] = useState(false);

  const handleConfirmReset = () => {
    resetDemoData();
    success('Demo Data Restored', 'The original sample team members and initial activity have been loaded.');
    setIsResetConfirmOpen(false);
  };

  const handleConfirmClearLog = () => {
    clearActivity();
    success('Activity History Purged', 'All activity events have been cleared from local storage.');
    setIsClearLogConfirmOpen(false);
  };

  const calculateStorageSize = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return '0 KB';
      const bytes = new Blob([raw]).size;
      return `${(bytes / 1024).toFixed(2)} KB`;
    } catch {
      return 'N/A';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {/* Explicit Local Storage Disclosure Banner */}
      <div className="p-5 rounded-xl bg-amber/10 border border-amber/30 flex items-start gap-3.5">
        <AlertTriangle className="w-5 h-5 text-amber flex-shrink-0 mt-0.5" />
        <div className="flex flex-col gap-1 text-xs">
          <strong className="text-sm font-bold text-amber">
            Local Storage Boundary Disclosure
          </strong>
          <p className="text-slate-muted leading-relaxed">
            PULSE operates 100% on client-side state. All roster changes, toggles, and activity logs are stored exclusively in your browser’s <code className="text-amber font-mono bg-ink/60 px-1 py-0.5 rounded">{STORAGE_KEY}</code> partition. Clearing your browser cookies or cache will erase all non-default records. There is <strong>no cloud sync or server database</strong>.
          </p>
        </div>
      </div>

      {/* Storage & Environment Diagnostics */}
      <div className="bg-graphite/40 border border-hairline rounded-xl p-6 shadow-card flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-hairline">
          <HardDrive className="w-4 h-4 text-lime" />
          <h3 className="text-sm font-bold font-heading text-coolwhite">
            Client Diagnostics & Storage State
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-3 rounded-lg bg-navy/70 border border-hairline">
            <span className="text-[11px] font-mono text-slate-muted uppercase">Storage Key</span>
            <p className="text-xs font-mono font-bold text-coolwhite mt-1">{STORAGE_KEY}</p>
          </div>

          <div className="p-3 rounded-lg bg-navy/70 border border-hairline">
            <span className="text-[11px] font-mono text-slate-muted uppercase">Allocated Footprint</span>
            <p className="text-xs font-mono font-bold text-lime mt-1">{calculateStorageSize()}</p>
          </div>

          <div className="p-3 rounded-lg bg-navy/70 border border-hairline">
            <span className="text-[11px] font-mono text-slate-muted uppercase">Active Members</span>
            <p className="text-xs font-mono font-bold text-mint mt-1">
              {state.members.length} records
            </p>
          </div>
        </div>
      </div>

      {/* Data Management Actions */}
      <div className="bg-graphite/40 border border-hairline rounded-xl p-6 shadow-card flex flex-col gap-5">
        <div className="flex items-center gap-2 pb-3 border-b border-hairline">
          <Database className="w-4 h-4 text-lime" />
          <h3 className="text-sm font-bold font-heading text-coolwhite">
            Data Lifecycle & Reset Controls
          </h3>
        </div>

        <div className="flex flex-col gap-4">
          {/* Action 1: Reset Demo Data */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-navy/40 border border-hairline gap-3">
            <div>
              <h4 className="text-sm font-semibold text-coolwhite">Restore Demo Roster</h4>
              <p className="text-xs text-slate-muted mt-0.5">
                Overwrites current roster and restores original 8 engineering, design, and ops members.
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsResetConfirmOpen(true)}
              className="flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Demo Roster
            </Button>
          </div>

          {/* Action 2: Clear Activity History Only */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-navy/40 border border-hairline gap-3">
            <div>
              <h4 className="text-sm font-semibold text-coolwhite">Clear Activity Audit Trail</h4>
              <p className="text-xs text-slate-muted mt-0.5">
                Clears all event history logs without modifying your current team roster or member statuses.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              onClick={() => setIsClearLogConfirmOpen(true)}
              className="flex-shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              Clear Activity Only
            </Button>
          </div>
        </div>
      </div>

      {/* Design System & Aesthetics Specs */}
      <div className="bg-graphite/40 border border-hairline rounded-xl p-6 shadow-card flex flex-col gap-4">
        <div className="flex items-center gap-2 pb-3 border-b border-hairline">
          <Terminal className="w-4 h-4 text-lime" />
          <h3 className="text-sm font-bold font-heading text-coolwhite">
            Midnight Operations Console Specifications
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#101820] border border-hairline" />
            <span>#101820 Ink</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#172631]" />
            <span>#172631 Navy</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#203541]" />
            <span>#203541 Graphite</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#C6F36B]" />
            <span>#C6F36B Lime</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#63D6B1]" />
            <span>#63D6B1 Mint</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F2B45B]" />
            <span>#F2B45B Amber</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#F2F5F2]" />
            <span>#F2F5F2 White</span>
          </div>
          <div className="p-2.5 rounded bg-ink border border-hairline flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#344852]" />
            <span>#344852 Hairline</span>
          </div>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset Demo Data"
        message="Are you sure you want to restore the demo roster? Any custom team members added or modified will be overwritten by the original 8 demo team members."
        confirmLabel="Reset to Demo"
        cancelLabel="Cancel"
        variant="primary"
      />

      <ConfirmDialog
        isOpen={isClearLogConfirmOpen}
        onClose={() => setIsClearLogConfirmOpen(false)}
        onConfirm={handleConfirmClearLog}
        title="Clear Activity Trail"
        message="Are you sure you want to clear all recorded activity events? Team members and their current statuses will remain untouched."
        confirmLabel="Clear Log"
        cancelLabel="Cancel"
        variant="danger"
      />
    </div>
  );
};
