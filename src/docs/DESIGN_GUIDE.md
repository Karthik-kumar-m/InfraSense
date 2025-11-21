# Design System & Style Guide

## Overview
This design system follows a clean, minimalistic, modern UI approach inspired by Apple Design and Material You principles, with a focus on usability, accessibility, and visual hierarchy.

---

## Color Palette

### Pastel Colors
```css
/* Primary Pastels */
--pastel-blue: #bfdbfe      /* Soft blue for information */
--pastel-purple: #ddd6fe    /* Soft purple for highlights */
--pastel-pink: #fbcfe8      /* Soft pink for accents */
--pastel-green: #bbf7d0     /* Soft green for success */
--pastel-yellow: #fef08a    /* Soft yellow for warnings */
--pastel-orange: #fed7aa    /* Soft orange for medium priority */
--pastel-red: #fecaca       /* Soft red for errors */
```

### Functional Colors
```css
/* Sentiment Indicators */
--sentiment-low: #86efac     /* Green - Low urgency */
--sentiment-medium: #fde047  /* Yellow - Medium urgency */
--sentiment-high: #fca5a5    /* Red - High urgency */

/* Priority Badges */
--priority-low: #d1fae5      /* Light green */
--priority-medium: #fed7aa   /* Light orange */
--priority-high: #fecaca     /* Light red */

/* Status Colors */
--status-open: #dbeafe       /* Light blue */
--status-assigned: #e0e7ff   /* Light indigo */
--status-in-progress: #fef3c7 /* Light yellow */
--status-resolved: #d1fae5   /* Light green */
```

### Core Colors
```css
/* Base */
--background: #fafafa        /* Soft gray background */
--card: #ffffff              /* White cards */
--primary: #6366f1           /* Indigo primary color */
--destructive: #ef4444       /* Red for destructive actions */

/* Text */
--foreground: oklch(0.145 0 0) /* Dark text */
--muted-foreground: #717182    /* Muted text */
```

---

## Typography

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;
```

### Type Scale
```
h1: 2xl (default via globals.css)
h2: xl (default via globals.css)
h3: lg (default via globals.css)
h4: base (default via globals.css)
p: base (default via globals.css)
label: base (default via globals.css)
button: base (default via globals.css)
```

**Note:** Font sizes, weights, and line-heights are handled by `/styles/globals.css` and should not be overridden with Tailwind classes unless specifically requested.

### Font Weights
```
Normal: 400
Medium: 500 (headings, buttons, labels)
```

---

## Spacing System

### Consistent Spacing Scale
```
4px  (1)   - Tight spacing
8px  (2)   - Small gaps
12px (3)   - Medium-small gaps
16px (4)   - Base spacing
24px (6)   - Large gaps
32px (8)   - Section spacing
48px (12)  - Major section spacing
```

### Application
- **Card padding:** 24px (p-6)
- **Content sections:** 32px gap (gap-8)
- **Component spacing:** 16px gap (gap-4)
- **Inline elements:** 8px gap (gap-2)

---

## Border Radius

### Radius Scale
```css
--radius: 0.75rem (12px)     /* Base radius */
--radius-sm: 8px             /* Small elements */
--radius-md: 10px            /* Medium elements */
--radius-lg: 12px            /* Large cards */
--radius-xl: 16px            /* Extra large containers */
```

### Application
- **Cards:** rounded-lg (12px)
- **Buttons:** rounded-lg (12px)
- **Inputs:** rounded-lg (12px)
- **Badges:** rounded-full
- **Avatar:** rounded-full or rounded-xl

---

## Shadows

### Shadow Scale
```css
/* Soft Shadows */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 
            0 1px 2px -1px rgb(0 0 0 / 0.1);  /* sm */

box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 
            0 2px 4px -2px rgb(0 0 0 / 0.1);  /* md */

box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 
            0 4px 6px -4px rgb(0 0 0 / 0.1);  /* lg */
```

### Application
- **Cards:** shadow (default soft shadow)
- **Cards (hover):** shadow-md
- **Modals:** shadow-xl
- **Sticky headers:** shadow-sm

---

## Components

### Cards
**Design Principles:**
- White background (`bg-card`)
- Rounded corners (`rounded-lg`)
- Soft shadow
- Padding: 24px (`p-6`)
- Border: subtle, rarely used

**Example:**
```jsx
<Card className="p-6">
  {/* Content */}
</Card>
```

---

### Buttons

**Primary Button:**
- Background: `--primary` (#6366f1)
- Text: White
- Hover: Slightly darker
- Rounded: `rounded-lg`

**Secondary/Outline Button:**
- Border: 1px solid border color
- Background: Transparent
- Text: Foreground color

**Sizes:**
- Default: Medium height with base text
- Small: `size="sm"`

---

### Badges & Indicators

**Status Badges:**
- Outline variant with colored background
- Border matching the background color family
- Rounded full or rounded-lg
- Small, compact text

**Sentiment Indicator:**
- Rounded full pill shape
- Icon + text (optional)
- Color-coded background

**Priority Badges:**
- Similar to status badges
- Color indicates urgency

---

### Input Fields

**Style:**
- Background: `--input-background` (#f9fafb)
- Border: Subtle, focus ring on interaction
- Rounded: `rounded-lg`
- Padding: Comfortable for text input

**States:**
- Default: Light gray background
- Focus: Ring with primary color
- Error: Red ring
- Disabled: Reduced opacity

---

### Empty States

**Components:**
- Centered layout
- Icon in a muted circle
- Heading + description
- Optional action button

**Design:**
- Icon: 32px (w-8 h-8) in a 64px (w-16 h-16) circle
- Background: Muted color
- Text: Centered, limited width (max-w-sm)

---

### Stat Cards

**Design:**
- Gradient background (pastel colors)
- Icon in colored circle
- Large number display
- Small descriptive text
- Optional trend indicator

---

## Iconography

### Icon Library
**Lucide React** - Clean, consistent, modern icons

### Icon Sizes
```
Small: 16px (w-4 h-4)
Medium: 20px (w-5 h-5)
Large: 24px (w-6 h-6)
Extra Large: 32px (w-8 h-8)
```

### Application
- **Buttons:** 16px (w-4 h-4)
- **Headers:** 20px (w-5 h-5)
- **Stats:** 24px (w-6 h-6)
- **Empty states:** 32px (w-8 h-8)

---

## Layout Principles

### Grid System
```
Mobile: 1 column
Tablet: 2 columns (md:grid-cols-2)
Desktop: 3-4 columns (lg:grid-cols-3, lg:grid-cols-4)
```

### Container
```
Max width: 7xl (max-w-7xl)
Padding: px-4 sm:px-6 lg:px-8
```

### Responsive Breakpoints
```
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

---

## Special UI Elements

### 1. Sentiment Indicator
**Visual Design:**
- Rounded full pill
- Icon + label
- Three levels: Low (green), Medium (yellow), High (red)
- Used in issue reporting and details

### 2. Prediction Alert Widget
**Visual Design:**
- Purple gradient background (from-purple-50 to-indigo-50)
- Purple border
- Lightning bolt icon
- List of predicted issues
- Compact, card-based

### 3. Heatmap Visualization
**Visual Design:**
- Color-coded cards/rows
- Severity indicated by background color
- Progress bar showing issue frequency
- Room name + issue count

### 4. Workload Balancing Indicator
**Visual Design:**
- Progress bars
- Percentage display
- Green (good), Yellow (moderate), Red (overloaded)
- Used in staff management

### 5. Gamification Badges
**Visual Design:**
- Emoji icons for visual appeal
- Card layout with icon, name, description
- Progress bar for incomplete badges
- Green background for earned badges
- Gray/muted for locked badges

---

## Animation & Transitions

### Hover States
```css
transition-colors  /* For color changes */
transition-shadow  /* For shadow changes */
transition-all     /* For combined effects */
```

### Duration
```
Fast: 150ms
Standard: 200ms
Slow: 300ms
```

### Application
- **Buttons:** Hover color change (fast)
- **Cards:** Hover shadow increase (standard)
- **Modals:** Fade in/out (standard)

---

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Interactive elements have clear focus states
- Status colors work for colorblind users (icons + text)

### Focus States
- Visible focus rings on all interactive elements
- Primary color ring with 50% opacity

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Logical tab order
- Escape key closes modals

---

## Mobile Responsiveness

### Design Approach
- Mobile-first design
- Cards stack vertically on mobile
- Tables convert to card view or scrollable
- Touch targets minimum 44px × 44px
- Navigation adapts to mobile (hamburger or bottom nav)

### Layout Changes
```
Mobile: Single column, stacked elements
Tablet: 2 columns where appropriate
Desktop: Full grid layouts
```

---

## Best Practices

### DO:
✅ Use card-based layouts for content sections  
✅ Apply consistent spacing (4, 8, 16, 24, 32px)  
✅ Use soft shadows for depth  
✅ Include meaningful empty states  
✅ Use pastel colors for status and categories  
✅ Ensure all text is readable (proper contrast)  
✅ Make interactive elements obvious  

### DON'T:
❌ Override typography styles from globals.css  
❌ Use hard shadows  
❌ Create cluttered layouts  
❌ Use more than 3 colors in a single component  
❌ Forget hover/focus states  
❌ Make touch targets too small  

---

## Component Examples

### Example 1: Issue Card
```jsx
<Card className="p-6 hover:shadow-md transition-shadow cursor-pointer">
  <div className="flex items-start gap-3 mb-3">
    <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
    <div className="flex-1">
      <h4 className="text-foreground mb-1">Issue Title</h4>
      <p className="text-sm text-muted-foreground mb-2">
        Category • Room 301, Building A
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status="open" />
        <PriorityBadge priority="high" />
      </div>
    </div>
  </div>
</Card>
```

### Example 2: Stat Card with Gradient
```jsx
<Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
  <div className="flex items-center justify-between mb-2">
    <Trophy className="w-8 h-8 text-blue-600" />
    <span className="text-2xl text-blue-900">1250</span>
  </div>
  <p className="text-sm text-blue-700">Total Points</p>
</Card>
```

---

## Design Inspiration

### Apple Design Principles
- Clarity: Clear visual hierarchy
- Deference: Content is king, UI supports it
- Depth: Layered interface with shadows

### Material You Principles
- Personal: Adaptive colors
- Dynamic: Responsive and alive
- Accessible: Inclusive design

### Clean Dashboards
- White space: Breathing room between elements
- Data visualization: Charts and graphs
- Quick actions: Easy access to common tasks

---

## Conclusion

This design system provides a foundation for building a cohesive, modern, and accessible issue reporting system. All components follow these principles to ensure consistency across the entire application.
