# Quick Reference - API Integration

## 🚀 Quick Start

### Using Data in Components

```jsx
import { useLaunches, useCreateLaunch } from "../hooks/useQueries";

export default function MyComponent() {
  // Fetch data
  const { data: launches, isLoading, error } = useLaunches();

  // Create data
  const { mutate: createLaunch, isPending } = useCreateLaunch();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div>
      {launches.map((launch) => (
        <div key={launch._id}>
          <h2>{launch.title}</h2>
          <p>{launch.description}</p>
        </div>
      ))}
    </div>
  );
}
```

## 📚 Common Patterns

### Fetching with Filters

```jsx
const { data } = useLaunches({ status: "active" });
const { data } = usePartners({ service: "Design" });
```

### Handling Mutations

```jsx
const { mutate, isPending, isError } = useCreateLaunch();

const handleSubmit = (formData) => {
  mutate(formData, {
    onSuccess: (data) => {
      console.log("Success!", data);
    },
    onError: (error) => {
      console.error("Failed:", error.message);
    },
  });
};
```

### Manual Cache Invalidation

```jsx
import { useQueryClient } from "@tanstack/react-query";

const queryClient = useQueryClient();

// Invalidate launches list
queryClient.invalidateQueries({ queryKey: ["launches"] });

// Invalidate specific launch
queryClient.invalidateQueries({ queryKey: ["launches", launchId] });
```

### Refetching Data

```jsx
const { refetch } = useLaunches();

const handleRefresh = () => {
  refetch();
};
```

## 🔌 Hook Reference

| Hook                      | Purpose         | Example                                              |
| ------------------------- | --------------- | ---------------------------------------------------- |
| `useLaunches()`           | Get launches    | `useLaunches({ status: 'active' })`                  |
| `useLaunchDetail()`       | Get one launch  | `useLaunchDetail(id)`                                |
| `useCreateLaunch()`       | Create launch   | `mutate(data)`                                       |
| `useUpdateLaunch()`       | Update launch   | `mutate({ launchId, data })`                         |
| `useDeleteLaunch()`       | Delete launch   | `mutate(launchId)`                                   |
| `usePartners()`           | Get partners    | `usePartners({ service: 'Design' })`                 |
| `usePartnerDetail()`      | Get one partner | `usePartnerDetail(id)`                               |
| `useTasks()`              | Get tasks       | `useTasks(launchId)`                                 |
| `useCreateTask()`         | Create task     | `mutate({ launchId, taskData })`                     |
| `useUpdateTask()`         | Update task     | `mutate({ launchId, taskId, data })`                 |
| `useLaunchAnalytics()`    | Get analytics   | `useLaunchAnalytics(launchId)`                       |
| `useGenerateContent()`    | AI content      | `mutate({ launchId, contentType, context })`         |
| `useGenerateLaunchPlan()` | AI plan         | `mutate({ productName, description, targetMarket })` |
| `useCurrentUser()`        | Current user    | `useCurrentUser()`                                   |
| `useUpdateProfile()`      | Update profile  | `mutate(userData)`                                   |

## 🛠️ Common Tasks

### Show Loading While Fetching

```jsx
{
  isLoading && <LoadingSpinner />;
}
{
  !isLoading && data && <Content data={data} />;
}
```

### Handle Errors Gracefully

```jsx
{
  error && (
    <div className="error">
      <p>Failed to load: {error.message}</p>
      <button onClick={() => refetch()}>Try Again</button>
    </div>
  );
}
```

### Disable Button While Saving

```jsx
<button disabled={isPending}>{isPending ? "Saving..." : "Save"}</button>
```

### Auto-refresh on Success

```jsx
const { mutate } = useCreateLaunch();

mutate(data, {
  onSuccess: () => {
    // Automatically invalidated by the hook
    // Launches list will refresh automatically
  },
});
```

### Chain Multiple Requests

```jsx
const { mutate: createLaunch } = useCreateLaunch();

mutate(launchData, {
  onSuccess: (newLaunch) => {
    // Now create a task for the new launch
    createTask({ launchId: newLaunch._id, taskData });
  },
});
```

## 🔍 Debugging

### Log Query State

```jsx
const query = useLaunches();
console.log("Data:", query.data);
console.log("Loading:", query.isLoading);
console.log("Error:", query.error);
console.log("Status:", query.status); // 'idle' | 'pending' | 'error' | 'success'
```

### View Cache in DevTools

```jsx
// Install React Query DevTools
npm install @tanstack/react-query-devtools

// Add to App.jsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  {/* Your app */}
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>
```

### Enable Logging

```jsx
const queryClient = new QueryClient({
  logger: console,
  defaultOptions: {
    queries: { retry: false },
  },
});
```

## 📡 API Response Format

Backend returns:

```json
{
  "success": true,
  "data": {
    /* actual data */
  },
  "message": "Success message"
}
```

Hooks automatically extract the `data` field.

## 🚨 Common Errors

### "Query key must be an array"

❌ Wrong: `useQuery('launches')`
✅ Correct: `useQuery({ queryKey: ['launches'] })`

### "Cannot read property of undefined"

Always check loading state first:

```jsx
if (isLoading) return <Loading />;
if (!data) return <Empty />;
```

### "Token expired"

Handled automatically by API client:

- Refreshes token on 401
- Re-sends request with new token
- Falls back to login if refresh fails

## 💾 Data Persistence

Current setup:

- 5 minute stale time (when data becomes stale)
- 10 minute cache time (when data is garbage collected)
- Auto-refetch on window focus
- Manual refetch with `refetch()`

## 🔐 Authentication

All requests automatically include:

```
Authorization: Bearer <jwt_token>
```

Token is refreshed automatically on:

- 401 responses
- Component mounts (if token stored)

## 📊 Performance Tips

1. **Use filters** to reduce data size

   ```jsx
   useLaunches({ status: "active" }); // Smaller than all launches
   ```

2. **Don't refetch too often**

   ```jsx
   // Good - uses cache for 5 minutes
   useLaunches();

   // Bad - fetches every render
   useEffect(() => {
     fetchData();
   }, []);
   ```

3. **Pagination coming soon**
   ```jsx
   // Future: useLaunchesInfinite()
   // For large datasets
   ```

## 🧪 Testing Tips

Mock hooks in tests:

```jsx
jest.mock("../hooks/useQueries", () => ({
  useLaunches: () => ({
    data: mockLaunches,
    isLoading: false,
    error: null,
  }),
}));
```

## 📞 Support

- Check `API_INTEGRATION.md` for detailed docs
- Check `INTEGRATION_CHECKLIST.md` for implementation status
- Check `useQueries.js` for hook implementations
- Check `apiClient.js` for API configuration

---

**Version**: 1.0
**Last Updated**: December 25, 2025
