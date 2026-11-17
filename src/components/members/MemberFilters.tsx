import React from 'react';
import { FilterAvailability, SortOption } from '../../types/team';
import { Search, X, SlidersHorizontal, Download, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';

export interface MemberFiltersProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  availabilityFilter: FilterAvailability;
  onAvailabilityChange: (f: FilterAvailability) => void;
  departmentFilter: string;
  onDepartmentChange: (dept: string) => void;
  departments: string[];
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  onResetFilters: () => void;
  isFiltered: boolean;
  onExportCSV: () => void;
  totalFiltered: number;
  totalMembers: number;
}

export const MemberFilters: React.FC<MemberFiltersProps> = ({
  searchQuery,
  onSearchChange,
  availabilityFilter,
  onAvailabilityChange,
  departmentFilter,
  onDepartmentChange,
  departments,
  sortOption,
  onSortChange,
  onResetFilters,
  isFiltered,
  onExportCSV,
  totalFiltered,
  totalMembers,
}) => {
  return (
    <div className="bg-graphite/40 border border-hairline rounded-xl p-4 flex flex-col gap-3.5 shadow-sm">
      {/* Top row: Search input + Actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, role, or department..."
            className="w-full bg-ink border border-hairline rounded-lg pl-10 pr-9 py-2 text-sm text-coolwhite placeholder:text-slate-subtle focus:outline-none focus:ring-1 focus:ring-lime focus:border-lime transition-all"
            aria-label="Search roster"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-muted hover:text-coolwhite p-1 rounded transition-colors"
              aria-label="Clear search text"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Export and reset buttons */}
        <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-auto">
          {isFiltered && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="text-amber hover:text-amber/90"
              title="Reset all active filters"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset Filters
            </Button>
          )}
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportCSV}
            title="Export filtered roster as CSV"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Bottom row: Availability filter segmented control, Department dropdown, Sort dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-hairline/50">
        <div className="flex flex-wrap items-center gap-2">
          {/* Availability Segmented Buttons */}
          <div className="inline-flex p-0.5 rounded-lg bg-ink border border-hairline" role="group" aria-label="Filter by availability">
            <button
              onClick={() => onAvailabilityChange('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                availabilityFilter === 'ALL'
                  ? 'bg-graphite text-coolwhite shadow-sm'
                  : 'text-slate-muted hover:text-coolwhite'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onAvailabilityChange('AVAILABLE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                availabilityFilter === 'AVAILABLE'
                  ? 'bg-mint/20 text-mint border border-mint/40 shadow-sm'
                  : 'text-slate-muted hover:text-coolwhite'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-mint" />
              Available
            </button>
            <button
              onClick={() => onAvailabilityChange('UNAVAILABLE')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all flex items-center gap-1.5 ${
                availabilityFilter === 'UNAVAILABLE'
                  ? 'bg-amber/20 text-amber border border-amber/40 shadow-sm'
                  : 'text-slate-muted hover:text-coolwhite'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber" />
              Unavailable
            </button>
          </div>

          {/* Department filter */}
          <div className="relative">
            <select
              value={departmentFilter}
              onChange={(e) => onDepartmentChange(e.target.value)}
              className="bg-ink border border-hairline rounded-lg px-3 py-1.5 text-xs text-coolwhite hover:border-slate-subtle focus:outline-none focus:ring-1 focus:ring-lime cursor-pointer appearance-none pr-8 font-medium"
              aria-label="Filter by department"
            >
              <option value="ALL">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="w-3 h-3 text-slate-muted absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Sort and Count */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-slate-muted tabular-nums">
            Showing <strong className="text-coolwhite">{totalFiltered}</strong> of{' '}
            {totalMembers}
          </span>

          <div className="flex items-center gap-1.5">
            <label htmlFor="sortSelect" className="text-xs text-slate-muted font-medium">
              Sort:
            </label>
            <select
              id="sortSelect"
              value={sortOption}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-ink border border-hairline rounded-lg px-2.5 py-1.5 text-xs text-coolwhite hover:border-slate-subtle focus:outline-none focus:ring-1 focus:ring-lime cursor-pointer font-medium"
            >
              <option value="NAME_ASC">Name (A → Z)</option>
              <option value="NAME_DESC">Name (Z → A)</option>
              <option value="RECENTLY_UPDATED">Recently Updated</option>
              <option value="DEPARTMENT">Department</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};
