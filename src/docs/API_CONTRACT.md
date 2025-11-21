# API Contract Documentation

## Base URL
```
Production: https://api.campus-issues.edu/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All authenticated endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {token}
```

---

## 1. Authentication Endpoints

### 1.1 Student Login
**POST** `/auth/student/login`

**Description:** Authenticate a student user

**Request Body:**
```json
{
  "email": "student@university.edu",
  "phone": "+1-555-123-4567",  // Optional, either email or phone required
  "student_id": "STU123456"
}
```

**Validation:**
- `student_id`: Required, alphanumeric, 6-10 characters
- `email`: Valid email format OR
- `phone`: Valid phone format

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "usr_123abc",
      "name": "John Doe",
      "email": "student@university.edu",
      "role": "student",
      "student_id": "STU123456",
      "points": 1250,
      "level": 5
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "success": false,
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid student credentials"
  }
}
```

---

### 1.2 Staff/Admin Login
**POST** `/auth/staff/login`

**Description:** Authenticate a staff or admin user

**Request Body:**
```json
{
  "email": "staff@university.edu",
  "password": "secure_password",
  "role": "staff"  // 'staff' | 'admin' | 'super-admin'
}
```

**Validation:**
- `email`: Required, valid email format
- `password`: Required, min 8 characters
- `role`: Required, must be 'staff', 'admin', or 'super-admin'

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "usr_456def",
      "name": "Mike Smith",
      "email": "staff@university.edu",
      "role": "staff",
      "department": "Facilities"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "refresh_token_here"
  }
}
```

---

### 1.3 Refresh Token
**POST** `/auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "refresh_token_here"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refresh_token": "new_refresh_token"
  }
}
```

---

## 2. Issue Management Endpoints

### 2.1 Report Issue
**POST** `/issues/report`

**Authentication:** Required (Student)

**Description:** Submit a new issue report

**Request Body:**
```json
{
  "student_id": "usr_123abc",
  "room_id": "room_301a",
  "category": "Equipment",
  "description": "The projector in Room 301 is not turning on.",
  "image_url": "https://storage.campus.edu/issue-images/img123.jpg"  // Optional
}
```

**Validation:**
- `student_id`: Required, must match authenticated user
- `room_id`: Required, must exist in rooms collection
- `category`: Required, enum: ['Equipment', 'Facilities', 'Furniture', 'Electrical', 'Plumbing', 'HVAC', 'Cleaning', 'Security', 'Network/IT', 'Other']
- `description`: Required, min 10 characters, max 1000 characters
- `image_url`: Optional, valid URL format

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "issue_id": "iss_789ghi",
    "student_id": "usr_123abc",
    "room_id": "room_301a",
    "room_number": "Room 301",
    "building": "Building A",
    "floor": "3",
    "category": "Equipment",
    "description": "The projector in Room 301 is not turning on.",
    "sentiment_score": 85,
    "priority": "high",
    "status": "open",
    "image_url": "https://storage.campus.edu/issue-images/img123.jpg",
    "created_at": "2024-11-20T10:30:00Z",
    "points_earned": 50
  }
}
```

---

### 2.2 Get Issue Details
**GET** `/issues/{issue_id}`

**Authentication:** Required

**Description:** Get detailed information about a specific issue

**Path Parameters:**
- `issue_id`: Issue identifier

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "issue_id": "iss_789ghi",
    "student_id": "usr_123abc",
    "student_name": "John Doe",
    "room_id": "room_301a",
    "room_number": "Room 301",
    "building": "Building A",
    "floor": "3",
    "category": "Equipment",
    "description": "The projector in Room 301 is not turning on.",
    "sentiment_score": 85,
    "priority": "high",
    "status": "in-progress",
    "image_url": "https://storage.campus.edu/issue-images/img123.jpg",
    "assigned_staff_id": "usr_456def",
    "assigned_staff_name": "Mike Smith",
    "expected_resolution": "2024-11-21T14:00:00Z",
    "created_at": "2024-11-20T10:30:00Z",
    "updated_at": "2024-11-20T14:20:00Z"
  }
}
```

---

### 2.3 Get User Issues
**GET** `/issues/user/{user_id}`

**Authentication:** Required

**Description:** Get all issues reported by or assigned to a user

**Path Parameters:**
- `user_id`: User identifier

**Query Parameters:**
- `status`: Filter by status (optional) - 'open' | 'assigned' | 'in-progress' | 'resolved'
- `limit`: Number of results (default: 20, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "issues": [
      {
        "issue_id": "iss_789ghi",
        "title": "Broken projector in classroom",
        "category": "Equipment",
        "room_number": "Room 301",
        "building": "Building A",
        "status": "in-progress",
        "priority": "high",
        "created_at": "2024-11-20T10:30:00Z"
      }
    ],
    "total": 15,
    "limit": 20,
    "offset": 0
  }
}
```

---

### 2.4 Get All Issues (Staff/Admin)
**GET** `/issues`

**Authentication:** Required (Staff/Admin)

**Description:** Get all issues with filtering and sorting

**Query Parameters:**
- `status`: Filter by status (optional)
- `priority`: Filter by priority (optional)
- `category`: Filter by category (optional)
- `building`: Filter by building (optional)
- `assigned_staff_id`: Filter by assigned staff (optional)
- `sort_by`: Sort field (default: 'created_at') - 'created_at' | 'priority' | 'status' | 'room'
- `sort_order`: Sort direction (default: 'desc') - 'asc' | 'desc'
- `limit`: Number of results (default: 50, max: 100)
- `offset`: Pagination offset (default: 0)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "issues": [...],
    "total": 245,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 2.5 Update Issue Status (Staff)
**PUT** `/issues/{issue_id}/status`

**Authentication:** Required (Staff/Admin)

**Request Body:**
```json
{
  "status": "in-progress",
  "comment": "Started working on the issue",
  "image_url": "https://storage.campus.edu/proof-images/proof123.jpg"  // Optional
}
```

**Validation:**
- `status`: Required, enum: ['open', 'assigned', 'in-progress', 'resolved']
- `comment`: Optional, max 500 characters
- `image_url`: Optional, valid URL format

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "issue_id": "iss_789ghi",
    "status": "in-progress",
    "updated_at": "2024-11-20T14:20:00Z"
  }
}
```

---

### 2.6 Assign Issue to Staff (Admin)
**PUT** `/issues/{issue_id}/assign`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "assigned_staff_id": "usr_456def"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "issue_id": "iss_789ghi",
    "assigned_staff_id": "usr_456def",
    "assigned_staff_name": "Mike Smith",
    "status": "assigned",
    "updated_at": "2024-11-20T10:45:00Z"
  }
}
```

---

### 2.7 Add Remark to Issue (Staff)
**POST** `/issues/{issue_id}/remarks`

**Authentication:** Required (Staff/Admin)

**Request Body:**
```json
{
  "comment": "Ordered replacement parts. Will be installed tomorrow morning.",
  "image_url": "https://storage.campus.edu/remarks/img456.jpg"  // Optional
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "history_id": "hist_123xyz",
    "issue_id": "iss_789ghi",
    "user_id": "usr_456def",
    "user_name": "Mike Smith",
    "action_type": "comment",
    "comment": "Ordered replacement parts. Will be installed tomorrow morning.",
    "timestamp": "2024-11-20T16:00:00Z"
  }
}
```

---

### 2.8 Get Issue History
**GET** `/issues/{issue_id}/history`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "history": [
      {
        "history_id": "hist_001",
        "action_type": "created",
        "user_name": "John Doe",
        "comment": "Issue created",
        "timestamp": "2024-11-20T10:30:00Z"
      },
      {
        "history_id": "hist_002",
        "action_type": "assigned",
        "user_name": "System",
        "old_status": "open",
        "new_status": "assigned",
        "timestamp": "2024-11-20T10:45:00Z"
      }
    ]
  }
}
```

---

## 3. Room Endpoints

### 3.1 Get Room by QR Code
**GET** `/rooms/qr/{qr_code}`

**Authentication:** Required

**Description:** Get room details by scanning QR code

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "room_id": "room_301a",
    "building": "Building A",
    "floor": "3",
    "room_number": "301",
    "room_type": "classroom",
    "capacity": 30
  }
}
```

---

### 3.2 Get All Rooms
**GET** `/rooms`

**Authentication:** Required

**Query Parameters:**
- `building`: Filter by building (optional)
- `floor`: Filter by floor (optional)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "rooms": [
      {
        "room_id": "room_301a",
        "building": "Building A",
        "floor": "3",
        "room_number": "301",
        "room_type": "classroom"
      }
    ]
  }
}
```

---

## 4. Gamification Endpoints

### 4.1 Get User Gamification Data
**GET** `/gamification/user/{user_id}`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user_id": "usr_123abc",
    "points": 1250,
    "level": 5,
    "leaderboard_rank": 42,
    "badges": [
      {
        "badge_id": "badge_001",
        "name": "First Reporter",
        "description": "Report your first issue",
        "icon": "🎯",
        "earned": true,
        "earned_at": "2024-10-15T08:00:00Z"
      }
    ],
    "issues_reported": 52,
    "streak_days": 7
  }
}
```

---

### 4.2 Get Leaderboard
**GET** `/gamification/leaderboard`

**Authentication:** Required

**Query Parameters:**
- `limit`: Number of results (default: 100, max: 500)
- `timeframe`: 'all-time' | 'monthly' | 'weekly' (default: 'all-time')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "leaderboard": [
      {
        "rank": 1,
        "user_id": "usr_001",
        "name": "Emma Wilson",
        "points": 3420,
        "badges_count": 15
      },
      {
        "rank": 2,
        "user_id": "usr_002",
        "name": "Michael Chen",
        "points": 3180,
        "badges_count": 14
      }
    ],
    "current_user_rank": 42
  }
}
```

---

### 4.3 Get Available Badges
**GET** `/gamification/badges`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "badges": [
      {
        "badge_id": "badge_001",
        "name": "First Reporter",
        "description": "Report your first issue",
        "icon": "🎯",
        "requirement_type": "issues_reported",
        "requirement_value": 1
      }
    ]
  }
}
```

---

## 5. Analytics Endpoints (Staff/Admin)

### 5.1 Get Dashboard Statistics
**GET** `/analytics/dashboard`

**Authentication:** Required (Staff/Admin)

**Query Parameters:**
- `timeframe`: 'day' | 'week' | 'month' | 'year' (default: 'month')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "pending_issues": 24,
    "in_progress_issues": 12,
    "resolved_issues": 156,
    "avg_resolution_time_hours": 2.5,
    "high_priority_count": 8,
    "predicted_issues_count": 3
  }
}
```

---

### 5.2 Get Issue Trends
**GET** `/analytics/trends`

**Authentication:** Required (Staff/Admin)

**Query Parameters:**
- `period`: 'daily' | 'weekly' | 'monthly' (default: 'monthly')
- `months`: Number of months (default: 6, max: 12)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "trends": [
      {
        "period": "2024-11",
        "reported": 70,
        "resolved": 65,
        "avg_resolution_hours": 2.3
      }
    ]
  }
}
```

---

### 5.3 Get Issue Heatmap
**GET** `/analytics/heatmap`

**Authentication:** Required (Staff/Admin)

**Query Parameters:**
- `timeframe`: 'week' | 'month' | 'year' (default: 'month')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "heatmap": [
      {
        "room_id": "room_301a",
        "room_number": "Room 301",
        "building": "Building A",
        "issue_count": 12,
        "severity": "high"
      }
    ]
  }
}
```

---

### 5.4 Get Staff Workload
**GET** `/analytics/staff-workload`

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "staff": [
      {
        "user_id": "usr_456def",
        "name": "Mike Smith",
        "department": "Facilities",
        "assigned_issues": 12,
        "resolved_issues_month": 45,
        "avg_resolution_hours": 2.1,
        "workload_percentage": 80
      }
    ]
  }
}
```

---

### 5.5 Get Category Distribution
**GET** `/analytics/categories`

**Authentication:** Required (Staff/Admin)

**Query Parameters:**
- `timeframe`: 'week' | 'month' | 'year' (default: 'month')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "category": "Equipment",
        "count": 45,
        "percentage": 28.5
      },
      {
        "category": "Facilities",
        "count": 38,
        "percentage": 24.1
      }
    ]
  }
}
```

---

## 6. Prediction Endpoints (Staff/Admin)

### 6.1 Get Predicted Issues
**GET** `/predictions/issues`

**Authentication:** Required (Staff/Admin)

**Query Parameters:**
- `timeframe`: 'week' | 'month' (default: 'week')

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "predictions": [
      {
        "prediction_id": "pred_001",
        "room_id": "room_205b",
        "room_number": "Room 205",
        "building": "Building B",
        "category": "HVAC",
        "predicted_date": "2024-11-22T00:00:00Z",
        "confidence_score": 85,
        "reason": "HVAC maintenance needed based on 30-day pattern"
      }
    ]
  }
}
```

---

### 6.2 Create Prediction Rule (Admin)
**POST** `/predictions/rules`

**Authentication:** Required (Admin)

**Request Body:**
```json
{
  "category": "HVAC",
  "room_id": "room_205b",  // Optional
  "frequency_threshold": 3,
  "time_window_days": 30,
  "auto_alert": true,
  "priority": "medium"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "rule_id": "rule_001",
    "category": "HVAC",
    "room_id": "room_205b",
    "frequency_threshold": 3,
    "time_window_days": 30,
    "auto_alert": true,
    "priority": "medium",
    "is_active": true
  }
}
```

---

## 7. Notification Endpoints

### 7.1 Get User Notifications
**GET** `/notifications/user/{user_id}`

**Authentication:** Required

**Query Parameters:**
- `read_status`: Filter by read status (optional) - 'true' | 'false'
- `limit`: Number of results (default: 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "notification_id": "notif_001",
        "type": "issue_update",
        "title": "Issue Updated",
        "message": "Your issue #iss_789ghi has been assigned to Mike Smith",
        "issue_id": "iss_789ghi",
        "read_status": false,
        "timestamp": "2024-11-20T10:45:00Z"
      }
    ],
    "unread_count": 5
  }
}
```

---

### 7.2 Mark Notification as Read
**PUT** `/notifications/{notification_id}/read`

**Authentication:** Required

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "notification_id": "notif_001",
    "read_status": true
  }
}
```

---

## 8. Department Endpoints (Admin)

### 8.1 Get Department Stats
**GET** `/departments/{department_id}/stats`

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "department_id": "dept_facilities",
    "name": "Facilities",
    "total_staff": 12,
    "active_issues": 45,
    "resolved_issues_month": 156,
    "avg_resolution_time_hours": 2.5
  }
}
```

---

### 8.2 Get Department Staff
**GET** `/departments/{department_id}/staff`

**Authentication:** Required (Admin)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "staff": [
      {
        "user_id": "usr_456def",
        "name": "Mike Smith",
        "email": "mike.smith@university.edu",
        "role": "Maintenance Technician",
        "assigned_issues": 12,
        "status": "active"
      }
    ]
  }
}
```

---

## Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_CREDENTIALS` | 401 | Invalid login credentials |
| `UNAUTHORIZED` | 401 | Missing or invalid authentication token |
| `FORBIDDEN` | 403 | Insufficient permissions for this action |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `DUPLICATE_ENTRY` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |

---

## Rate Limiting

- **Default:** 100 requests per minute per user
- **Issue Reporting:** 10 reports per hour per student
- **File Upload:** 20 uploads per hour per user

---

## File Upload

### Upload Image
**POST** `/upload/image`

**Authentication:** Required

**Content-Type:** `multipart/form-data`

**Request:**
```
file: [binary data]
type: "issue" | "proof" | "profile"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "url": "https://storage.campus.edu/images/img_123.jpg",
    "file_size": 245678,
    "mime_type": "image/jpeg"
  }
}
```

**Validation:**
- Max file size: 10MB
- Allowed formats: jpg, jpeg, png, gif, webp

---

## Webhooks (Optional)

### Issue Status Change
**POST** `{client_webhook_url}`

**Payload:**
```json
{
  "event": "issue.status_changed",
  "issue_id": "iss_789ghi",
  "old_status": "assigned",
  "new_status": "in-progress",
  "timestamp": "2024-11-20T14:20:00Z"
}
```

### Issue Resolved
**POST** `{client_webhook_url}`

**Payload:**
```json
{
  "event": "issue.resolved",
  "issue_id": "iss_789ghi",
  "resolution_time_hours": 3.5,
  "timestamp": "2024-11-20T14:00:00Z"
}
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- All endpoints return JSON responses
- Pagination uses `limit` and `offset` parameters
- Maximum page size is 100 items
- API versioning is done through URL path (`/v1/`)
- CORS is enabled for approved domains only
- All endpoints support HTTPS only in production
