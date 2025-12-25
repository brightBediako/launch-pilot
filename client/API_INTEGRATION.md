# LaunchPilot API Integration Guide

## Overview

The frontend is now fully integrated with the backend API using **TanStack Query (React Query)** for efficient server state management and data synchronization.

## Architecture

### Key Components

1. **TanStack Query Setup** - Configured in `src/App.jsx`

   - QueryClient instance with optimized defaults
   - Stale time: 5 minutes
   - Cache time: 10 minutes
   - Auto-retry on failures

2. **Custom Hooks** - Located in `src/hooks/useQueries.js`

   - Query hooks for fetching data
   - Mutation hooks for creating/updating/deleting data
   - Automatic cache invalidation

3. **API Client** - Configured in `src/services/apiClient.js`
   - Axios instance with JWT authentication
   - Automatic token refresh on 401
   - Request/response interceptors

## Available Hooks

### Launches

```javascript
// Fetch launches with optional filters
const { data: launches, isLoading, error } = useLaunches({ status: "active" });

// Fetch single launch details
const { data: launch } = useLaunchDetail(launchId);

// Create new launch
const { mutate: createLaunch, isPending } = useCreateLaunch();

// Update launch
const { mutate: updateLaunch } = useUpdateLaunch();

// Delete launch
const { mutate: deleteLaunch } = useDeleteLaunch();
```

### Partners

```javascript
// Fetch partners with optional filters
const { data: partners } = usePartners({ service: "Design" });

// Fetch single partner details
const { data: partner } = usePartnerDetail(partnerId);
```

### Tasks

```javascript
// Fetch tasks for a launch
const { data: tasks } = useTasks(launchId);

// Create task
const { mutate: createTask } = useCreateTask();

// Update task
const { mutate: updateTask } = useUpdateTask();
```

### Analytics

```javascript
// Fetch launch analytics
const { data: analytics } = useLaunchAnalytics(launchId);
```

### Content Generation

```javascript
// Generate content with AI
const { mutate: generateContent } = useGenerateContent();
```

### Launch Planning

```javascript
// Generate launch plan with AI
const { mutate: generatePlan } = useGenerateLaunchPlan();
```

### User/Profile

```javascript
// Fetch current user
const { data: currentUser } = useCurrentUser();

// Update user profile
const { mutate: updateProfile } = useUpdateProfile();
```

## Usage Examples

### Fetching Data

```jsx
import { useLaunches } from "../hooks/useQueries";

function MyComponent() {
  const {
    data: launches,
    isLoading,
    error,
  } = useLaunches({ status: "active" });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {launches.map((launch) => (
        <div key={launch._id}>{launch.title}</div>
      ))}
    </div>
  );
}
```

### Creating Data

```jsx
import { useCreateLaunch } from "../hooks/useQueries";

function CreateLaunchForm() {
  const { mutate: createLaunch, isPending } = useCreateLaunch();

  const handleSubmit = async (formData) => {
    createLaunch(formData, {
      onSuccess: (data) => {
        console.log("Launch created:", data);
        // Navigate or show success message
      },
      onError: (error) => {
        console.error("Error creating launch:", error);
      },
    });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        handleSubmit(Object.fromEntries(formData));
      }}
    >
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? "Creating..." : "Create Launch"}
      </button>
    </form>
  );
}
```

## API Endpoints

### Launches

- `GET /api/launches` - Get all launches
- `GET /api/launches/:id` - Get launch detail
- `POST /api/launches` - Create launch
- `PUT /api/launches/:id` - Update launch
- `DELETE /api/launches/:id` - Delete launch
- `GET /api/launches/:id/tasks` - Get launch tasks
- `GET /api/launches/:id/analytics` - Get launch analytics

### Partners

- `GET /api/partners` - Get all partners
- `GET /api/partners/:id` - Get partner detail

### Tasks

- `GET /api/launches/:launchId/tasks` - Get tasks
- `POST /api/launches/:launchId/tasks` - Create task
- `PUT /api/launches/:launchId/tasks/:taskId` - Update task

### AI Features

- `POST /api/launches/:id/generate-content` - Generate content
- `POST /api/launches/generate-plan` - Generate launch plan

### Auth

- `GET /api/auth/me` - Get current user
- `PUT /api/users/profile` - Update profile
- `POST /api/auth/refresh-token` - Refresh token

## Error Handling

All hooks include error handling:

```jsx
const { data, isLoading, error } = useLaunches();

if (error) {
  // Error object contains: error.message, error.response
  console.error("Failed to load:", error.message);
}
```

## Cache Management

### Automatic Invalidation

When you create/update/delete data, related queries are automatically invalidated:

```javascript
// After creating a launch, launches list is automatically refreshed
useCreateLaunch().mutate(launchData);
```

### Manual Invalidation

```jsx
import { useQueryClient } from "@tanstack/react-query";

function MyComponent() {
  const queryClient = useQueryClient();

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["launches"] });
  };

  return <button onClick={handleRefresh}>Refresh</button>;
}
```

## Environment Variables

Make sure your `.env.local` file includes:

```env
VITE_API_URL=http://localhost:8000/api
```

## Features Implemented

✅ Automatic retry on failures
✅ Background refetching on focus
✅ Request deduplication
✅ Optimistic updates (when implemented)
✅ Pagination support (ready to implement)
✅ Search/filter support
✅ Loading states
✅ Error boundaries
✅ JWT token refresh
✅ Fallback to mock data

## Pages with API Integration

1. **DashboardPage** - Fetches user's launches
2. **LaunchesPage** - Fetches all launches with filtering
3. **PartnersPage** - Fetches partners with filtering
4. **LaunchDetailPage** - Ready for launch details integration
5. **LaunchNewPage** - Ready for launch creation
6. **AnalyticsPage** - Ready for analytics integration

## Best Practices

1. **Always handle loading and error states**

   ```jsx
   const { data, isLoading, error } = useQuery(...);
   if (isLoading) return <Loading />;
   if (error) return <Error />;
   ```

2. **Use mutations for side effects**

   ```jsx
   const { mutate } = useCreateLaunch();
   mutate(data, { onSuccess: () => {...} });
   ```

3. **Provide user feedback**

   ```jsx
   const { isPending, isError } = useCreateLaunch();
   return (
     <button disabled={isPending}>{isPending ? "Saving..." : "Save"}</button>
   );
   ```

4. **Cache relevant queries together**
   ```jsx
   // Use consistent queryKey patterns
   ["launches", status][("launches", id)]; // for filtered queries // for individual items
   ```

## Next Steps

1. Implement pagination in launches and partners lists
2. Add optimistic updates for better UX
3. Implement real-time updates with Socket.IO
4. Add offline support with TanStack Query persistence
5. Implement search with debouncing
