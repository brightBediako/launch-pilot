# LaunchPilot Backend API

An AI-powered product launch platform designed for African markets (Nigeria, Ghana, Kenya, South Africa, Egypt).

## Features

- **Authentication** - JWT-based auth with refresh tokens
- **Launch Management** - CRUD operations with AI-powered launch plan generation
- **Content Drafts** - AI-generated content for Product Hunt, Twitter, LinkedIn
- **Partner Marketplace** - Service provider profiles, assignments, and reviews
- **Task Board** - Real-time collaboration with Socket.IO
- **Launch Pages** - Public landing pages with email capture
- **Analytics** - Event tracking and metrics aggregation

## Tech Stack

- **Runtime**: Node.js with Express 5.2.1
- **Database**: MongoDB with Mongoose 9.0.1
- **AI**: Google Gemini (primary), OpenAI GPT-3.5 (fallback), Rule-based templates (final fallback)
- **Real-time**: Socket.IO 4.8.1
- **File Storage**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, express-rate-limit, express-mongo-sanitize, hpp
- **African Market Support**: Timezones (Lagos, Accra), Currencies (NGN, GHS, USD)

## Getting Started

### Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- Cloudinary account
- Google AI API key (Gemini)
- OpenAI API key (optional fallback)
- SMTP server for emails

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
# See Environment Variables section below
```

### Environment Variables

Create a `.env` file with the following:

```env
# Server
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017/launchpilot

# JWT
JWT_KEY=your-secret-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# AI Providers
GOOGLE_AI_API_KEY=your-gemini-api-key
OPENAI_API_KEY=your-openai-api-key

# Email (SMTP)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=LaunchPilot <noreply@launchpilot.com>

# Frontend
FRONTEND_URL=http://localhost:3000

# African Market Settings
DEFAULT_TIMEZONE=Africa/Lagos
DEFAULT_CURRENCY=NGN
```

### Running the Application

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8000`

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

All protected routes require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Endpoints

#### Auth Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login user
- `POST /refresh-token` - Refresh access token
- `GET /me` - Get current user (protected)
- `POST /forgot-password` - Request password reset
- `PATCH /reset-password/:token` - Reset password
- `POST /logout` - Logout user (protected)

#### User Routes (`/api/users`)

- `GET /:id` - Get user profile (protected)
- `PATCH /:id` - Update user profile (protected)
- `POST /:id/avatar` - Upload avatar (protected)
- `DELETE /:id` - Delete user (admin only)

#### Launch Routes (`/api/launches`)

- `POST /` - Create launch (protected)
- `GET /` - Get all launches with filters (protected)
  - Query params: `status`, `market`, `page`, `limit`, `sort`
- `GET /:id` - Get single launch (protected)
- `PATCH /:id` - Update launch (protected)
- `DELETE /:id` - Delete launch (protected)
- `POST /:id/generate-plan` - Generate AI launch plan (protected, rate limited)
- `POST /:id/regenerate-plan` - Regenerate launch plan (protected, rate limited)

#### Draft Routes (`/api/drafts`)

- `POST /` - Create draft (protected)
  - Body param: `generateWithAI: boolean`
- `GET /` - Get drafts by launch (protected)
  - Query param: `launchId` (required)
- `GET /:id` - Get single draft (protected)
- `PATCH /:id` - Update draft (protected)
- `DELETE /:id` - Delete draft (protected)
- `POST /:id/regenerate` - Regenerate with AI (protected, rate limited)
- `POST /:id/publish` - Publish draft (protected)

#### Partner Routes (`/api/partners`)

- `POST /` - Create partner profile (protected)
- `GET /` - Get all partners (public)
  - Query params: `service`, `country`, `minRating`, `availability`, `verified`, `page`, `limit`
- `GET /:id` - Get partner profile (public)
- `PATCH /:id` - Update partner profile (protected)
- `POST /:id/review` - Add review (protected)
- `DELETE /:id` - Delete partner profile (protected)

#### Assignment Routes (`/api/partners`)

- `POST /:partnerId/assignments` - Create assignment (protected)
- `GET /assignments` - Get assignments (protected)
  - Query params: `launchId`, `partnerId`, `status`, `page`, `limit`
- `PATCH /assignments/:id/status` - Update status (protected)
- `POST /assignments/:id/communication` - Add message (protected)
- `POST /assignments/:id/review` - Submit review (protected)

#### Task Routes (`/api/tasks`)

- `POST /` - Create task (protected)
- `GET /` - Get tasks (protected)
  - Query params: `launchId` (required), `status`, `assignedTo`, `page`, `limit`
- `GET /:id` - Get single task (protected)
- `PATCH /:id` - Update task (protected)
- `DELETE /:id` - Delete task (protected)
- `PATCH /:id/position` - Reorder task (protected)
- `POST /:id/comments` - Add comment (protected)

#### Launch Page Routes (`/api/launch-pages`)

- `POST /` - Create launch page (protected)
- `GET /:slug` - Get by slug (public)
- `GET /id/:id` - Get by ID (protected)
- `PATCH /:id` - Update launch page (protected)
- `POST /:id/publish` - Publish page (protected)
- `POST /:slug/subscribe` - Subscribe to page (public, rate limited)
- `GET /:id/subscribers` - Get subscribers (protected)
- `POST /:id/notify` - Notify all subscribers (protected)

#### Analytics Routes (`/api/analytics`)

- `POST /events` - Track event (protected)
- `GET /launches/:id` - Get launch analytics (protected)
  - Query params: `days` (default: 30), `groupBy` (default: day)
- `GET /dashboard` - Get dashboard analytics (protected)

### Rate Limits

- **Auth endpoints**: 5 requests / 15 minutes
- **AI endpoints**: 20 requests / hour
- **API endpoints**: 100 requests / 15 minutes
- **Public endpoints**: 10 requests / hour

## Real-time Features (Socket.IO)

### Connection

```javascript
const socket = io("http://localhost:8000", {
  auth: {
    token: "your-jwt-token",
  },
});
```

### Events

**Client → Server**

- `join:launch` - Join launch room
- `leave:launch` - Leave launch room

**Server → Client**

- `task:created` - New task created
- `task:updated` - Task updated
- `task:deleted` - Task deleted
- `comment:added` - Comment added to task
- `launch:updated` - Launch updated

## AI Features

### Dual Provider Strategy

1. **Primary**: Google Gemini (gemini-pro model)
2. **Fallback**: OpenAI (GPT-3.5-turbo)
3. **Final Fallback**: Rule-based templates

### AI-Powered Features

- **Launch Plan Generation**: 6-phase execution plan with market-specific strategies
- **Content Drafts**: Platform-optimized content for Product Hunt, Twitter, LinkedIn
- **African Market Context**: All AI prompts include mobile-first, cost-effective strategies

## African Market Features

### Supported Countries

- 🇳🇬 Nigeria (NG) - Lagos timezone (GMT+1), Naira (₦)
- 🇬🇭 Ghana (GH) - Accra timezone (GMT+0), Cedi (GH₵)
- 🇰🇪 Kenya (KE) - Nairobi timezone (GMT+3), Shilling (KSh)
- 🇿🇦 South Africa (ZA) - Rand (R)
- 🇪🇬 Egypt (EG) - Pound (E£)

### Currencies

All monetary values support:

- NGN (Naira) - stored in kobo (smallest unit)
- GHS (Cedi) - stored in pesewa
- USD (Dollar) - stored in cents
- KES, ZAR, EGP

### Timezones

- Africa/Lagos (GMT+1)
- Africa/Accra (GMT+0)
- Africa/Nairobi (GMT+3)
- UTC

## Scheduled Jobs

### Daily Analytics Aggregation

Runs every day at midnight GMT:

- Aggregates events into daily metrics
- Calculates conversion rates
- Updates LaunchMetrics collection

## Database Models

- **User** - Authentication and profile
- **Profile** - Extended user information
- **Launch** - Product launch entity
- **LaunchPlan** - AI-generated launch plans
- **ContentDraft** - Social media content
- **Partner** - Service provider profiles
- **PartnerAssignment** - Launch-partner engagements
- **Task** - Collaboration tasks
- **LaunchPage** - Public landing pages
- **EmailSubscriber** - Email list
- **Event** - Analytics events
- **LaunchMetrics** - Daily aggregated metrics

## Security Features

- JWT authentication with refresh tokens
- Password hashing with bcrypt (12 salt rounds)
- Rate limiting on all endpoints
- Helmet.js for HTTP headers
- MongoDB injection prevention
- HPP (HTTP Parameter Pollution) protection
- CORS configuration
- Input validation with express-validator

## Error Handling

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "stack": "Stack trace (development only)"
}
```

Success responses:

```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

## Development

### Project Structure

```
api/
├── app/
│   └── app.js              # Express app configuration
├── config/
│   ├── dbConnect.js        # MongoDB connection
│   └── fileUpload.js       # Cloudinary + Multer setup
├── controllers/            # Request handlers
├── middleware/             # Auth, validation, rate limiting
├── models/                 # Mongoose schemas
├── routes/                 # API routes
├── services/               # Business logic (AI, email, analytics)
├── utils/                  # Helpers (date, currency, logger)
├── logs/                   # Winston logs (production)
└── server.js               # Server entry point
```

### Code Style

- ES6 modules (`import`/`export`)
- Async/await for asynchronous operations
- JSDoc comments for all functions
- Consistent error handling with try/catch
- Response format: `{ success, message, data }`

## Testing

⚠️ Testing not yet implemented. Planned for future release.

## Deployment

### Production Checklist

1. Set `NODE_ENV=production`
2. Use strong JWT_KEY
3. Configure MongoDB with authentication
4. Setup HTTPS/SSL
5. Configure firewall rules
6. Setup monitoring (logs, errors)
7. Enable MongoDB backups
8. Configure CDN for Cloudinary
9. Setup email service (SendGrid, AWS SES, etc.)

### Environment-specific Behavior

**Development**

- Detailed error messages with stack traces
- Morgan HTTP logging in "dev" format
- CORS allows all origins

**Production**

- Error messages without stack traces
- Morgan logs to files via Winston
- CORS restricted to FRONTEND_URL
- File logging enabled (logs/error.log, logs/combined.log)

## Troubleshooting

### Common Issues

**MongoDB Connection Failed**

- Check MONGO_URI in .env
- Ensure MongoDB is running
- Check network connectivity

**AI Generation Fails**

- Verify API keys (GOOGLE_AI_API_KEY, OPENAI_API_KEY)
- Check rate limits on AI providers
- System falls back to rule-based templates automatically

**Socket.IO Connection Issues**

- Ensure JWT token is valid
- Check CORS configuration
- Verify Socket.IO client version compatibility

**Email Not Sending**

- Verify SMTP credentials in .env
- Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS
- For Gmail, use App Password, not regular password

## License

Proprietary - All rights reserved

## Support

For issues and questions, contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: 2024
