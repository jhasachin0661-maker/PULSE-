# PULSE — Team Availability & Workforce Dashboard

> **Midnight Operations Console** — A high-performance, frontend-only workforce visibility dashboard engineered with React 18, TypeScript, and Tailwind CSS. Demonstrates deterministic client-side state synchronization, boolean reactivity, CRUD lifecycle management, derived operational statistics, and persistent browser storage.

---

## 1. System Overview

PULSE solves the operational challenge of scattered team availability by centralizing workforce deployment statuses into a real-time, local operations console. It enables team coordinators and project leads to monitor workforce readiness, toggle availability with instant UI reactivity, filter and sort collaborators, and audit operational history without requiring any backend, server, or cloud infrastructure.

### Architectural Core Principles
- **100% Frontend-Only**: Zero reliance on external servers, APIs, cloud databases, or authentication providers.
- **Single-Browser Persistence**: Complete application state (roster + bounded audit events) persists reliably in `localStorage` under key `pulse_app_state_v1`.
- **Pure Derived Metrics**: Total members, available counts, unavailable counts, and department deployment percentages are computed purely via memoized selectors—eliminating stale state.
- **Defensive Error Handling**: Automatic recovery from malformed or missing storage, zero-member division-by-zero protection, and RFC 5322 email validation with case-insensitive collision detection.

---

## 2. Visual Design Direction: "Midnight Operations Console"

Unlike standard generic light or pastel admin templates, PULSE features a purpose-built **Midnight Operations Console** aesthetic designed for data clarity and operational focus:

| Design Token | Hex Code | Purpose |
| :--- | :--- | :--- |
| **Ink / Canvas** | `#101820` | Primary application canvas and body background |
| **Deep Navy** | `#172631` | Sidebar, modals, and major operational panels |
| **Graphite** | `#203541` | Cards, table surfaces, and metric backdrops |
| **Signal Lime** | `#C6F36B` | Primary CTAs, active navigation items, key metrics |
| **Mint** | `#63D6B1` | **Available** status badge, switch active thumb, ready metrics |
| **Warm Amber** | `#F2B45B` | **Unavailable** status badge, switch inactive thumb, warnings |
| **Cool White** | `#F2F5F2` | Primary high-contrast typography |
| **Muted Slate** | `#91A2A8` | Secondary labels, subtexts, and timestamps |
| **Hairline** | `#344852` | Precise micro-dividers and container borders |

*Accessibility Guarantee: Status is never communicated by color alone; every indicator pairs color tokens with clear semantic text labels, ARIA roles, and accessible names.*

---

## 3. Key Feature Specifications

### 1. Overview Dashboard
- **Asymmetric KPI Composition**: Displays total roster count, available count, unavailable count, and availability rate percentage.
- **Team Pulse Monitor**: Prominent live readiness percentage indicator with segmented capacity bar and operational health diagnostic.
- **Department Availability Breakdown**: Real-time stacked bars showing deployment ratios per organizational unit with one-click drill-down filtering.
- **Live Activity Preview**: Displays the 5 most recent timestamped operational events with direct navigation to the full audit trail.
- **Quick Action Triggers**: Instant modal trigger to enroll collaborators and view complete team roster.

### 2. Team Members Roster Management
- **Interactive Controlled Availability Switch**: Custom toggle switch bound to each member's ID with immediate state transition and toast confirmation.
- **Multi-Vector Search**: Real-time case-insensitive search across collaborator name, corporate email, role title, and department.
- **Compound Filters**: Combine search query, availability status (`All`, `Available`, `Unavailable`), and dynamic department dropdown.
- **Immutable Sorting**: Sort by `Name (A → Z)`, `Name (Z → A)`, `Recently Updated`, or `Department` without mutating source state.
- **Responsive Dual-Mode View**: Crisp data-dense table on desktop (`≥768px`) that automatically transforms into compact, touch-friendly cards on mobile (`<768px`).
- **Full CRUD Lifecycle**: Add collaborators with inline validation, edit existing records, and delete with safety confirmation dialogs.
- **CSV Data Export**: Instant client-side download of the active filtered roster in standard CSV format.

### 3. Operational Analytics
- **Live Computed Ratios**: Headcount status, availability percentages, and organizational span.
- **Departmental Readiness Matrix**: Comprehensive unit breakdown with available/unavailable distributions.
- **Role Distribution Table**: Quantitative inventory of unique roles across the organization and their immediate deployment readiness.

### 4. Activity Audit Trail
- **Chronological Event Log**: Newest events rendered first with relative time formatting (`just now`, `5m ago`, `2h ago`) and exact ISO tooltip.
- **Snapshot Immutability**: Stores collaborator names at time of event creation so subsequent deletions do not corrupt audit readability.
- **Event Filtering**: Filter log by event type: `All`, `Availability Toggles`, `Additions`, `Edits`, `Deletions`.
- **Bounded Storage**: Automatically bounds history to the latest 100 events to maintain optimal browser performance.

### 5. Console Settings & Diagnostics
- **Storage Diagnostics**: Inspect active `localStorage` key, allocated memory footprint (in KB), and active record counts.
- **Restore Demo Roster**: Re-populates the original 8 sample collaborators across Engineering, Design, Product, and Operations.
- **Clear Activity History Only**: Purges audit trail logs while preserving team members and availability states intact.
- **Local Storage Boundary Disclosure**: Prominent notification clarifying that data resides exclusively in the user's browser.

---

## 4. Architecture & State Flow

```
[ User Interaction / Toggle / Form ]
                │
                ▼
      [ TeamContext Action ]
  (toggleAvailability / addMember / updateMember / deleteMember)
                │
                ▼
      [ teamReducer (Pure) ]
  • Immutable state update
  • Prepend timestamped ActivityEvent (bounded to 100)
                │
        ┌───────┴───────┐
        ▼               ▼
[ Derived Selectors ]  [ saveAppState() ]
• calculateMetrics()   • Persists to localStorage ('pulse_app_state_v1')
• Dynamic departments
        │
        ▼
[ React Component Re-render ]
• Instant badge transition
• Progress bar updates
• KPI card updates
• Toast notification trigger
```

---

## 5. Getting Started & Commands

### Prerequisites
- Node.js (v18.0.0 or higher recommended)
- npm (v9.0.0 or higher)

### Installation
```bash
npm install
```

### Development Server
Start the local Vite development server:
```bash
npm run dev
```

### Production Build
Compile TypeScript and bundle optimized assets into `/dist`:
```bash
npm run build
```

### Verification Test Suite
Execute the automated test suite testing validation, division-by-zero protection, metrics calculation, and storage recovery:
```bash
npm test
```

---

## 6. Local Storage Schema & Limitations

- **Storage Key**: `pulse_app_state_v1`
- **Data Model**:
  ```typescript
  type AppState = {
    version: 1;
    members: TeamMember[];
    activity: ActivityEvent[];
  };
  ```
- **Limitations**:
  - Scoped to the current browser profile and origin.
  - Changes made in one browser profile do not synchronize across devices or other browsers.
  - Clearing browser site data or clearing cache will erase customized records (unless restored via Demo Reset).
