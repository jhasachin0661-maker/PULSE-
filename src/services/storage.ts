import { AppState, TeamMember, ActivityEvent } from '../types/team';
import { SEED_MEMBERS, SEED_ACTIVITY } from '../data/seedMembers';

export const STORAGE_KEY = 'pulse_app_state_v1';

export function getInitialSeedState(): AppState {
  return {
    members: JSON.parse(JSON.stringify(SEED_MEMBERS)),
    activity: JSON.parse(JSON.stringify(SEED_ACTIVITY)),
  };
}

export function isValidMember(m: any): m is TeamMember {
  return (
    m &&
    typeof m.id === 'string' &&
    typeof m.name === 'string' &&
    typeof m.email === 'string' &&
    typeof m.role === 'string' &&
    typeof m.department === 'string' &&
    typeof m.isAvailable === 'boolean' &&
    typeof m.createdAt === 'string' &&
    typeof m.lastUpdated === 'string'
  );
}

export function isValidActivity(a: any): a is ActivityEvent {
  return (
    a &&
    typeof a.id === 'string' &&
    typeof a.memberId === 'string' &&
    typeof a.memberName === 'string' &&
    typeof a.type === 'string' &&
    typeof a.message === 'string' &&
    typeof a.createdAt === 'string'
  );
}

export function loadAppState(): AppState {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      console.warn('[PULSE Storage] localStorage unavailable, falling back to seed data.');
      return getInitialSeedState();
    }

    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return getInitialSeedState();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      console.warn('[PULSE Storage] Corrupted state structure, recovering with seed data.');
      return getInitialSeedState();
    }

    // Validate members array
    let members: TeamMember[] = [];
    if (Array.isArray(parsed.members)) {
      members = parsed.members.filter(isValidMember);
    } else {
      members = getInitialSeedState().members;
    }

    // Validate activity array
    let activity: ActivityEvent[] = [];
    if (Array.isArray(parsed.activity)) {
      activity = parsed.activity.filter(isValidActivity);
    } else {
      activity = getInitialSeedState().activity;
    }

    return {
      members,
      activity: activity.slice(0, 100), // Bound history
    };
  } catch (error) {
    console.error('[PULSE Storage] Failed to parse stored state, falling back to seed data:', error);
    return getInitialSeedState();
  }
}

export function saveAppState(state: AppState): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const payload = JSON.stringify({
      version: 1,
      members: state.members,
      activity: state.activity.slice(0, 100), // Enforce 100 max history bound
    });
    window.localStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (error) {
    console.error('[PULSE Storage] Failed to persist state to localStorage:', error);
    return false;
  }
}

export function clearAppState(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (error) {
    console.error('[PULSE Storage] Failed to clear storage:', error);
  }
}
