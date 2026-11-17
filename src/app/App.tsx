import React, { useState } from 'react';
import { TeamProvider, useTeam } from '../context/TeamContext';
import { ToastProvider, useToast } from '../components/ui/Toast';
import { PageShell } from '../components/layout/PageShell';
import { NavItemKey } from '../components/layout/Sidebar';
import { OverviewPage } from '../pages/OverviewPage';
import { TeamMembersPage } from '../pages/TeamMembersPage';
import { AnalyticsPage } from '../pages/AnalyticsPage';
import { ActivityLogPage } from '../pages/ActivityLogPage';
import { SettingsPage } from '../pages/SettingsPage';
import { MemberFormDialog } from '../components/members/MemberFormDialog';

const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavItemKey>('overview');
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<string>('ALL');

  const { state, departments, addMember } = useTeam();
  const { success } = useToast();

  const handleCreateMember = (data: {
    name: string;
    email: string;
    role: string;
    department: string;
    isAvailable: boolean;
  }) => {
    const newM = addMember(data);
    success('Collaborator Added', `${newM.name} has been enrolled into the roster.`);
    setIsAddMemberModalOpen(false);
  };

  const getPageMeta = () => {
    switch (currentTab) {
      case 'overview':
        return {
          title: 'Team Overview',
          subtitle: 'Workforce availability and real-time operations pulse',
        };
      case 'members':
        return {
          title: 'Team Members',
          subtitle: 'Manage collaborators, departments, and operational deployment states',
        };
      case 'analytics':
        return {
          title: 'Operational Analytics',
          subtitle: 'Derived capacity ratios, departmental distribution, and team health',
        };
      case 'activity':
        return {
          title: 'Activity Log',
          subtitle: 'Chronological audit trail of all availability and roster events',
        };
      case 'settings':
        return {
          title: 'Console Settings',
          subtitle: 'Local storage controls, demo data reset, and system configuration',
        };
      default:
        return {
          title: 'Operations Console',
          subtitle: 'Workforce visibility system',
        };
    }
  };

  const { title, subtitle } = getPageMeta();

  return (
    <PageShell
      currentTab={currentTab}
      onSelectTab={(tab) => {
        setCurrentTab(tab);
        if (tab !== 'members') {
          setSelectedDeptFilter('ALL');
        }
      }}
      onOpenAddMember={() => setIsAddMemberModalOpen(true)}
      title={title}
      subtitle={subtitle}
    >
      {currentTab === 'overview' && (
        <OverviewPage
          onNavigateToMembers={() => setCurrentTab('members')}
          onNavigateToActivity={() => setCurrentTab('activity')}
          onOpenAddMember={() => setIsAddMemberModalOpen(true)}
          onSelectDepartmentFilter={(dept) => {
            setSelectedDeptFilter(dept);
            setCurrentTab('members');
          }}
        />
      )}

      {currentTab === 'members' && (
        <TeamMembersPage
          initialDepartmentFilter={selectedDeptFilter}
          isAddModalOpen={isAddMemberModalOpen}
          onCloseAddModal={() => setIsAddMemberModalOpen(false)}
          onOpenAddModal={() => setIsAddMemberModalOpen(true)}
        />
      )}

      {currentTab === 'analytics' && <AnalyticsPage />}

      {currentTab === 'activity' && <ActivityLogPage />}

      {currentTab === 'settings' && <SettingsPage />}

      {/* Global Add Member Dialog triggered from Topbar when not already handled on members page */}
      {currentTab !== 'members' && (
        <MemberFormDialog
          isOpen={isAddMemberModalOpen}
          onClose={() => setIsAddMemberModalOpen(false)}
          onSubmit={handleCreateMember}
          existingMembers={state.members}
          suggestedDepartments={departments}
        />
      )}
    </PageShell>
  );
};

export const App: React.FC = () => {
  return (
    <TeamProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </TeamProvider>
  );
};

export default App;
