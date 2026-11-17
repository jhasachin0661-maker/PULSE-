import React, { createContext, useContext, useReducer, useEffect, useRef, useMemo } from 'react';
import { AppState, TeamMember, ActivityEvent, DerivedMetrics } from '../types/team';
import { loadAppState, saveAppState, getInitialSeedState } from '../services/storage';
import { calculateMetrics } from '../utils/statistics';

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | {
      type: 'TOGGLE_AVAILABILITY';
      payload: {
        id: string;
        nextValue: boolean;
        updatedAt: string;
        activity: ActivityEvent;
      };
    }
  | {
      type: 'ADD_MEMBER';
      payload: {
        member: TeamMember;
        activity: ActivityEvent;
      };
    }
  | {
      type: 'UPDATE_MEMBER';
      payload: {
        member: TeamMember;
        activity: ActivityEvent;
      };
    }
  | {
      type: 'DELETE_MEMBER';
      payload: {
        id: string;
        activity: ActivityEvent;
      };
    }
  | { type: 'CLEAR_ACTIVITY' }
  | { type: 'RESET_DEMO_DATA'; payload: AppState };

function teamReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE': {
      return action.payload;
    }

    case 'TOGGLE_AVAILABILITY': {
      const { id, nextValue, updatedAt, activity } = action.payload;
      const updatedMembers = state.members.map((m) =>
        m.id === id ? { ...m, isAvailable: nextValue, lastUpdated: updatedAt } : m
      );

      return {
        members: updatedMembers,
        activity: [activity, ...state.activity].slice(0, 100),
      };
    }

    case 'ADD_MEMBER': {
      const { member, activity } = action.payload;
      return {
        members: [member, ...state.members],
        activity: [activity, ...state.activity].slice(0, 100),
      };
    }

    case 'UPDATE_MEMBER': {
      const { member, activity } = action.payload;
      const updatedMembers = state.members.map((m) => (m.id === member.id ? member : m));
      return {
        members: updatedMembers,
        activity: [activity, ...state.activity].slice(0, 100),
      };
    }

    case 'DELETE_MEMBER': {
      const { id, activity } = action.payload;
      const updatedMembers = state.members.filter((m) => m.id !== id);
      return {
        members: updatedMembers,
        activity: [activity, ...state.activity].slice(0, 100),
      };
    }

    case 'CLEAR_ACTIVITY': {
      return {
        ...state,
        activity: [],
      };
    }

    case 'RESET_DEMO_DATA': {
      return action.payload;
    }

    default:
      return state;
  }
}

interface TeamContextType {
  state: AppState;
  metrics: DerivedMetrics;
  toggleAvailability: (id: string) => boolean;
  addMember: (data: {
    name: string;
    email: string;
    role: string;
    department: string;
    isAvailable: boolean;
  }) => TeamMember;
  updateMember: (
    id: string,
    data: {
      name: string;
      email: string;
      role: string;
      department: string;
      isAvailable: boolean;
    }
  ) => boolean;
  deleteMember: (id: string) => boolean;
  clearActivity: () => void;
  resetDemoData: () => void;
  departments: string[];
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
}

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read once at startup from storage service
  const [state, dispatch] = useReducer(teamReducer, null, () => {
    return loadAppState();
  });

  const isInitialMount = useRef(true);

  // Sync state changes to localStorage
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveAppState(state);
  }, [state]);

  const metrics = useMemo(() => calculateMetrics(state.members), [state.members]);

  const departments = useMemo(() => {
    const set = new Set<string>();
    state.members.forEach((m) => {
      const trimmed = m.department.trim();
      if (trimmed) set.add(trimmed);
    });
    return Array.from(set).sort();
  }, [state.members]);

  const toggleAvailability = (id: string): boolean => {
    const member = state.members.find((m) => m.id === id);
    if (!member) return false;

    const nextValue = !member.isAvailable;
    const nowIso = new Date().toISOString();

    const activity: ActivityEvent = {
      id: generateId('act'),
      memberId: member.id,
      memberName: member.name, // snapshot member name
      type: 'availability',
      message: `${member.name} changed status to ${nextValue ? 'Available' : 'Unavailable'}`,
      previousValue: member.isAvailable,
      newValue: nextValue,
      createdAt: nowIso,
    };

    dispatch({
      type: 'TOGGLE_AVAILABILITY',
      payload: {
        id,
        nextValue,
        updatedAt: nowIso,
        activity,
      },
    });

    return true;
  };

  const addMember = (data: {
    name: string;
    email: string;
    role: string;
    department: string;
    isAvailable: boolean;
  }): TeamMember => {
    const nowIso = new Date().toISOString();
    const newMember: TeamMember = {
      id: generateId('mbr'),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role.trim(),
      department: data.department.trim(),
      isAvailable: data.isAvailable,
      createdAt: nowIso,
      lastUpdated: nowIso,
    };

    const activity: ActivityEvent = {
      id: generateId('act'),
      memberId: newMember.id,
      memberName: newMember.name,
      type: 'member_added',
      message: `${newMember.name} added to ${newMember.department} (${newMember.isAvailable ? 'Available' : 'Unavailable'})`,
      newValue: newMember.isAvailable,
      createdAt: nowIso,
    };

    dispatch({
      type: 'ADD_MEMBER',
      payload: {
        member: newMember,
        activity,
      },
    });

    return newMember;
  };

  const updateMember = (
    id: string,
    data: {
      name: string;
      email: string;
      role: string;
      department: string;
      isAvailable: boolean;
    }
  ): boolean => {
    const existing = state.members.find((m) => m.id === id);
    if (!existing) return false;

    const nowIso = new Date().toISOString();
    const updatedMember: TeamMember = {
      ...existing,
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      role: data.role.trim(),
      department: data.department.trim(),
      isAvailable: data.isAvailable,
      lastUpdated: nowIso,
    };

    const availabilityChanged = existing.isAvailable !== data.isAvailable;
    const msg = availabilityChanged
      ? `${updatedMember.name} profile updated (status changed to ${data.isAvailable ? 'Available' : 'Unavailable'})`
      : `${updatedMember.name} profile details updated`;

    const activity: ActivityEvent = {
      id: generateId('act'),
      memberId: updatedMember.id,
      memberName: updatedMember.name,
      type: 'member_edited',
      message: msg,
      previousValue: existing.isAvailable,
      newValue: updatedMember.isAvailable,
      createdAt: nowIso,
    };

    dispatch({
      type: 'UPDATE_MEMBER',
      payload: {
        member: updatedMember,
        activity,
      },
    });

    return true;
  };

  const deleteMember = (id: string): boolean => {
    const existing = state.members.find((m) => m.id === id);
    if (!existing) return false;

    const nowIso = new Date().toISOString();
    const activity: ActivityEvent = {
      id: generateId('act'),
      memberId: existing.id,
      memberName: existing.name, // snapshot
      type: 'member_deleted',
      message: `${existing.name} removed from roster (${existing.department})`,
      createdAt: nowIso,
    };

    dispatch({
      type: 'DELETE_MEMBER',
      payload: {
        id,
        activity,
      },
    });

    return true;
  };

  const clearActivity = () => {
    dispatch({ type: 'CLEAR_ACTIVITY' });
  };

  const resetDemoData = () => {
    const seed = getInitialSeedState();
    dispatch({ type: 'RESET_DEMO_DATA', payload: seed });
  };

  return (
    <TeamContext.Provider
      value={{
        state,
        metrics,
        toggleAvailability,
        addMember,
        updateMember,
        deleteMember,
        clearActivity,
        resetDemoData,
        departments,
      }}
    >
      {children}
    </TeamContext.Provider>
  );
};

export function useTeam(): TeamContextType {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
}
