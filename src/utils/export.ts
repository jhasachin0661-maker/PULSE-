import { TeamMember } from '../types/team';

export function exportTeamToCSV(members: TeamMember[]): void {
  const headers = ['ID', 'Name', 'Email', 'Role', 'Department', 'Status', 'CreatedAt', 'LastUpdated'];

  const rows = members.map((m) => [
    `"${m.id}"`,
    `"${m.name.replace(/"/g, '""')}"`,
    `"${m.email.replace(/"/g, '""')}"`,
    `"${m.role.replace(/"/g, '""')}"`,
    `"${m.department.replace(/"/g, '""')}"`,
    m.isAvailable ? '"Available"' : '"Unavailable"',
    `"${m.createdAt}"`,
    `"${m.lastUpdated}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  link.setAttribute('href', url);
  link.setAttribute('download', `pulse_roster_${timestamp}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
