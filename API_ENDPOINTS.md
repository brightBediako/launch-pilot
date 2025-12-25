# API Endpoints Reference

## Backend Running On: `http://localhost:8000`

## API Base URL: `http://localhost:8000/api`

---

## 🚀 Launches Endpoints

### GET /api/launches

**Fetch all launches** (with optional filters)

**Query Parameters:**

- `status` (optional): 'draft' | 'planning' | 'active' | 'completed' | 'cancelled'
- `search` (optional): Search by title or description

**Hook:** `useLaunches({ status: 'active' })`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "launch123",
      "title": "Mobile App Launch",
      "description": "Launch our new mobile app",
      "status": "active",
      "targetDate": "2025-01-31",
      "productType": "mobile app",
      "progress": 65,
      "budget": "₦500,000",
      "team": 3
    }
  ]
}
```

---

### GET /api/launches/:id

**Fetch single launch details**

**Hook:** `useLaunchDetail(launchId)`

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "launch123",
    "title": "Mobile App Launch",
    "description": "...",
    "status": "active",
    "targetDate": "2025-01-31",
    "productType": "mobile app",
    "progress": 65,
    "tasks": [...],
    "team": [...],
    "analytics": {...}
  }
}
```

---

### POST /api/launches

**Create new launch**

**Hook:** `useCreateLaunch()`

**Request Body:**

```json
{
  "title": "New Product Launch",
  "description": "Launch description",
  "targetDate": "2025-02-15",
  "productType": "web app",
  "targetMarket": "Nigeria"
}
```

**Response:** Created launch object with `_id`

---

### PUT /api/launches/:id

**Update launch**

**Hook:** `useUpdateLaunch()`

**Request Body:**

```json
{
  "title": "Updated Title",
  "status": "completed",
  "progress": 100
}
```

**Response:** Updated launch object

---

### DELETE /api/launches/:id

**Delete launch**

**Hook:** `useDeleteLaunch()`

**Response:**

```json
{
  "success": true,
  "message": "Launch deleted"
}
```

---

## 📋 Tasks Endpoints

### GET /api/launches/:launchId/tasks

**Get all tasks for a launch**

**Hook:** `useTasks(launchId)`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "task123",
      "title": "Design mockups",
      "description": "Create UI mockups",
      "status": "completed",
      "dueDate": "2025-01-15",
      "assignee": "John Doe",
      "priority": "high"
    }
  ]
}
```

---

### POST /api/launches/:launchId/tasks

**Create task for launch**

**Hook:** `useCreateTask()`

**Request Body:**

```json
{
  "title": "Task title",
  "description": "Task description",
  "dueDate": "2025-01-15",
  "priority": "high"
}
```

---

### PUT /api/launches/:launchId/tasks/:taskId

**Update task**

**Hook:** `useUpdateTask()`

**Request Body:**

```json
{
  "status": "completed",
  "progress": 100
}
```

---

## 🤝 Partners Endpoints

### GET /api/partners

**Fetch all partners** (with optional filters)

**Query Parameters:**

- `service` (optional): 'Marketing' | 'Design' | 'Development' | etc.
- `search` (optional): Search by name

**Hook:** `usePartners({ service: 'Design' })`

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "partner123",
      "name": "Design Studios",
      "services": ["Design", "Branding", "UI/UX"],
      "rating": 4.9,
      "reviews": 32,
      "description": "Creative design agency",
      "location": "Ghana",
      "hourlyRate": "Starting at ₦12,000/hr",
      "verified": true
    }
  ]
}
```

---

### GET /api/partners/:id

**Get single partner details**

**Hook:** `usePartnerDetail(partnerId)`

**Response:** Single partner object with portfolio, reviews, etc.

---

## 📊 Analytics Endpoints

### GET /api/launches/:launchId/analytics

**Get analytics for a launch**

**Hook:** `useLaunchAnalytics(launchId)`

**Response:**

```json
{
  "success": true,
  "data": {
    "totalViews": 1250,
    "totalEngagement": 450,
    "conversionRate": "36%",
    "avgTimeOnPage": "3m 24s",
    "geoMetrics": {
      "Nigeria": 45,
      "Ghana": 30,
      "Kenya": 25
    },
    "deviceMetrics": {
      "mobile": 60,
      "desktop": 35,
      "tablet": 5
    },
    "timeline": [{ "date": "2025-01-20", "views": 150, "engagement": 45 }]
  }
}
```

---

## 🤖 AI Features Endpoints

### POST /api/launches/:id/generate-content

**Generate AI content for launch**

**Hook:** `useGenerateContent()`

**Request Body:**

```json
{
  "contentType": "email" | "social-media" | "landing-page" | "press-release",
  "context": "Product details and target audience..."
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "content": "Generated content here...",
    "contentType": "email"
  }
}
```

---

### POST /api/launches/generate-plan

**Generate AI launch plan**

**Hook:** `useGenerateLaunchPlan()`

**Request Body:**

```json
{
  "productName": "My Product",
  "description": "Product description",
  "targetMarket": "Nigeria"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "plan": {
      "timeline": [...],
      "tasks": [...],
      "milestones": [...],
      "resources": [...]
    }
  }
}
```

---

## 🔐 Authentication Endpoints

### GET /api/auth/me

**Get current user**

**Hook:** `useCurrentUser()`

**Headers Required:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "success": true,
  "data": {
    "_id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "founder",
    "company": "My Startup"
  }
}
```

---

### POST /api/auth/refresh-token

**Refresh JWT token** (automatic)

**Request Body:**

```json
{
  "refreshToken": "refresh_token_from_localStorage"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "accessToken": "new_jwt_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

### PUT /api/users/profile

**Update user profile**

**Hook:** `useUpdateProfile()`

**Request Body:**

```json
{
  "name": "Updated Name",
  "company": "Updated Company",
  "bio": "Updated bio"
}
```

---

## 🔍 Common Query Patterns

### Filter by Status

```jsx
const { data } = useLaunches({ status: "active" });
```

### Filter by Service

```jsx
const { data } = usePartners({ service: "Design" });
```

### Refetch Data

```jsx
const { refetch } = useLaunches();
refetch();
```

### Get Specific Item

```jsx
const { data } = useLaunchDetail("launch123");
```

### Handle Loading

```jsx
const { data, isLoading, error } = useLaunches();
if (isLoading) return <Loading />;
if (error) return <Error />;
```

---

## 🚫 Error Responses

All endpoints return errors in format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Error code"
}
```

**Common Error Codes:**

- `400` - Bad request (validation error)
- `401` - Unauthorized (no/invalid token)
- `403` - Forbidden (no permission)
- `404` - Not found
- `500` - Server error

---

## 📌 Rate Limiting

- Default: 100 requests per 15 minutes per IP
- Recommended: Keep stale time at 5 minutes
- Automatic: TanStack Query deduplicates identical requests

---

## 🔗 Request Headers

All requests automatically include:

```
Content-Type: application/json
Authorization: Bearer <jwt_token>
```

---

## ✅ Testing Endpoints

Use Postman, Insomnia, or curl:

```bash
# Get all launches
curl http://localhost:8000/api/launches \
  -H "Authorization: Bearer YOUR_TOKEN"

# Create launch
curl -X POST http://localhost:8000/api/launches \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"New Launch","description":"..."}'

# Get analytics
curl http://localhost:8000/api/launches/launch123/analytics \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🎯 Next Steps

1. **Test each endpoint** using the hooks in components
2. **Monitor** Network tab in browser DevTools
3. **Verify** responses match expected format
4. **Handle** edge cases and errors
5. **Optimize** with pagination if needed

---

**API Version**: 1.0
**Base URL**: http://localhost:8000/api
**Authentication**: JWT Bearer Token
**Last Updated**: December 25, 2025
