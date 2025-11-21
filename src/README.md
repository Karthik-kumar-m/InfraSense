# Campus Issue Reporter 🎓

A comprehensive, full-stack issue reporting and management system for educational institutions, featuring gamification, AI-powered predictions, and real-time analytics.

## 📋 Overview

This system enables students to report campus issues while providing staff with powerful tools to manage, track, and resolve problems efficiently. The platform includes gamification for student engagement and predictive analytics for proactive maintenance.

---

## ✨ Key Features

### 🧑‍🎓 Student Side
- **Easy Issue Reporting** - QR code scanning, category selection, image upload
- **Real-time Tracking** - Monitor issue status and resolution progress
- **Gamification System** - Earn points, unlock badges, climb the leaderboard
- **Progress Visualization** - View your contributions and achievements
- **Mobile Responsive** - Report issues on-the-go

### 👨‍💼 Staff/Admin Side
- **Dashboard Analytics** - Comprehensive insights and trends
- **Issue Management** - Filter, sort, assign, and track issues
- **Predictive Alerts** - AI-powered proactive maintenance suggestions
- **Staff Workload Balancing** - Optimize task distribution
- **Department Management** - Manage teams and view performance metrics
- **Advanced Filtering** - Find issues quickly with powerful search

### 🎯 Special Features
- **Sentiment Analysis** - Auto-detect urgency from issue descriptions
- **Heatmap Visualization** - Identify problem areas on campus
- **Timeline Tracking** - Complete issue lifecycle history
- **Status Updates** - Real-time communication between students and staff
- **Proof Upload** - Staff can upload fix verification images

---

## 🎨 Design System

### Design Philosophy
- **Clean & Minimalistic** - Inspired by Apple Design and Material You
- **Pastel Color Palette** - Soft, accessible colors throughout
- **Card-Based Layouts** - Organized, scannable content
- **Meaningful Empty States** - Helpful guidance when no data exists
- **Consistent Spacing** - 4, 8, 16, 24, 32px spacing scale
- **Soft Shadows** - Subtle depth and hierarchy

### Color Palette
```css
/* Sentiment Indicators */
🟢 Low Urgency: #86efac (Green)
🟡 Medium Urgency: #fde047 (Yellow)
🔴 High Urgency: #fca5a5 (Red)

/* Status Colors */
🔵 Open: #dbeafe (Blue)
🟣 Assigned: #e0e7ff (Indigo)
🟡 In Progress: #fef3c7 (Yellow)
🟢 Resolved: #d1fae5 (Green)

/* Primary */
Primary: #6366f1 (Indigo)
Background: #fafafa (Soft Gray)
```

---

## 🗂 Project Structure

```
/
├── components/               # React components
│   ├── ui/                  # shadcn/ui components
│   ├── StudentLogin.tsx
│   ├── StudentDashboard.tsx
│   ├── ReportIssueForm.tsx
│   ├── IssueDetails.tsx
│   ├── GamificationPage.tsx
│   ├── StaffLogin.tsx
│   ├── StaffDashboard.tsx
│   ├── IssueTable.tsx
│   ├── StaffIssueDetails.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── DepartmentAdmin.tsx
│   ├── StatusBadge.tsx
│   ├── SentimentIndicator.tsx
│   ├── PriorityBadge.tsx
│   ├── EmptyState.tsx
│   └── StatCard.tsx
├── docs/                    # Documentation
│   ├── DATABASE_SCHEMA.md   # Complete schema (Firestore + SQL)
│   ├── API_CONTRACT.md      # Full API documentation
│   ├── DESIGN_GUIDE.md      # Design system guide
│   └── COMPONENT_LIBRARY.md # Component documentation
├── styles/
│   └── globals.css          # Global styles & CSS variables
└── App.tsx                  # Main application router
```

---

## 📱 Screens Included

### Student Screens (5)
1. **Login/Signup** - Email/phone authentication with student ID
2. **Home Dashboard** - Issue overview, stats, and quick actions
3. **Report Issue Form** - QR scan, location, category, description, image
4. **Issue Details** - Timeline, status, assigned staff, points earned
5. **Gamification Page** - Points, badges, leaderboard, progress

### Staff Screens (6)
1. **Staff Login** - Email/password with role selection
2. **Staff Dashboard** - Pending issues, alerts, predictions, stats
3. **Issue Table** - Comprehensive filtering, sorting, search
4. **Staff Issue Details** - Status updates, remarks, proof upload
5. **Analytics Dashboard** - Trends, heatmap, category distribution
6. **Department Admin** - Staff management, performance tracking

---

## 🗄️ Database Schema

### Firestore Collections
```javascript
users           // Student, staff, admin users
issues          // All reported issues
rooms           // Campus rooms with QR codes
issue_history   // Status changes and timeline
departments     // Department information
gamification    // Points, badges, rankings
notifications   // User notifications
prediction_rules // AI prediction configuration
pattern_history // Pattern tracking for predictions
```

### SQL Tables (Alternative)
All Firestore collections have equivalent SQL table definitions with proper foreign keys, indexes, and constraints.

**See:** `/docs/DATABASE_SCHEMA.md` for complete schema documentation

---

## 🔌 API Endpoints

### Authentication
- `POST /auth/student/login` - Student authentication
- `POST /auth/staff/login` - Staff authentication
- `POST /auth/refresh` - Refresh access token

### Issues
- `POST /issues/report` - Submit new issue
- `GET /issues/{issue_id}` - Get issue details
- `GET /issues/user/{user_id}` - Get user's issues
- `GET /issues` - Get all issues (filtered)
- `PUT /issues/{issue_id}/status` - Update status
- `PUT /issues/{issue_id}/assign` - Assign to staff
- `POST /issues/{issue_id}/remarks` - Add remark

### Analytics
- `GET /analytics/dashboard` - Dashboard statistics
- `GET /analytics/trends` - Issue trends over time
- `GET /analytics/heatmap` - Frequent issue locations
- `GET /analytics/staff-workload` - Staff workload data

### Gamification
- `GET /gamification/user/{user_id}` - User gamification data
- `GET /gamification/leaderboard` - Top contributors
- `GET /gamification/badges` - Available badges

**See:** `/docs/API_CONTRACT.md` for complete API documentation

---

## 🎮 Gamification System

### Points Structure
```
Report Issue: +50 points
Issue Resolved: +100 points
High Priority Issue: +150 points
Photo Uploaded: +25 points
```

### Badge Examples
- 🎯 **First Reporter** - Report your first issue
- ⚡ **Quick Spotter** - Report 10 issues
- 🛡️ **Campus Guardian** - Report 50 issues
- 📸 **Detail Master** - Submit 5 reports with photos
- 🚨 **Urgent Finder** - Report 3 high-priority issues
- 🔥 **Week Warrior** - Report for 7 consecutive days
- ✅ **Team Player** - Get 10 issues resolved
- ⚠️ **Safety First** - Report 5 safety hazards

### Levels
```
Level = floor(points / 500) + 1
```

---

## 🔮 AI Predictions

### Prediction Logic
The system tracks issue patterns and predicts future maintenance needs:

```javascript
if (issue_count >= frequency_threshold) 
   within time_window_days
then create_prediction_alert()
```

### Example Rules
- **HVAC Maintenance** - If 3+ issues in 30 days → Alert
- **Equipment Replacement** - If 5+ issues in 60 days → Alert
- **Room-Specific Patterns** - Track per-room issue frequency

**See:** `/docs/DATABASE_SCHEMA.md` for prediction rule schema

---

## 📊 Analytics & Visualizations

### Charts Included
1. **Line Chart** - Issue trends over time (reported vs resolved)
2. **Bar Chart** - Issues by category
3. **Pie Chart** - Priority distribution
4. **Heatmap** - Frequent issue locations (color-coded cards)
5. **Progress Bars** - Staff workload visualization

### Dashboard Metrics
- Total issues (with trend)
- Resolution rate
- Average resolution time
- Pending issues count
- High priority alerts
- Predicted maintenance needs

---

## 🎨 Component Library

### Reusable Components
- **StatusBadge** - Issue status indicator
- **PriorityBadge** - Priority level badge
- **SentimentIndicator** - Urgency indicator with icon
- **EmptyState** - Meaningful empty states
- **StatCard** - Statistics display card

### UI Components (shadcn/ui)
- Button, Card, Input, Label
- Select, Textarea, Tabs
- Badge, Avatar, Progress
- Dialog, Sheet, Popover
- And more...

**See:** `/docs/COMPONENT_LIBRARY.md` for complete component documentation

---

## 🚀 Getting Started

### Prerequisites
```bash
Node.js 18+ 
npm or yarn
```

### Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

### Environment Variables
```env
# Future backend integration
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_STORAGE_URL=https://storage.campus.edu
```

---

## 🔐 Security Considerations

### Authentication
- JWT-based authentication
- Refresh token rotation
- Role-based access control (RBAC)

### Data Validation
- Client-side form validation
- Server-side input sanitization
- File upload restrictions (type, size)

### Privacy
- No PII in logs
- Data encryption at rest
- HTTPS only in production

---

## 📱 Responsive Design

### Breakpoints
```
Mobile:  < 640px  (sm)
Tablet:  < 1024px (md, lg)
Desktop: ≥ 1024px (lg, xl)
```

### Mobile Optimizations
- Touch-friendly buttons (44px minimum)
- Single-column layouts
- Bottom navigation (optional)
- Swipe gestures for cards
- Mobile-optimized tables (card view)

---

## ♿ Accessibility

### WCAG Compliance
- ✅ Color contrast AA standard
- ✅ Keyboard navigation
- ✅ Screen reader support
- ✅ Focus indicators
- ✅ Semantic HTML
- ✅ ARIA labels where needed

### Features
- Skip to main content
- Descriptive link text
- Form labels and errors
- Alt text for images

---

## 🧪 Testing Strategy

### Recommended Tests
```
Unit Tests:        Jest + React Testing Library
Integration Tests: React Testing Library
E2E Tests:         Playwright or Cypress
Visual Tests:      Chromatic or Percy
```

### Test Coverage Goals
- Components: 80%+
- Business Logic: 90%+
- API Routes: 95%+

---

## 📈 Performance

### Optimization Techniques
- Code splitting (route-based)
- Lazy loading components
- Image optimization
- Virtual scrolling for tables
- Debounced search inputs
- Memoization for expensive renders

### Metrics Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Lighthouse Score: > 90

---

## 🔄 Future Enhancements

### Phase 2 Features
- [ ] Real-time updates (WebSockets)
- [ ] Push notifications
- [ ] Dark mode
- [ ] Multi-language support
- [ ] PDF report generation
- [ ] Advanced search with filters
- [ ] File attachment support (multiple files)
- [ ] Issue templates

### Phase 3 Features
- [ ] Mobile app (React Native)
- [ ] Email notifications
- [ ] SMS alerts
- [ ] Integration with facility management systems
- [ ] QR code generation tool
- [ ] Automated reports (weekly/monthly)
- [ ] Predictive maintenance ML model

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [DATABASE_SCHEMA.md](/docs/DATABASE_SCHEMA.md) | Complete database schema (Firestore + SQL) |
| [API_CONTRACT.md](/docs/API_CONTRACT.md) | Full API endpoint documentation |
| [DESIGN_GUIDE.md](/docs/DESIGN_GUIDE.md) | Design system and style guide |
| [COMPONENT_LIBRARY.md](/docs/COMPONENT_LIBRARY.md) | Component documentation and flows |

---

## 🤝 Contributing

### Development Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request
5. Code review
6. Merge to main

### Coding Standards
- TypeScript for type safety
- ESLint + Prettier for formatting
- Conventional commits
- Component documentation

---

## 📄 License

This project is created for educational/demonstration purposes.

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful UI components
- **Lucide Icons** - Icon library
- **Recharts** - Chart library
- **Tailwind CSS** - Utility-first CSS framework
- **React** - UI library

---

## 📞 Support

For questions or issues:
- Create an issue on GitHub
- Contact: support@campus-issues.edu

---

## 🎯 Quick Links

- [Live Demo](#) (Coming Soon)
- [API Documentation](/docs/API_CONTRACT.md)
- [Database Schema](/docs/DATABASE_SCHEMA.md)
- [Design System](/docs/DESIGN_GUIDE.md)
- [Component Library](/docs/COMPONENT_LIBRARY.md)

---

**Built with ❤️ for educational institutions**
