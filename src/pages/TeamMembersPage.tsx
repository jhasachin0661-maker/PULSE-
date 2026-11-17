import React, { useState, useMemo } from 'react';
import { useTeam } from '../context/TeamContext';
import { useToast } from '../components/ui/Toast';
import { TeamMember, FilterAvailability, SortOption } from '../types/team';
import { MemberFilters } from '../components/members/MemberFilters';
import { MemberRow } from '../components/members/MemberRow';
import { MemberCard } from '../components/members/MemberCard';
import { MemberFormDialog } from '../components/members/MemberFormDialog';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Button } from '../components/ui/Button';
import { exportTeamToCSV } from '../utils/export';
import { Users, UserPlus, SearchX, RotateCcw } from 'lucide-react';

export interface TeamMembersPageProps {
  initialDepartmentFilter?: string;
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  onOpenAddModal: () => void;
}

export const TeamMembersPage: React.FC<TeamMembersPageProps> = ({
  initialDepartmentFilter = 'ALL',
  isAddModalOpen,
  onCloseAddModal,
  onOpenAddModal,
}) => {
  const {
    state,
    departments,
    toggleAvailability,
    addMember,
    updateMember,
    deleteMember,
    resetDemoData,
  } = useTeam();
  const { success, error } = useToast();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<FilterAvailability>('ALL');
  const [departmentFilter, setDepartmentFilter] = useState(initialDepartmentFilter);
  const [sortOption, setSortOption] = useState<SortOption>('NAME_ASC');

  // Edit State
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Delete Confirmation State
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  // Toggle handler with feedback toast
  const handleToggle = (id: string) => {
    const member = state.members.find((m) => m.id === id);
    if (!member) return;

    const nextStatus = !member.isAvailable;
    toggleAvailability(id);

    success(
      `${member.name} is now ${nextStatus ? 'Available' : 'Unavailable'}`,
      `Status updated and recorded in operations log.`
    );
  };

  // Add / Edit submit handler
  const handleFormSubmit = (data: {
    name: string;
    email: string;
    role: string;
    department: string;
    isAvailable: boolean;
  }) => {
    if (editingMember) {
      const ok = updateMember(editingMember.id, data);
      if (ok) {
        success('Member Updated', `${data.name}'s profile was updated successfully.`);
        setEditingMember(null);
      } else {
        error('Update Failed', 'Could not locate member record.');
      }
    } else {
      const newM = addMember(data);
      success('Collaborator Added', `${newM.name} has been enrolled into the roster.`);
      onCloseAddModal();
    }
  };

  // Delete submit handler
  const handleConfirmDelete = () => {
    if (!deletingMember) return;
    const name = deletingMember.name;
    const ok = deleteMember(deletingMember.id);
    if (ok) {
      success('Member Removed', `${name} has been removed from the roster.`);
    } else {
      error('Delete Failed', 'Could not delete member record.');
    }
    setDeletingMember(null);
  };

  // Filtered & Sorted Members calculation (Pure function, never mutates source state)
  const filteredAndSortedMembers = useMemo(() => {
    let result = [...state.members];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q) ||
          m.department.toLowerCase().includes(q)
      );
    }

    // Availability filter
    if (availabilityFilter === 'AVAILABLE') {
      result = result.filter((m) => m.isAvailable);
    } else if (availabilityFilter === 'UNAVAILABLE') {
      result = result.filter((m) => !m.isAvailable);
    }

    // Department filter
    if (departmentFilter !== 'ALL') {
      result = result.filter(
        (m) => m.department.trim().toLowerCase() === departmentFilter.trim().toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'NAME_ASC':
          return a.name.localeCompare(b.name);
        case 'NAME_DESC':
          return b.name.localeCompare(a.name);
        case 'RECENTLY_UPDATED':
          return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime();
        case 'DEPARTMENT':
          return (
            a.department.localeCompare(b.department) || a.name.localeCompare(b.name)
          );
        default:
          return 0;
      }
    });

    return result;
  }, [state.members, searchQuery, availabilityFilter, departmentFilter, sortOption]);

  const isFiltered =
    Boolean(searchQuery.trim()) ||
    availabilityFilter !== 'ALL' ||
    departmentFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setAvailabilityFilter('ALL');
    setDepartmentFilter('ALL');
    setSortOption('NAME_ASC');
  };

  const handleExportCSV = () => {
    exportTeamToCSV(filteredAndSortedMembers);
    success('Export Initiated', `Exported ${filteredAndSortedMembers.length} records to CSV.`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search, Filter, Sort, & Action Controls */}
      <MemberFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        availabilityFilter={availabilityFilter}
        onAvailabilityChange={setAvailabilityFilter}
        departmentFilter={departmentFilter}
        onDepartmentChange={setDepartmentFilter}
        departments={departments}
        sortOption={sortOption}
        onSortChange={setSortOption}
        onResetFilters={resetFilters}
        isFiltered={isFiltered}
        onExportCSV={handleExportCSV}
        totalFiltered={filteredAndSortedMembers.length}
        totalMembers={state.members.length}
      />

      {/* Roster View Area */}
      {state.members.length === 0 ? (
        /* Empty state when zero members exist */
        <div className="bg-graphite/40 border border-hairline rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-2xl bg-navy border border-hairline flex items-center justify-center text-slate-muted mb-4">
            <Users className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-lg font-bold font-heading text-coolwhite">Roster is empty</h3>
          <p className="text-sm text-slate-muted mt-1 max-w-md">
            No collaborators are registered in your local console. Add a member to begin tracking availability or restore sample demo data.
          </p>
          <div className="flex items-center gap-3 mt-6">
            <Button variant="secondary" onClick={resetDemoData}>
              <RotateCcw className="w-4 h-4 mr-1.5" />
              Load Sample Data
            </Button>
            <Button variant="primary" onClick={onOpenAddModal}>
              <UserPlus className="w-4 h-4 mr-1.5" />
              Add First Member
            </Button>
          </div>
        </div>
      ) : filteredAndSortedMembers.length === 0 ? (
        /* Empty state when filter matches 0 results */
        <div className="bg-graphite/40 border border-hairline rounded-xl p-10 text-center flex flex-col items-center justify-center">
          <SearchX className="w-12 h-12 text-amber/60 mb-3" />
          <h3 className="text-base font-bold font-heading text-coolwhite">No matching collaborators</h3>
          <p className="text-xs text-slate-muted mt-1 max-w-sm">
            No team members match your current query and filter conditions. Try adjusting your search term or clearing active filters.
          </p>
          <Button variant="secondary" size="sm" onClick={resetFilters} className="mt-4">
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Clear All Filters
          </Button>
        </div>
      ) : (
        <>
          {/* Desktop Table View (≥768px) */}
          <div className="hidden md:block bg-graphite/40 border border-hairline rounded-xl overflow-hidden shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-navy/70 border-b border-hairline text-[11px] font-mono uppercase tracking-wider text-slate-muted">
                    <th scope="col" className="py-3 px-4 font-semibold">Collaborator</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Role / Title</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Department</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Availability Status</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Last Updated</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-hairline/40">
                  {filteredAndSortedMembers.map((member) => (
                    <MemberRow
                      key={member.id}
                      member={member}
                      onToggle={handleToggle}
                      onEdit={setEditingMember}
                      onDelete={setDeletingMember}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards View (<768px) */}
          <div className="md:hidden flex flex-col gap-3">
            {filteredAndSortedMembers.map((member) => (
              <MemberCard
                key={member.id}
                member={member}
                onToggle={handleToggle}
                onEdit={setEditingMember}
                onDelete={setDeletingMember}
              />
            ))}
          </div>
        </>
      )}

      {/* Add / Edit Member Dialog */}
      <MemberFormDialog
        isOpen={isAddModalOpen || Boolean(editingMember)}
        onClose={() => {
          onCloseAddModal();
          setEditingMember(null);
        }}
        onSubmit={handleFormSubmit}
        initialMember={editingMember}
        existingMembers={state.members}
        suggestedDepartments={departments}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deletingMember)}
        onClose={() => setDeletingMember(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Team Member"
        message={`Are you sure you want to remove "${deletingMember?.name}" (${deletingMember?.role}) from the local roster? This action will record a deletion event in the operations log.`}
        confirmLabel="Remove Member"
        cancelLabel="Keep Member"
        variant="danger"
      />
    </div>
  );
};
