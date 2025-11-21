# Database Schema Documentation

## Overview
This document provides comprehensive schema definitions for both NoSQL (Firestore) and SQL (PostgreSQL/MySQL) implementations of the Issue Reporting and Management System.

---

## Firestore Schema (NoSQL)

### Collections Structure

#### 1. **users** Collection
Stores information about all users (students, staff, admins)

```javascript
users/{userId}
{
  user_id: string,              // Auto-generated unique ID
  name: string,                 // Full name
  email: string,                // Email address
  phone: string,                // Phone number
  role: string,                 // 'student' | 'staff' | 'admin'
  student_id: string,           // Student ID (for students only)
  department: string,           // Department name (for staff/admin)
  points: number,               // Gamification points (default: 0)
  badges: array,                // Array of badge IDs earned
  level: number,                // User level (default: 1)
  created_at: timestamp,        // Account creation date
  updated_at: timestamp,        // Last update timestamp
  is_active: boolean            // Account status
}
```

**Indexes:**
- email (unique)
- role
- department
- points (descending, for leaderboard)

---

#### 2. **issues** Collection
Stores all reported issues

```javascript
issues/{issueId}
{
  issue_id: string,             // Auto-generated unique ID
  student_id: string,           // Reference to users collection
  student_name: string,         // Denormalized for quick access
  room_id: string,              // Reference to rooms collection
  room_number: string,          // Denormalized room number
  building: string,             // Building name
  floor: string,                // Floor number
  category: string,             // Issue category
  description: string,          // Detailed description
  sentiment_score: number,      // 0-100 sentiment analysis score
  priority: string,             // 'low' | 'medium' | 'high'
  image_url: string,            // Optional image URL
  status: string,               // 'open' | 'assigned' | 'in-progress' | 'resolved'
  assigned_staff_id: string,    // Reference to users collection
  assigned_staff_name: string,  // Denormalized for quick access
  predicted_flag: boolean,      // AI-predicted issue flag
  expected_resolution: timestamp, // Expected resolution date
  actual_resolution: timestamp, // Actual resolution date
  created_at: timestamp,        // Issue creation date
  updated_at: timestamp         // Last update timestamp
}
```

**Indexes:**
- student_id
- status
- priority
- category
- room_id
- assigned_staff_id
- created_at (descending)
- predicted_flag

---

#### 3. **rooms** Collection
Stores room information

```javascript
rooms/{roomId}
{
  room_id: string,              // Auto-generated unique ID
  building: string,             // Building name
  floor: string,                // Floor number
  room_number: string,          // Room number
  room_type: string,            // 'classroom' | 'lab' | 'office' | 'common'
  capacity: number,             // Room capacity
  qr_code: string,              // QR code for quick reporting
  created_at: timestamp,
  updated_at: timestamp
}
```

**Indexes:**
- building
- floor
- qr_code (unique)

---

#### 4. **issue_history** Collection
Tracks status changes and updates for each issue

```javascript
issue_history/{historyId}
{
  history_id: string,           // Auto-generated unique ID
  issue_id: string,             // Reference to issues collection
  user_id: string,              // User who made the change
  user_name: string,            // Denormalized user name
  action_type: string,          // 'created' | 'assigned' | 'status_change' | 'comment' | 'resolved'
  old_status: string,           // Previous status
  new_status: string,           // New status
  comment: string,              // Optional comment/remark
  image_url: string,            // Optional proof image
  timestamp: timestamp          // When the action occurred
}
```

**Indexes:**
- issue_id
- timestamp (descending)

---

#### 5. **departments** Collection
Stores department information

```javascript
departments/{departmentId}
{
  department_id: string,        // Auto-generated unique ID
  name: string,                 // Department name
  description: string,          // Department description
  staff_list: array,            // Array of staff user IDs
  categories: array,            // Categories this dept handles
  created_at: timestamp,
  updated_at: timestamp
}
```

**Indexes:**
- name (unique)

---

#### 6. **gamification** Collection
Stores detailed gamification data

```javascript
gamification/{userId}
{
  user_id: string,              // Reference to users collection
  points: number,               // Total points
  level: number,                // Current level
  badges: array<{               // Array of badge objects
    badge_id: string,
    name: string,
    earned_at: timestamp,
    progress: number,
    total: number
  }>,
  leaderboard_rank: number,     // Current rank
  issues_reported: number,      // Total issues reported
  issues_resolved: number,      // Total issues resolved (for staff)
  streak_days: number,          // Consecutive days reporting
  last_activity: timestamp,     // Last activity date
  updated_at: timestamp
}
```

**Indexes:**
- points (descending)
- leaderboard_rank

---

#### 7. **notifications** Collection
Stores user notifications

```javascript
notifications/{notificationId}
{
  notification_id: string,      // Auto-generated unique ID
  user_id: string,              // Reference to users collection
  issue_id: string,             // Related issue (if applicable)
  type: string,                 // 'issue_update' | 'assignment' | 'resolution' | 'badge_earned'
  title: string,                // Notification title
  message: string,              // Notification message
  read_status: boolean,         // Read/unread
  timestamp: timestamp,         // When notification was created
  expires_at: timestamp         // Optional expiration date
}
```

**Indexes:**
- user_id
- read_status
- timestamp (descending)

---

#### 8. **prediction_rules** Collection
Stores rules for predictive maintenance

```javascript
prediction_rules/{ruleId}
{
  rule_id: string,              // Auto-generated unique ID
  category: string,             // Issue category
  room_id: string,              // Specific room (optional)
  building: string,             // Building (optional)
  day_of_week: number,          // 0-6, day pattern
  frequency_threshold: number,  // Number of occurrences to trigger
  time_window_days: number,     // Time window to check
  auto_alert: boolean,          // Auto-create alert flag
  priority: string,             // Priority for predicted issues
  is_active: boolean,           // Rule active status
  created_at: timestamp,
  updated_at: timestamp
}
```

**Indexes:**
- category
- is_active

---

#### 9. **pattern_history** Collection
Tracks patterns for predictions

```javascript
pattern_history/{patternId}
{
  pattern_id: string,           // Auto-generated unique ID
  room_id: string,              // Room reference
  category: string,             // Issue category
  weekly_count: number,         // Issues this week
  monthly_count: number,        // Issues this month
  last_triggered: timestamp,    // Last time pattern triggered
  confidence_score: number,     // 0-100 prediction confidence
  next_predicted_date: timestamp, // Next predicted occurrence
  updated_at: timestamp
}
```

**Indexes:**
- room_id
- category
- next_predicted_date

---

## SQL Schema (PostgreSQL/MySQL)

### Table Definitions

#### 1. **users** Table
```sql
CREATE TABLE users (
  user_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  role ENUM('student', 'staff', 'admin') NOT NULL,
  student_id VARCHAR(50),
  department VARCHAR(100),
  points INT DEFAULT 0,
  level INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  
  INDEX idx_role (role),
  INDEX idx_department (department),
  INDEX idx_points (points DESC),
  INDEX idx_email (email)
);
```

---

#### 2. **issues** Table
```sql
CREATE TABLE issues (
  issue_id VARCHAR(50) PRIMARY KEY,
  student_id VARCHAR(50) NOT NULL,
  student_name VARCHAR(255) NOT NULL,
  room_id VARCHAR(50) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(10) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  sentiment_score INT,
  priority ENUM('low', 'medium', 'high') NOT NULL,
  image_url VARCHAR(500),
  status ENUM('open', 'assigned', 'in-progress', 'resolved') DEFAULT 'open',
  assigned_staff_id VARCHAR(50),
  assigned_staff_name VARCHAR(255),
  predicted_flag BOOLEAN DEFAULT FALSE,
  expected_resolution TIMESTAMP,
  actual_resolution TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (student_id) REFERENCES users(user_id),
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (assigned_staff_id) REFERENCES users(user_id),
  
  INDEX idx_student (student_id),
  INDEX idx_status (status),
  INDEX idx_priority (priority),
  INDEX idx_category (category),
  INDEX idx_room (room_id),
  INDEX idx_staff (assigned_staff_id),
  INDEX idx_created (created_at DESC),
  INDEX idx_predicted (predicted_flag)
);
```

---

#### 3. **rooms** Table
```sql
CREATE TABLE rooms (
  room_id VARCHAR(50) PRIMARY KEY,
  building VARCHAR(100) NOT NULL,
  floor VARCHAR(10) NOT NULL,
  room_number VARCHAR(20) NOT NULL,
  room_type ENUM('classroom', 'lab', 'office', 'common') NOT NULL,
  capacity INT,
  qr_code VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_building (building),
  INDEX idx_floor (floor),
  INDEX idx_qr_code (qr_code),
  UNIQUE KEY unique_room (building, floor, room_number)
);
```

---

#### 4. **issue_history** Table
```sql
CREATE TABLE issue_history (
  history_id VARCHAR(50) PRIMARY KEY,
  issue_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  action_type ENUM('created', 'assigned', 'status_change', 'comment', 'resolved') NOT NULL,
  old_status VARCHAR(50),
  new_status VARCHAR(50),
  comment TEXT,
  image_url VARCHAR(500),
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  
  INDEX idx_issue (issue_id),
  INDEX idx_timestamp (timestamp DESC)
);
```

---

#### 5. **departments** Table
```sql
CREATE TABLE departments (
  department_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_name (name)
);
```

---

#### 6. **department_staff** Table (Junction Table)
```sql
CREATE TABLE department_staff (
  department_id VARCHAR(50) NOT NULL,
  user_id VARCHAR(50) NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  PRIMARY KEY (department_id, user_id),
  FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

---

#### 7. **department_categories** Table (Junction Table)
```sql
CREATE TABLE department_categories (
  department_id VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  
  PRIMARY KEY (department_id, category),
  FOREIGN KEY (department_id) REFERENCES departments(department_id) ON DELETE CASCADE
);
```

---

#### 8. **badges** Table
```sql
CREATE TABLE badges (
  badge_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  requirement_type VARCHAR(50),
  requirement_value INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

#### 9. **user_badges** Table (Junction Table)
```sql
CREATE TABLE user_badges (
  user_id VARCHAR(50) NOT NULL,
  badge_id VARCHAR(50) NOT NULL,
  progress INT DEFAULT 0,
  total INT NOT NULL,
  earned BOOLEAN DEFAULT FALSE,
  earned_at TIMESTAMP,
  
  PRIMARY KEY (user_id, badge_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (badge_id) REFERENCES badges(badge_id) ON DELETE CASCADE,
  
  INDEX idx_earned (earned)
);
```

---

#### 10. **gamification** Table
```sql
CREATE TABLE gamification (
  user_id VARCHAR(50) PRIMARY KEY,
  points INT DEFAULT 0,
  level INT DEFAULT 1,
  leaderboard_rank INT,
  issues_reported INT DEFAULT 0,
  issues_resolved INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  last_activity TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  
  INDEX idx_points (points DESC),
  INDEX idx_rank (leaderboard_rank)
);
```

---

#### 11. **notifications** Table
```sql
CREATE TABLE notifications (
  notification_id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  issue_id VARCHAR(50),
  type ENUM('issue_update', 'assignment', 'resolution', 'badge_earned') NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (issue_id) REFERENCES issues(issue_id) ON DELETE CASCADE,
  
  INDEX idx_user (user_id),
  INDEX idx_read (read_status),
  INDEX idx_timestamp (timestamp DESC)
);
```

---

#### 12. **prediction_rules** Table
```sql
CREATE TABLE prediction_rules (
  rule_id VARCHAR(50) PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  room_id VARCHAR(50),
  building VARCHAR(100),
  day_of_week INT,
  frequency_threshold INT NOT NULL,
  time_window_days INT DEFAULT 30,
  auto_alert BOOLEAN DEFAULT TRUE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  
  INDEX idx_category (category),
  INDEX idx_active (is_active)
);
```

---

#### 13. **pattern_history** Table
```sql
CREATE TABLE pattern_history (
  pattern_id VARCHAR(50) PRIMARY KEY,
  room_id VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  weekly_count INT DEFAULT 0,
  monthly_count INT DEFAULT 0,
  last_triggered TIMESTAMP,
  confidence_score INT,
  next_predicted_date TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  FOREIGN KEY (room_id) REFERENCES rooms(room_id) ON DELETE CASCADE,
  
  INDEX idx_room (room_id),
  INDEX idx_category (category),
  INDEX idx_next_predicted (next_predicted_date)
);
```

---

## Data Relationships

### Entity Relationship Diagram (ERD) Summary

```
users ──┬─< issues (as student)
        ├─< issues (as assigned_staff)
        ├─< issue_history
        ├─< notifications
        ├─── gamification (1:1)
        └─< user_badges

rooms ──┬─< issues
        └─< pattern_history

issues ──┬─< issue_history
         └─< notifications

departments ──┬─< department_staff
              └─< department_categories

badges ──< user_badges

prediction_rules ──> rooms (optional)
```

---

## Data Validation Rules

### Users
- Email must be unique and valid format
- Role must be one of: student, staff, admin
- Student ID required if role is 'student'
- Department required if role is 'staff' or 'admin'

### Issues
- Priority auto-calculated based on sentiment_score
- Status workflow: open → assigned → in-progress → resolved
- expected_resolution auto-calculated based on priority
- sentiment_score range: 0-100

### Gamification
- Points awarded based on actions:
  - Report issue: +50 points
  - Issue resolved: +100 points
  - High priority issue: +150 points
  - Photo uploaded: +25 points
- Level calculated: level = floor(points / 500) + 1

### Prediction Rules
- frequency_threshold minimum: 2
- time_window_days default: 30
- Prediction triggered when: (issue_count >= frequency_threshold) within time_window_days

---

## Sample Queries

### Most Frequent Issue Locations (SQL)
```sql
SELECT room_number, building, COUNT(*) as issue_count
FROM issues
WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY room_id, room_number, building
ORDER BY issue_count DESC
LIMIT 10;
```

### Leaderboard (SQL)
```sql
SELECT u.user_id, u.name, g.points, g.leaderboard_rank,
       (SELECT COUNT(*) FROM user_badges WHERE user_id = u.user_id AND earned = TRUE) as badges_earned
FROM users u
JOIN gamification g ON u.user_id = g.user_id
WHERE u.role = 'student'
ORDER BY g.points DESC
LIMIT 100;
```

### Staff Workload (SQL)
```sql
SELECT u.user_id, u.name, u.department,
       COUNT(CASE WHEN i.status IN ('assigned', 'in-progress') THEN 1 END) as current_load,
       COUNT(CASE WHEN i.status = 'resolved' AND i.actual_resolution >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 END) as resolved_month,
       AVG(TIMESTAMPDIFF(HOUR, i.created_at, i.actual_resolution)) as avg_resolution_hours
FROM users u
LEFT JOIN issues i ON u.user_id = i.assigned_staff_id
WHERE u.role = 'staff'
GROUP BY u.user_id, u.name, u.department
ORDER BY current_load DESC;
```

---

## Notes

- All timestamps are stored in UTC
- File uploads (images) should be stored in cloud storage (e.g., Firebase Storage, AWS S3) with URLs stored in the database
- Soft deletes recommended for users and issues (add `deleted_at` column)
- Consider archiving resolved issues older than 1 year to separate archive table
- Implement proper indexing strategy based on query patterns
- Use database triggers for auto-updating `updated_at` timestamps
- Implement row-level security/access control based on user roles
