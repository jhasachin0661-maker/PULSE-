import React, { useState, useEffect } from 'react';
import { Dialog } from '../ui/Dialog';
import { Input, Select } from '../ui/Input';
import { Button } from '../ui/Button';
import { TeamMember } from '../../types/team';
import { validateMemberForm, ValidationErrors } from '../../utils/validation';

export interface MemberFormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    email: string;
    role: string;
    department: string;
    isAvailable: boolean;
  }) => void;
  initialMember?: TeamMember | null;
  existingMembers: TeamMember[];
  suggestedDepartments: string[];
}

const COMMON_DEPARTMENTS = [
  'Engineering',
  'Design',
  'Product',
  'Operations',
  'Security & Compliance',
  'Marketing',
  'Data & Analytics',
  'Quality Assurance',
];

export const MemberFormDialog: React.FC<MemberFormDialogProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialMember,
  existingMembers,
  suggestedDepartments,
}) => {
  const isEditing = Boolean(initialMember);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    department: 'Engineering',
    customDepartment: '',
    isAvailable: true,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isCustomDept, setIsCustomDept] = useState(false);

  // Combine suggested and common departments
  const departmentOptions = Array.from(
    new Set([...COMMON_DEPARTMENTS, ...suggestedDepartments])
  ).sort();

  useEffect(() => {
    if (initialMember) {
      const isCustom = !departmentOptions.includes(initialMember.department);
      setIsCustomDept(isCustom);
      setFormData({
        name: initialMember.name,
        email: initialMember.email,
        role: initialMember.role,
        department: isCustom ? '__CUSTOM__' : initialMember.department,
        customDepartment: isCustom ? initialMember.department : '',
        isAvailable: initialMember.isAvailable,
      });
    } else {
      setIsCustomDept(false);
      setFormData({
        name: '',
        email: '',
        role: '',
        department: departmentOptions[0] || 'Engineering',
        customDepartment: '',
        isAvailable: true,
      });
    }
    setErrors({});
  }, [initialMember, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof ValidationErrors]) {
        setErrors((prev) => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleDeptSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '__CUSTOM__') {
      setIsCustomDept(true);
      setFormData((prev) => ({ ...prev, department: '__CUSTOM__' }));
    } else {
      setIsCustomDept(false);
      setFormData((prev) => ({ ...prev, department: val }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalDept = isCustomDept
      ? formData.customDepartment.trim()
      : formData.department.trim();

    const dataToValidate = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      department: finalDept,
    };

    const validation = validateMemberForm(
      dataToValidate,
      existingMembers,
      initialMember ? initialMember.id : undefined
    );

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      role: formData.role.trim(),
      department: finalDept,
      isAvailable: formData.isAvailable,
    });
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Team Member' : 'Add Team Member'}
      description={
        isEditing
          ? 'Modify team member attributes and operational status.'
          : 'Register a new collaborator to the operations roster.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <Input
          label="Full Name"
          name="name"
          placeholder="e.g. Aarav Sharma"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />

        <Input
          label="Corporate Email"
          name="email"
          type="email"
          placeholder="e.g. aarav.sharma@pulse.internal"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          required
        />

        <Input
          label="Role / Title"
          name="role"
          placeholder="e.g. Lead Systems Architect"
          value={formData.role}
          onChange={handleChange}
          error={errors.role}
          required
        />

        <div className="flex flex-col gap-1.5">
          <Select
            label="Department"
            name="department"
            value={formData.department}
            onChange={handleDeptSelect}
            options={[
              ...departmentOptions.map((dept) => ({ value: dept, label: dept })),
              { value: '__CUSTOM__', label: '+ Enter Custom Department' },
            ]}
          />
          {isCustomDept && (
            <div className="mt-2">
              <Input
                label="Custom Department Name"
                name="customDepartment"
                placeholder="Enter department name"
                value={formData.customDepartment}
                onChange={handleChange}
                error={errors.department}
                required
              />
            </div>
          )}
        </div>

        {/* Initial Availability Toggle */}
        <div className="pt-2 pb-1">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-muted block mb-2">
            Initial Availability Status
          </label>
          <div className="flex items-center gap-3 p-3 rounded-lg bg-ink/70 border border-hairline">
            <input
              type="checkbox"
              id="isAvailableCheckbox"
              name="isAvailable"
              checked={formData.isAvailable}
              onChange={(e) => setFormData((prev) => ({ ...prev, isAvailable: e.target.checked }))}
              className="w-4 h-4 rounded text-lime bg-ink border-hairline focus:ring-lime focus:ring-offset-ink cursor-pointer"
            />
            <label htmlFor="isAvailableCheckbox" className="text-sm cursor-pointer select-none">
              <span className="font-medium text-coolwhite">
                {formData.isAvailable ? 'Available for Deployment' : 'Currently Unavailable'}
              </span>
              <span className="block text-xs text-slate-muted">
                {formData.isAvailable
                  ? 'Mark this team member as actively available for tasks.'
                  : 'Mark this team member as off-duty, in meetings, or on leave.'}
              </span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline mt-2">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {isEditing ? 'Save Changes' : 'Add Member'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
};
