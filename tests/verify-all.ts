import { calculateMetrics } from '../src/utils/statistics';
import { validateMemberForm, validateEmail } from '../src/utils/validation';
import { TeamMember, ActivityEvent } from '../src/types/team';
import { SEED_MEMBERS } from '../src/data/seedMembers';
import { loadAppState, saveAppState, STORAGE_KEY } from '../src/services/storage';

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${testName}: ${detail || 'Assertion failed'}`);
    failCount++;
  }
}

console.log('=== RUNNING PULSE TEST SUITE ===\n');

// 1. Zero-member metrics test (division by zero handling)
const zeroMetrics = calculateMetrics([]);
assert(zeroMetrics.total === 0, 'Zero members total is 0');
assert(zeroMetrics.available === 0, 'Zero members available is 0');
assert(zeroMetrics.unavailable === 0, 'Zero members unavailable is 0');
assert(zeroMetrics.availabilityRate === 0, 'Zero members availabilityRate is 0% (no NaN)');
assert(!Number.isNaN(zeroMetrics.availabilityRate), 'No NaN on zero members rate');

// 2. All available / All unavailable metrics
const mockAvailableMember: TeamMember = {
  id: 'm1',
  name: 'Test One',
  email: 'one@test.com',
  role: 'Dev',
  department: 'Eng',
  isAvailable: true,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

const mockUnavailableMember: TeamMember = {
  id: 'm2',
  name: 'Test Two',
  email: 'two@test.com',
  role: 'Dev',
  department: 'Eng',
  isAvailable: false,
  createdAt: new Date().toISOString(),
  lastUpdated: new Date().toISOString(),
};

const allAvailableMetrics = calculateMetrics([mockAvailableMember, { ...mockAvailableMember, id: 'm3' }]);
assert(allAvailableMetrics.availabilityRate === 100, '100% available rate calculation');

const allUnavailableMetrics = calculateMetrics([mockUnavailableMember, { ...mockUnavailableMember, id: 'm4' }]);
assert(allUnavailableMetrics.availabilityRate === 0, '0% available rate calculation');

// 3. Department breakdown calculation
const mixedMetrics = calculateMetrics([mockAvailableMember, mockUnavailableMember]);
assert(mixedMetrics.availabilityRate === 50, '50% availability rate on 1 available + 1 unavailable');
assert(mixedMetrics.departmentStats.length === 1, 'Department grouping works');
assert(mixedMetrics.departmentStats[0].department === 'Eng', 'Department name is correct');
assert(mixedMetrics.departmentStats[0].available === 1, 'Dept available count is 1');
assert(mixedMetrics.departmentStats[0].unavailable === 1, 'Dept unavailable count is 1');
assert(mixedMetrics.departmentStats[0].rate === 50, 'Dept rate is 50%');

// 4. Form validation tests
const validRes = validateMemberForm(
  {
    name: 'Jane Doe',
    email: 'jane@pulse.internal',
    role: 'Engineer',
    department: 'Engineering',
  },
  SEED_MEMBERS
);
assert(validRes.isValid === true, 'Valid member form passes');
assert(Object.keys(validRes.errors).length === 0, 'No errors on valid form');

// 5. Empty name validation
const emptyNameRes = validateMemberForm(
  {
    name: '   ',
    email: 'valid@pulse.internal',
    role: 'Engineer',
    department: 'Engineering',
  },
  SEED_MEMBERS
);
assert(emptyNameRes.isValid === false, 'Empty name fails validation');
assert(Boolean(emptyNameRes.errors.name), 'Name error message present');

// 6. Invalid email validation
const invalidEmailRes = validateMemberForm(
  {
    name: 'Jane Doe',
    email: 'notanemail',
    role: 'Engineer',
    department: 'Engineering',
  },
  SEED_MEMBERS
);
assert(invalidEmailRes.isValid === false, 'Invalid email fails validation');
assert(Boolean(invalidEmailRes.errors.email), 'Email error message present');

// 7. Case-insensitive duplicate email validation
const duplicateEmailRes = validateMemberForm(
  {
    name: 'Duplicate Test',
    email: 'AARAV.sharma@pulse.internal', // exists in SEED_MEMBERS
    role: 'Engineer',
    department: 'Engineering',
  },
  SEED_MEMBERS
);
assert(duplicateEmailRes.isValid === false, 'Duplicate email fails validation');
assert(duplicateEmailRes.errors.email?.includes('already exists'), 'Duplicate email error message verified');

// 8. Self-email allowed during edit
const selfEditRes = validateMemberForm(
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@pulse.internal',
    role: 'Staff Architect',
    department: 'Engineering',
  },
  SEED_MEMBERS,
  'pulse_mbr_01' // current record ID
);
assert(selfEditRes.isValid === true, 'Editing own profile with same email is valid');

// 9. Storage mock & corruption recovery
const memoryStorage: Record<string, string> = {};
(global as any).window = {
  localStorage: {
    getItem: (key: string) => memoryStorage[key] || null,
    setItem: (key: string, val: string) => { memoryStorage[key] = val; },
    removeItem: (key: string) => { delete memoryStorage[key]; },
  },
};

// Test empty storage startup
const emptyStartupState = loadAppState();
assert(emptyStartupState.members.length === SEED_MEMBERS.length, 'Empty storage loads seed members');
assert(emptyStartupState.activity.length > 0, 'Empty storage loads seed activity');

// Test saving state and reloading
const stateToSave = {
  members: [mockAvailableMember],
  activity: [],
};
const savedOk = saveAppState(stateToSave);
assert(savedOk === true, 'State successfully written to storage');
const loadedSaved = loadAppState();
assert(loadedSaved.members.length === 1, 'Saved member successfully restored');
assert(loadedSaved.members[0].id === 'm1', 'Restored member has correct id');

// Test corrupted JSON recovery
(global as any).window.localStorage.setItem(STORAGE_KEY, '{corrupted-json-garbage!!!');
const recoveredState = loadAppState();
assert(recoveredState.members.length === SEED_MEMBERS.length, 'Corrupted JSON gracefully falls back to seed data without crashing');

// Test bound activity history (max 100)
const manyEvents: ActivityEvent[] = Array.from({ length: 150 }).map((_, i) => ({
  id: `act_${i}`,
  memberId: 'm1',
  memberName: 'Test',
  type: 'availability',
  message: `Event ${i}`,
  createdAt: new Date().toISOString(),
}));
saveAppState({ members: [mockAvailableMember], activity: manyEvents });
const boundedLoaded = loadAppState();
assert(boundedLoaded.activity.length <= 100, 'Activity history strictly bounded to at most 100 events');

console.log(`\n=== SUMMARY: ${passCount} PASSED, ${failCount} FAILED ===`);
if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL VERIFICATIONS PASSED SUCCESSFULLY!');
}
