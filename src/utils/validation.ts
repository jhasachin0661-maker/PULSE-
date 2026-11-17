import { TeamMember } from '../types/team';

export type ValidationErrors = {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
};

export function validateEmail(email: string): boolean {
  // Standard RFC 5322 regex approximation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function validateMemberForm(
  data: {
    name: string;
    email: string;
    role: string;
    department: string;
  },
  existingMembers: TeamMember[],
  currentMemberId?: string
): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Full name is required.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  const trimmedEmail = data.email.trim().toLowerCase();
  if (!trimmedEmail) {
    errors.email = 'Email address is required.';
  } else if (!validateEmail(trimmedEmail)) {
    errors.email = 'Please provide a valid email address.';
  } else {
    // Check case-insensitive duplicate email
    const isDuplicate = existingMembers.some(
      (m) => m.email.trim().toLowerCase() === trimmedEmail && m.id !== currentMemberId
    );
    if (isDuplicate) {
      errors.email = 'A team member with this email address already exists.';
    }
  }

  const trimmedRole = data.role.trim();
  if (!trimmedRole) {
    errors.role = 'Role / Title is required.';
  }

  const trimmedDept = data.department.trim();
  if (!trimmedDept) {
    errors.department = 'Department is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
