export type TeamMember = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isAvailable: boolean;
  createdAt: string;
  lastUpdated: string;
};

export type ActivityEventType =
  | "availability"
  | "member_added"
  | "member_edited"
  | "member_deleted";

export type ActivityEvent = {
  id: string;
  memberId: string;
  memberName: string;
  type: ActivityEventType;
  message: string;
  previousValue?: boolean;
  newValue?: boolean;
  createdAt: string;
};

export type AppState = {
  members: TeamMember[];
  activity: ActivityEvent[];
};

export type FilterAvailability = "ALL" | "AVAILABLE" | "UNAVAILABLE";

export type SortOption = "NAME_ASC" | "NAME_DESC" | "RECENTLY_UPDATED" | "DEPARTMENT";

export type DepartmentStats = {
  department: string;
  total: number;
  available: number;
  unavailable: number;
  rate: number;
};

export type DerivedMetrics = {
  total: number;
  available: number;
  unavailable: number;
  availabilityRate: number;
  departmentStats: DepartmentStats[];
  activeRolesCount: number;
};
