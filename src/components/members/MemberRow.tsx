import React from 'react';
import { TeamMember } from '../../types/team';
import { AvailabilitySwitch } from './AvailabilitySwitch';
import { Badge } from '../ui/Badge';
import { formatRelativeTime, formatExactDateTime } from '../../utils/date';
import { Edit2, Trash2, Mail } from 'lucide-react';

export interface MemberRowProps {
  member: TeamMember;
  onToggle: (id: string) => void;
  onEdit: (member: TeamMember) => void;
  onDelete: (member: TeamMember) => void;
}

export const MemberRow: React.FC<MemberRowProps> = ({
  member,
  onToggle,
  onEdit,
  onDelete,
}) => {
  // Generate consistent initials from member name
  const initials = member.name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');

  return (
    <tr className="border-b border-hairline/60 hover:bg-graphite/40 transition-colors duration-150 group">
      {/* Member identity */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-navy border border-hairline flex items-center justify-center text-xs font-bold font-mono text-lime flex-shrink-0 group-hover:border-lime/40 transition-colors">
            {initials || 'U'}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-coolwhite truncate group-hover:text-lime transition-colors">
              {member.name}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-muted truncate mt-0.5">
              <Mail className="w-3 h-3 flex-shrink-0 opacity-70" />
              <span className="truncate">{member.email}</span>
            </div>
          </div>
        </div>
      </td>

      {/* Role */}
      <td className="py-3.5 px-4 text-sm text-coolwhite font-medium">
        <span className="truncate block max-w-[200px]" title={member.role}>
          {member.role}
        </span>
      </td>

      {/* Department */}
      <td className="py-3.5 px-4">
        <span className="inline-block px-2.5 py-1 text-xs font-mono font-medium rounded bg-navy text-slate-muted border border-hairline">
          {member.department}
        </span>
      </td>

      {/* Availability Status & Switch */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-3">
          <AvailabilitySwitch
            id={member.id}
            memberName={member.name}
            isAvailable={member.isAvailable}
            onToggle={onToggle}
          />
          <Badge
            variant={member.isAvailable ? 'available' : 'unavailable'}
            dot
            size="sm"
          >
            {member.isAvailable ? 'Available' : 'Unavailable'}
          </Badge>
        </div>
      </td>

      {/* Last Updated */}
      <td className="py-3.5 px-4 text-xs font-mono text-slate-muted whitespace-nowrap">
        <span title={formatExactDateTime(member.lastUpdated)}>
          {formatRelativeTime(member.lastUpdated)}
        </span>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={() => onEdit(member)}
            className="p-1.5 text-slate-muted hover:text-coolwhite hover:bg-navy rounded transition-colors"
            aria-label={`Edit ${member.name}`}
            title="Edit member"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(member)}
            className="p-1.5 text-slate-muted hover:text-red-400 hover:bg-red-950/30 rounded transition-colors"
            aria-label={`Delete ${member.name}`}
            title="Delete member"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};
