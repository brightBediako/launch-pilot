# Changelog - API Improvements

## [Unreleased] - 2024

### Security Improvements
- ✅ **Refresh Token Security**: Refresh tokens are now hashed using bcrypt before storing in database (similar to passwords)
- ✅ **Password Reset Security**: Removed password reset token from API response. Tokens are now only sent via email
- ✅ **Email Integration**: Integrated password reset email sending via emailService
- ✅ **Request ID Tracking**: Added request ID middleware for request correlation and debugging

### Performance Improvements
- ✅ **N+1 Query Fix**: Optimized `getLaunch` endpoint to fetch launch and plan in parallel using `Promise.all()`
- ✅ **Parallel Deletion**: Launch deletion now uses parallel operations for better performance
- ✅ **AI Service Timeouts**: Added 30-second timeout (configurable via `AI_TIMEOUT_MS`) for AI API calls
- ✅ **AI Service Retry Logic**: Implemented exponential backoff retry (2 retries) for AI API calls

### Code Quality Improvements
- ✅ **Custom Error Classes**: Created standardized error classes (`AppError`, `ValidationError`, `AuthenticationError`, etc.)
- ✅ **Error Handling**: Updated global error handler to use custom error classes with error codes
- ✅ **Logging Consistency**: Replaced all `console.log`/`console.error` with Winston logger throughout codebase
- ✅ **Code Deduplication**: Extracted shared logic from `generatePlan` and `regeneratePlan` into `planService.generateAndSavePlan()`
- ✅ **Authorization Middleware**: Created reusable authorization middleware (`requireOwnership`, `requireOwnershipOrCollaboration`)

### New Features
- ✅ **Health Check Endpoint**: Added `/health` endpoint with service status checks (database, AI services, Cloudinary, email)
- ✅ **Readiness Probe**: Added `/health/ready` endpoint for Kubernetes/Docker health checks
- ✅ **Liveness Probe**: Added `/health/live` endpoint for Kubernetes/Docker liveness checks
- ✅ **Environment Validation**: Added startup validation for required environment variables with helpful error messages

### Database Improvements
- ✅ **Transaction Support**: Added MongoDB transaction support for multi-step operations:
  - User registration (user + profile creation)
  - Launch deletion (launch + plan deletion)

### API Improvements
- ✅ **Request ID Headers**: All responses now include `X-Request-ID` header for request tracking
- ✅ **Error Codes**: All error responses now include `errorCode` field for programmatic error handling
- ✅ **Improved Error Messages**: More descriptive error messages with context

### Breaking Changes
- ⚠️ **Refresh Token Storage**: Refresh tokens are now hashed. Existing refresh tokens will be invalidated on next login/refresh
- ⚠️ **Password Reset**: Password reset tokens are no longer returned in API response. Must use email link

### Migration Notes
- Users will need to re-authenticate after deployment (refresh tokens will be invalidated)
- Password reset flow now requires email service to be configured
- Environment variables are now validated at startup - ensure all required vars are set

### Configuration
- New optional environment variable: `AI_TIMEOUT_MS` (default: 30000ms)
- Environment validation now provides helpful warnings for optional services (AI, Cloudinary, Email)

---

## Next Steps (Recommended)
- [ ] Add Redis for distributed rate limiting
- [ ] Implement API versioning (`/api/v1/*`)
- [ ] Add field selection query parameters
- [ ] Implement cursor-based pagination
- [ ] Add request/response logging middleware
- [ ] Add unit and integration tests
- [ ] Implement caching layer (Redis)
- [ ] Add metrics collection (Prometheus)

