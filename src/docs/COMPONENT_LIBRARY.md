# Component Library & Flow Diagram

## Component Overview

This document provides a comprehensive overview of all custom components in the Campus Issue Reporter system, their purpose, props, and usage.

---

## Reusable Components

### 1. StatusBadge
**Location:** `/components/StatusBadge.tsx`

**Purpose:** Display issue status with appropriate styling

**Props:**
```typescript
interface StatusBadgeProps {
  status: 'open' | 'assigned' | 'in-progress' | 'resolved';
}
```

**Usage:**
```jsx
<StatusBadge status="in-progress" />
```

**Styling:**
- Open: Blue background
- Assigned: Indigo background
- In Progress: Yellow background
- Resolved: Green background

---

### 2. SentimentIndicator
**Location:** `/components/SentimentIndicator.tsx`

**Purpose:** Show urgency level based on sentiment analysis

**Props:**
```typescript
interface SentimentIndicatorProps {
  level: 'low' | 'medium' | 'high';
  showLabel?: boolean; // default: true
}
```

**Usage:**
```jsx
<SentimentIndicator level="high" />
<SentimentIndicator level="medium" showLabel={false} />
```

**Visual:**
- Low: Green with Info icon
- Medium: Yellow with Warning icon
- High: Red with Alert icon

---

### 3. PriorityBadge
**Location:** `/components/PriorityBadge.tsx`

**Purpose:** Display issue priority

**Props:**
```typescript
interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high';
}
```

**Usage:**
```jsx
<PriorityBadge priority="high" />
```

---

### 4. EmptyState
**Location:** `/components/EmptyState.tsx`

**Purpose:** Display meaningful empty states

**Props:**
```typescript
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

**Usage:**
```jsx
<EmptyState
  icon={CheckCircle}
  title="No Active Issues"
  description="You don't have any active issues."
  actionLabel="Report Issue"
  onAction={() => handleReportIssue()}
/>
```

---

### 5. StatCard
**Location:** `/components/StatCard.tsx`

**Purpose:** Display statistics with icon and optional trend

**Props:**
```typescript
interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  className?: string;
}
```

**Usage:**
```jsx
<StatCard
  title="Total Issues"
  value={331}
  icon={AlertCircle}
  trend={{ value: '+8% this month', isPositive: true }}
/>
```

---

## Student-Side Components

### 6. StudentLogin
**Location:** `/components/StudentLogin.tsx`

**Purpose:** Student authentication screen

**Props:**
```typescript
interface StudentLoginProps {
  onLogin: (data: { email?: string; phone?: string; studentId: string }) => void;
}
```

**Features:**
- Email or phone login
- Student ID validation
- Tab-based login method selection

---

### 7. StudentDashboard
**Location:** `/components/StudentDashboard.tsx`

**Purpose:** Main dashboard for students

**Props:**
```typescript
interface StudentDashboardProps {
  studentName: string;
  onReportIssue: () => void;
  onViewIssue: (id: string) => void;
  onViewGamification: () => void;
}
```

**Features:**
- Quick stats (points, rank, badges)
- Report issue CTA
- Current issues list
- Past issues history

---

### 8. ReportIssueForm
**Location:** `/components/ReportIssueForm.tsx`

**Purpose:** Form for reporting new issues

**Props:**
```typescript
interface ReportIssueFormProps {
  onSubmit: (data: IssueFormData) => void;
  onCancel: () => void;
}
```

**Features:**
- QR code scanning
- Location auto-fill
- Category selection
- Description with sentiment analysis
- Image upload

---

### 9. IssueDetails
**Location:** `/components/IssueDetails.tsx`

**Purpose:** Detailed view of an issue (student perspective)

**Props:**
```typescript
interface IssueDetailsProps {
  onBack: () => void;
}
```

**Features:**
- Issue information
- Timeline of events
- Assigned staff details
- Status tracking
- Points earned display

---

### 10. GamificationPage
**Location:** `/components/GamificationPage.tsx`

**Purpose:** Gamification and achievements page

**Props:**
```typescript
interface GamificationPageProps {
  onBack: () => void;
}
```

**Features:**
- Points and level display
- Badge collection
- Progress tracking
- Leaderboard

---

## Staff-Side Components

### 11. StaffLogin
**Location:** `/components/StaffLogin.tsx`

**Purpose:** Staff/admin authentication screen

**Props:**
```typescript
interface StaffLoginProps {
  onLogin: (data: { email: string; password: string; role: string }) => void;
}
```

**Features:**
- Email/password authentication
- Role selection (staff, admin, super-admin)

---

### 12. StaffDashboard
**Location:** `/components/StaffDashboard.tsx`

**Purpose:** Main dashboard for staff members

**Props:**
```typescript
interface StaffDashboardProps {
  staffName: string;
  onViewIssue: (id: string) => void;
  onViewAllIssues: () => void;
  onViewAnalytics: () => void;
}
```

**Features:**
- Statistics overview
- High priority issues
- Pending issues list
- Prediction alerts widget
- Workload indicator

---

### 13. IssueTable
**Location:** `/components/IssueTable.tsx`

**Purpose:** Comprehensive issue table with filtering

**Props:**
```typescript
interface IssueTableProps {
  onBack: () => void;
  onViewIssue: (id: string) => void;
}
```

**Features:**
- Advanced filtering (status, priority, category)
- Search functionality
- Sorting by multiple fields
- Pagination
- Export capability

---

### 14. StaffIssueDetails
**Location:** `/components/StaffIssueDetails.tsx`

**Purpose:** Issue management interface for staff

**Props:**
```typescript
interface StaffIssueDetailsProps {
  onBack: () => void;
}
```

**Features:**
- Update status
- Add remarks
- Upload proof images
- View history
- Quick actions

---

### 15. AnalyticsDashboard
**Location:** `/components/AnalyticsDashboard.tsx`

**Purpose:** Analytics and insights dashboard

**Props:**
```typescript
interface AnalyticsDashboardProps {
  onBack: () => void;
}
```

**Features:**
- Issue trends chart (Line chart)
- Category distribution (Bar chart)
- Priority distribution (Pie chart)
- Heatmap of frequent locations
- Staff workload table

---

### 16. DepartmentAdmin
**Location:** `/components/DepartmentAdmin.tsx`

**Purpose:** Department management interface

**Props:**
```typescript
interface DepartmentAdminProps {
  onBack: () => void;
}
```

**Features:**
- Staff list with performance metrics
- Department statistics
- Top performers
- Workload distribution
- Add/manage staff

---

## Application Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                       Welcome Screen                         │
│                                                              │
│  ┌──────────────────┐              ┌──────────────────┐    │
│  │  Student Portal  │              │   Staff Portal    │    │
│  └────────┬─────────┘              └─────────┬────────┘    │
└───────────┼────────────────────────────────────┼────────────┘
            │                                    │
            │                                    │
┌───────────▼────────────┐          ┌───────────▼────────────���
│   Student Login        │          │    Staff Login         │
│                        │          │                        │
│  • Email/Phone         │          │  • Email/Password      │
│  • Student ID          │          │  • Role Selection      │
└───────────┬────────────┘          └───────────┬────────────┘
            │                                    │
            │                                    │
┌───────────▼────────────┐          ┌───────────▼────────────┐
│  Student Dashboard     │          │   Staff Dashboard      │
│                        │          │                        │
│  • Quick Stats         │          │  • Statistics          │
│  • Report Issue CTA    │          │  • Pending Issues      │
│  • Current Issues      │          │  • Priority Alerts     │
│  • Past Issues         │          │  • Predictions         │
│  • Gamification Stats  │          │  • Workload            │
└──┬───┬────────┬────────┘          └──┬────┬──────┬────┬───┘
   │   │        │                      │    │      │    │
   │   │        │                      │    │      │    │
   │   │        │                      │    │      │    │
   │   │        │                      │    │      │    │
┌──▼───▼────┐  │                   ┌──▼────▼──┐   │    │
│ Report    │  │                   │ Issue    │   │    │
│ Issue     │  │                   │ Table    │   │    │
│ Form      │  │                   │          │   │    │
│           │  │                   │ • Filter │   │    │
│ • QR Scan │  │                   │ • Sort   │   │    │
│ • Location│  │                   │ • Search │   │    │
│ • Category│  │                   └──────┬───┘   │    │
│ • Desc    │  │                          │       │    │
│ • Image   │  │                          │       │    │
└───────────┘  │                   ┌──────▼───────▼────▼───┐
               │                   │  Staff Issue Details  │
               │                   │                       │
        ┌──────▼─────────┐         │  • Update Status     │
        │ Issue Details  │         │  • Add Remarks       │
        │                │         │  • Upload Proof      │
        │ • Timeline     │         │  • Reassign          │
        │ • Status       │         └──────────────────────┘
        │ • Assigned     │
        │ • Points       │                    │
        └────────────────┘                    │
               │                              │
        ┌──────▼─────────┐         ┌─────────▼────────────┐
        │ Gamification   │         │  Analytics Dashboard │
        │                │         │                      │
        │ • Points       │         │  • Trends Chart      │
        │ • Level        │         │  • Category Chart    │
        │ • Badges       │         │  • Heatmap           │
        │ • Leaderboard  │         │  • Staff Workload    │
        └────────────────┘         └──────────────────────┘
                                              │
                                   ┌──────────▼────────────┐
                                   │  Department Admin     │
                                   │                       │
                                   │  • Staff List         │
                                   │  • Performance        │
                                   │  • Dept Stats         │
                                   │  • Top Performers     │
                                   └───────────────────────┘
```

---

## Component Relationships

### Student Flow
```
StudentLogin → StudentDashboard → [ReportIssueForm, IssueDetails, GamificationPage]
                                 ↑
                                 └─ Back navigation
```

### Staff Flow
```
StaffLogin → StaffDashboard → [IssueTable, StaffIssueDetails, AnalyticsDashboard, DepartmentAdmin]
                             ↑
                             └─ Back navigation
```

---

## Shared Components Usage

| Component | Used By |
|-----------|---------|
| StatusBadge | StudentDashboard, IssueDetails, StaffDashboard, IssueTable, StaffIssueDetails |
| PriorityBadge | StaffDashboard, IssueTable, StaffIssueDetails |
| SentimentIndicator | ReportIssueForm, IssueDetails, StaffIssueDetails |
| EmptyState | StudentDashboard, IssueTable |
| StatCard | StaffDashboard, AnalyticsDashboard, DepartmentAdmin |

---

## State Management

### Current Implementation
- **Local State:** Each component manages its own state
- **Props:** Data flows down via props
- **Callbacks:** Events bubble up via callback functions

### Future Recommendations
For production, consider:
- **Context API** for global user state
- **React Query** for server state management
- **Zustand/Redux** for complex client state

---

## Data Flow

```
User Action
    ↓
Component Event Handler
    ↓
Callback Function (passed via props)
    ↓
Parent Component
    ↓
API Call (future)
    ↓
Update State
    ↓
Re-render Components
```

---

## Styling Approach

All components follow the design system:
- **Tailwind CSS** for styling
- **shadcn/ui** components for base UI
- **Custom components** for business logic
- **CSS Variables** for theming (in `/styles/globals.css`)

---

## Accessibility Features

All components include:
- ✅ Semantic HTML
- ✅ ARIA labels where needed
- ✅ Keyboard navigation support
- ✅ Focus states
- ✅ Color contrast compliance
- ✅ Screen reader friendly

---

## Responsive Design

All components are mobile-responsive:
- **Mobile:** Single column layouts, stacked cards
- **Tablet:** 2-column grids where appropriate
- **Desktop:** Full grid layouts, side-by-side content

Breakpoints:
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px

---

## Performance Considerations

- **Lazy Loading:** Consider code-splitting for route-based components
- **Memoization:** Use React.memo for expensive renders
- **Virtual Lists:** For large data tables (future enhancement)
- **Image Optimization:** Use next/image or similar for production

---

## Testing Recommendations

### Unit Tests
- Test individual components in isolation
- Mock props and callbacks
- Test different states and edge cases

### Integration Tests
- Test component interactions
- Test form submissions
- Test navigation flows

### E2E Tests
- Test complete user journeys
- Test student issue reporting flow
- Test staff issue management flow

---

## Future Enhancements

1. **Real-time Updates:** WebSocket integration for live updates
2. **Notifications:** Toast notifications for actions
3. **Dark Mode:** Theme switching capability
4. **Offline Support:** PWA with service workers
5. **Advanced Filtering:** Saved filter presets
6. **Export Features:** PDF/Excel export for reports
7. **File Management:** Drag-and-drop for images
8. **Collaborative Features:** Comments and mentions

---

## Documentation Links

- **Database Schema:** `/docs/DATABASE_SCHEMA.md`
- **API Contract:** `/docs/API_CONTRACT.md`
- **Design Guide:** `/docs/DESIGN_GUIDE.md`
- **Component Library:** This document

---

## Component Checklist

When creating a new component:
- [ ] Follow naming convention (PascalCase)
- [ ] Define TypeScript interfaces for props
- [ ] Include JSDoc comments for complex logic
- [ ] Apply design system colors and spacing
- [ ] Ensure responsive design
- [ ] Add accessibility features
- [ ] Handle loading and error states
- [ ] Add hover/focus states for interactive elements
- [ ] Test on mobile and desktop
- [ ] Document in this file
