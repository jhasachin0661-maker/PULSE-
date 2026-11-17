import React from 'react';
import { TeamMember } from '../../types/team';
import { AvailabilitySwitch } from './AvailabilitySwitch';
import { Badge } from '../ui/Badge';
import { formatRelativeTime } from '../../utils/date';
import { Edit2, Trash2, Mail } from 'lucide-react';

export interface MemberCardProps {
  member: TeamMember;
  onToggle: (id: string) => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

export const MemberCard: React.FC<MemberCardProps> = ({
  member,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <div className="bg-graphite/40 border border-hairline/80 rounded-xl p-4 flex flex-col gap-3 hover:border-slate-subtle transition-all">
      {/* Top Header: Avatar + Info + Actions */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-navy border border-hairline flex items-center justify-center text-sm font-bold font-mono text-lime flex-shrink-0">
            {initials || 'U'}
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-sm text-coolwhite truncate">{member.name}</h3>
            <p className="text-xs text-lime/90 font-medium truncate mt-0.5">{member.role}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => onEdit(member)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-muted hover:text-coolwhite hover:bg-navy rounded-lg transition-colors"
            aria-label={`Edit ${member.name}`}
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-muted hover:text-red-400 hover:bg-red-950/30 rounded-lg transition-colors"
            aria-label={`Delete ${member.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Email & Department */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs pt-1 border-t border-hairline/40">
        <div className="flex items-center gap-1 text-slate-muted truncate">
          <Mail className="w-3.5 h-3.5 flex-shrink-0 opacity-70" />
          <span className="truncate">{member.email}</span>
        </div>
        <span className="px-2 py-0.5 rounded bg-navy text-slate-muted border border-hairline font-mono text-[11px]">
          {member.department}
        </span>
      </div>

      {/* Bottom status and interactive toggle */}
      <div className="flex items-center justify-between pt-2 border-t border-hairline/40">
        <div className="flex items-center gap-2">
          <Badge variant={member.isAvailable ? 'available' : 'unavailable'} dot size="sm">
            {member.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
          <span className="text-[11px] font-mono text-slate-muted">
            {formatRelativeTime(member.lastUpdated)}
          </span>
        </div>

        <div className="min-h-[44px] flex items-center">
          <AvailabilitySwitch
            id={member.id}
            memberName={member.name}
            isAvailable={member.isAvailable}
            onToggle={onToggle}
            size="sm"
          />
        </div>
      </div>
    </div>
  );
};
