# 🧪 Testing & Verification Guide

## Pre-Flight Checklist

### ✅ Backend

- [ ] Backend running on `http://localhost:8000`
- [ ] MongoDB connected
- [ ] All environment variables set
- [ ] No console errors

### ✅ Frontend

- [ ] Frontend running on `http://localhost:5174`
- [ ] No build errors
- [ ] All pages accessible
- [ ] Console is clean

---

## 🚀 Quick Test

### 1. Open Browser DevTools

```
F12 or Right-click → Inspect
```

### 2. Go to Network Tab

```
Click Network tab
```

### 3. Navigate to Dashboard

```
Go to http://localhost:5174/dashboard
```

### 4. Check Network Requests

```
Should see GET /api/launches request
Status should be 200 OK
Response should contain launch data
```

### 5. Verify Data Display

```
Should see loading spinner briefly
Should show launches with real data
Should display stats (Active, Planning, etc.)
```

---

## 📋 Detailed Test Cases

### Test 1: Data Fetching

**URL**: `http://localhost:5174/dashboard`

**Steps**:

1. Open page
2. Watch for loading spinner
3. Wait for data to load
4. Verify launches display with correct data

**Expected**:

- Loading spinner appears for 0.5-1 second
- Launches display with titles, descriptions, progress
- Stats show correct counts
- No errors in console

**Network**:

- Request: `GET /api/launches`
- Status: `200 OK`
- Response time: <1 second

---

### Test 2: Error Handling

**Steps**:

1. Stop backend API (kill process or disconnect network)
2. Refresh dashboard page
3. Wait for loading to complete

**Expected**:

- Loading spinner appears
- Error message displays
- "Using local data" message shown
- Falls back to mock launches
- No console errors

---

### Test 3: Filtering

**URL**: `http://localhost:5174/launches`

**Steps**:

1. Open page
2. Wait for launches to load
3. Click "active" status filter
4. Verify filtered results

**Expected**:

- All launches appear initially
- Filter buttons show counts
- Clicking filter updates list
- Only matching launches display
- No page reload needed

---

### Test 4: Loading States

**URL**: `http://localhost:5174/launches`

**Steps**:

1. Open DevTools Network tab
2. Throttle to "Slow 3G"
3. Refresh page
4. Watch loading behavior

**Expected**:

- Loading spinner displays
- Page doesn't freeze
- Can still interact
- Loading spinner disappears when done

**Disable Throttling**:

- Click Network dropdown
- Select "No throttling"

---

### Test 5: Cache Behavior

**URL**: `http://localhost:5174/launches`

**Steps**:

1. Load page (network request made)
2. Navigate away (to /dashboard)
3. Navigate back to /launches
4. Watch Network tab

**Expected**:

- First load: Network request made
- Navigate away and back: No new request (cache hit)
- Data appears instantly
- After 5 minutes: New request made automatically

---

### Test 6: Authentication

**URL**: `http://localhost:5174/login`

**Steps**:

1. Open page
2. Login with valid credentials
3. Navigate to /dashboard
4. Check Network tab

**Expected**:

- Login succeeds
- Token stored in localStorage
- All API requests have `Authorization` header
- Access token and refresh token present

**Check Token**:

1. Open DevTools → Application tab
2. Click LocalStorage
3. Look for `accessToken` and `refreshToken`

---

### Test 7: API Endpoints (Manual Testing)

#### Using cURL

```bash
# Get current user (requires token)
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get launches
curl http://localhost:8000/api/launches \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get filtered launches
curl "http://localhost:8000/api/launches?status=active" \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get partners
curl http://localhost:8000/api/partners \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Using Postman

1. Open Postman
2. Create new request
3. Set method to GET
4. Set URL to `http://localhost:8000/api/launches`
5. Go to Headers tab
6. Add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN`
7. Click Send

---

## 🔍 Debugging Tips

### Check Hook State

```javascript
// In browser console
// Open page that uses useLaunches hook
// Then:
const component = document.querySelector('[data-testid="dashboard"]');
// Check React DevTools to see hook state
```

### Monitor Network

1. Open DevTools → Network tab
2. Filter by XHR (XMLHttpRequest)
3. Look for `/api/` requests
4. Click request to see details:
   - Headers
   - Payload
   - Response
   - Timing

### View Cache

1. Install React Query DevTools extension
2. Look for floating devtools button
3. Expand "Queries" section
4. See all cached queries
5. View cache contents
6. Force refetch if needed

### Console Logging

```javascript
// Add to component
const { data, isLoading, error } = useLaunches();

useEffect(() => {
  console.log("Data:", data);
  console.log("Loading:", isLoading);
  console.log("Error:", error);
}, [data, isLoading, error]);
```

---

## 🐛 Common Issues & Solutions

### Issue: "Failed to resolve import"

**Solution**:

```bash
cd client
npm install
npm run dev
```

### Issue: "Cannot GET /api/launches"

**Solution**:

1. Check backend is running: `http://localhost:8000`
2. Check API_BASE_URL in apiClient.js
3. Check .env.local has correct VITE_API_URL

### Issue: "401 Unauthorized"

**Solution**:

1. Check token in localStorage
2. Check token is valid (not expired)
3. Try logging out and back in
4. Check Authorization header is being sent

### Issue: "No launches appearing"

**Solution**:

1. Check Network tab for errors
2. Check response data format
3. Verify API returns launches
4. Check useLaunches hook is imported

### Issue: Loading spinner never stops

**Solution**:

1. Check browser Network tab
2. Look for errors (404, 500, etc.)
3. Check API response time
4. Check for infinite loops
5. Reduce network throttling

### Issue: Data not updating after create

**Solution**:

1. Check mutation response status
2. Verify cache invalidation happening
3. Check useCreateLaunch hook onSuccess
4. Manual refetch: `queryClient.invalidateQueries({ queryKey: ['launches'] })`

---

## ✅ Verification Checklist

### Visual Checks

- [ ] Page loads without errors
- [ ] Loading spinner appears briefly
- [ ] Data displays correctly
- [ ] Filters work as expected
- [ ] No layout shifts
- [ ] Responsive on mobile/tablet
- [ ] Colors match design
- [ ] Text is readable

### Network Checks

- [ ] API requests complete in <1s
- [ ] Status codes are 200 OK
- [ ] Headers include Authorization
- [ ] Response data matches expected format
- [ ] No 404 errors
- [ ] No 401 auth errors
- [ ] Cache-Control headers present

### Functional Checks

- [ ] Can fetch data
- [ ] Can filter data
- [ ] Can sort data
- [ ] Can create items
- [ ] Can update items
- [ ] Can delete items
- [ ] Error handling works
- [ ] Fallback data works

### Performance Checks

- [ ] Page loads quickly (<2s)
- [ ] No unnecessary network requests
- [ ] Cache hits are instant
- [ ] No memory leaks
- [ ] Smooth animations
- [ ] No console warnings

### Security Checks

- [ ] Token sent in every request
- [ ] Token never exposed in logs
- [ ] CORS properly configured
- [ ] No sensitive data in localStorage except token
- [ ] Auto-logout on token expire

---

## 🎯 Test All Pages

### Dashboard Page

```
URL: http://localhost:5174/dashboard
Expected: Shows launches from API with stats
Network: GET /api/launches
Status: ✅ Integration complete
```

### Launches Page

```
URL: http://localhost:5174/launches
Expected: Shows all launches with filtering
Network: GET /api/launches?status=...
Status: ✅ Integration complete
```

### Partners Page

```
URL: http://localhost:5174/partners
Expected: Shows partners with filtering
Network: GET /api/partners
Status: ✅ Integration complete
```

### Launch Detail Page

```
URL: http://localhost:5174/launches/id
Expected: Shows single launch details
Network: GET /api/launches/id
Status: 🟡 Ready for integration
Todo: Add useLaunchDetail(id) and useTasks(id)
```

### Create Launch Page

```
URL: http://localhost:5174/launches/new
Expected: Form to create launch
Network: POST /api/launches
Status: 🟡 Ready for integration
Todo: Add useCreateLaunch() mutation
```

### Analytics Page

```
URL: http://localhost:5174/analytics
Expected: Shows analytics charts
Network: GET /api/launches/id/analytics
Status: 🟡 Ready for integration
Todo: Add useLaunchAnalytics(id)
```

---

## 📊 Performance Testing

### Lighthouse

1. Open DevTools
2. Click Lighthouse tab
3. Click "Generate report"
4. Check scores:
   - Performance: >80
   - Accessibility: >90
   - Best Practices: >90
   - SEO: >90

### Network Throttling

1. DevTools → Network
2. Throttle to "Slow 3G"
3. Refresh page
4. Verify still works smoothly
5. Check loading states

### Memory Testing

1. DevTools → Memory
2. Take heap snapshot
3. Perform actions
4. Take another snapshot
5. Compare (should be minimal growth)

---

## 🚀 Deployment Testing

### Production Build

```bash
cd client
npm run build
npm run preview
```

### Check Build Size

```bash
# TanStack Query adds ~35KB gzipped
# Total bundle should be reasonable
npm run build
# Check dist/ folder size
```

### Test in Production Build

1. Run `npm run preview`
2. Visit `http://localhost:4173`
3. Test all features
4. Check Network tab
5. Verify no errors

---

## 📈 Success Criteria

All tests pass if:

- ✅ Data loads from API
- ✅ Loading states appear
- ✅ Error states work
- ✅ Fallback data loads
- ✅ No console errors
- ✅ Cache works (5 min)
- ✅ Filters work
- ✅ Auth headers present
- ✅ Responsive layout
- ✅ Performance >80
- ✅ <1 second API response
- ✅ All network requests 200 OK

---

## 🎉 You're Done!

If all tests pass, your API integration is complete and ready for:

- Additional features
- Advanced integrations
- Production deployment
- Team usage
- Real user testing

---

**Test Date**: December 25, 2025
**Status**: Ready for testing
**Expected Time**: 30 minutes for full verification
