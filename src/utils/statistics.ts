import { TeamMember, DerivedMetrics, DepartmentStats } from '../types/team';

export function calculateMetrics(members: TeamMember[]): DerivedMetrics {
  const total = members.length;
  const available = members.filter((m) => m.isAvailable).length;
  const unavailable = total - available;
  const availabilityRate = total === 0 ? 0 : Math.round((available / total) * 100);

  // Group by department
  const deptMap: Record<string, { total: number; available: number; unavailable: number }> = {};
  const uniqueRoles = new Set<string>();

  members.forEach((m) => {
    const dept = m.department.trim() || 'General';
    if (!deptMap[dept]) {
      deptMap[dept] = { total: 0, available: 0, unavailable: 0 };
    }
    deptMap[dept].total += 1;
    if (m.isAvailable) {
      deptMap[dept].available += 1;
    } else {
      deptMap[dept].unavailable += 1;
    }

    if (m.role) {
      uniqueRoles.add(m.role.trim().toLowerCase());
    }
  });

  const departmentStats: DepartmentStats[] = Object.entries(deptMap)
    .map(([department, data]) => ({
      department,
      total: data.total,
      available: data.available,
      unavailable: data.unavailable,
      rate: data.total === 0 ? 0 : Math.round((data.available / data.total) * 100),
    }))
    .sort((a, b) => b.total - a.total || a.department.localeCompare(b.department));

  return {
    total,
    available,
    unavailable,
    availabilityRate,
    departmentStats,
    activeRolesCount: uniqueRoles.size,
  };
}
