# LaunchPilot Quick Start Guide

## Prerequisites

- Node.js >= 16.x installed
- MongoDB >= 5.x running locally or remote URI
- Cloudinary account ([sign up free](https://cloudinary.com))
- Google AI API key ([get here](https://makersuite.google.com/app/apikey))
- OpenAI API key (optional - [get here](https://platform.openai.com/api-keys))

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd api
npm install
```

### Step 2: Setup Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit .env with your favorite editor
# Minimum required variables:
# - MONGO_URI
# - JWT_KEY (any random string, min 32 chars for production)
# - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
# - GOOGLE_AI_API_KEY
```

### Step 3: Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:

```
Server is up and running on port 8000
Socket.IO initialized
Environment: development
```

## Testing the API

### 1. Register a User

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "timezone": "Africa/Lagos",
    "currency": "NGN"
  }'
```

Response:

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "profile": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Save the `accessToken` from the response!**

### 3. Create a Launch

```bash
export TOKEN="your-access-token-here"

curl -X POST http://localhost:8000/api/launches \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome Product",
    "description": "A revolutionary mobile app for African markets",
    "productType": "mobile-app",
    "targetDate": "2024-12-31",
    "markets": ["NG", "GH"],
    "budget": {
      "amount": 50000000,
      "currency": "NGN"
    }
  }'
```

### 4. Generate AI Launch Plan

```bash
export LAUNCH_ID="your-launch-id-from-previous-response"

curl -X POST http://localhost:8000/api/launches/$LAUNCH_ID/generate-plan \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "aiProvider": "gemini",
    "temperature": 0.7
  }'
```

This will return a complete 6-phase launch plan! 🎉

### 5. Generate Content Draft

```bash
curl -X POST http://localhost:8000/api/drafts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "launchId": "'$LAUNCH_ID'",
    "platform": "producthunt",
    "generateWithAI": true
  }'
```

## Testing Socket.IO (Real-time Features)

Create an HTML file (`test-socket.html`):

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Socket.IO Test</title>
    <script src="https://cdn.socket.io/4.8.1/socket.io.min.js"></script>
  </head>
  <body>
    <h1>Socket.IO Test</h1>
    <div id="status">Connecting...</div>
    <script>
      const token = "YOUR_ACCESS_TOKEN_HERE";
      const launchId = "YOUR_LAUNCH_ID_HERE";

      const socket = io("http://localhost:8000", {
        auth: { token },
      });

      socket.on("connect", () => {
        document.getElementById("status").innerText = "Connected!";
        socket.emit("join:launch", launchId);
        console.log("Joined launch room:", launchId);
      });

      socket.on("task:created", (task) => {
        console.log("New task created:", task);
      });

      socket.on("task:updated", (task) => {
        console.log("Task updated:", task);
      });

      socket.on("comment:added", (data) => {
        console.log("New comment:", data);
      });

      socket.on("disconnect", () => {
        document.getElementById("status").innerText = "Disconnected";
      });
    </script>
  </body>
</html>
```

Open in browser and check console for real-time events!

## Common Issues & Solutions

### Issue: MongoDB connection failed

**Solution:**

```bash
# Check if MongoDB is running
# On macOS/Linux:
sudo systemctl status mongod

# On Windows:
# Check Services for MongoDB

# Or use MongoDB Atlas (cloud):
# Set MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/launchpilot
```

### Issue: AI generation returns rule-based plan

**Solution:**

- Verify `GOOGLE_AI_API_KEY` in .env
- Check API key is valid at [Google AI Studio](https://makersuite.google.com)
- Check console logs for AI error messages
- Note: System automatically falls back to rule-based templates if AI fails

### Issue: Email not sending

**Solution:**

- For Gmail, use App Password (not regular password)
- Enable "Less secure app access" or use App Passwords
- For production, use SendGrid, AWS SES, or Mailgun
- Check EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env

### Issue: Cloudinary upload fails

**Solution:**

- Verify CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- Check credentials at [Cloudinary Console](https://console.cloudinary.com)
- Ensure file size < 5MB
- Ensure file type is image (jpg, jpeg, png)

### Issue: JWT token expired

**Solution:**

```bash
# Use refresh token endpoint
curl -X POST http://localhost:8000/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your-refresh-token"}'
```

## Environment Variables Explained

| Variable                 | Description                   | Example                                 |
| ------------------------ | ----------------------------- | --------------------------------------- |
| `NODE_ENV`               | Environment mode              | `development` or `production`           |
| `PORT`                   | Server port                   | `8000`                                  |
| `MONGO_URI`              | MongoDB connection string     | `mongodb://localhost:27017/launchpilot` |
| `JWT_KEY`                | Secret for signing JWT tokens | Random string (32+ chars)               |
| `JWT_EXPIRES_IN`         | Access token expiry           | `15m` (15 minutes)                      |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry          | `7d` (7 days)                           |
| `CLOUDINARY_CLOUD_NAME`  | Cloudinary account name       | From Cloudinary dashboard               |
| `CLOUDINARY_API_KEY`     | Cloudinary API key            | From Cloudinary dashboard               |
| `CLOUDINARY_API_SECRET`  | Cloudinary API secret         | From Cloudinary dashboard               |
| `GOOGLE_AI_API_KEY`      | Google Gemini API key         | From Google AI Studio                   |
| `OPENAI_API_KEY`         | OpenAI API key (optional)     | From OpenAI platform                    |
| `EMAIL_HOST`             | SMTP server host              | `smtp.gmail.com`                        |
| `EMAIL_PORT`             | SMTP server port              | `587`                                   |
| `EMAIL_USER`             | SMTP username                 | Your email                              |
| `EMAIL_PASS`             | SMTP password                 | App password                            |
| `EMAIL_FROM`             | Sender email address          | `LaunchPilot <noreply@example.com>`     |
| `FRONTEND_URL`           | Frontend application URL      | `http://localhost:3000`                 |
| `DEFAULT_TIMEZONE`       | Default timezone              | `Africa/Lagos`                          |
| `DEFAULT_CURRENCY`       | Default currency              | `NGN`                                   |

## Next Steps

1. **Frontend Integration**

   - Use the API endpoints from your React/Vue/Angular app
   - Save access token in localStorage/cookie
   - Include `Authorization: Bearer <token>` header in all requests
   - Connect to Socket.IO for real-time features

2. **Customize for Your Market**

   - Update currency helper for additional currencies
   - Add more timezones in dateHelper
   - Customize AI prompts for your target audience
   - Add market-specific features

3. **Production Deployment**

   - See [README.md](README.md) for production checklist
   - Setup MongoDB Atlas for production database
   - Use PM2 for process management
   - Configure NGINX as reverse proxy
   - Setup SSL certificates (Let's Encrypt)
   - Enable logging and monitoring

4. **Add Payment Integration**
   - Implement Paystack SDK for Nigeria
   - Implement Flutterwave SDK for Ghana
   - Add webhook handlers for payment confirmations
   - Update PartnerAssignment model with payment status

## API Documentation

For complete API documentation, see:

- [README.md](README.md) - Full API reference
- [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Technical details

## Support Resources

- **MongoDB Setup**: https://www.mongodb.com/docs/manual/installation/
- **Cloudinary Docs**: https://cloudinary.com/documentation
- **Google AI Studio**: https://makersuite.google.com
- **OpenAI API**: https://platform.openai.com/docs
- **Nodemailer**: https://nodemailer.com/
- **Socket.IO**: https://socket.io/docs/v4/

## Sample .env File

```env
# Server
NODE_ENV=development
PORT=8000

# Database
MONGO_URI=mongodb://localhost:27017/launchpilot

# JWT
JWT_KEY=my-super-secret-jwt-key-change-this-in-production-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-secret-here

# AI Providers
GOOGLE_AI_API_KEY=AIzaSyYourGoogleAIKeyHere
OPENAI_API_KEY=sk-YourOpenAIKeyHere

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
EMAIL_FROM=LaunchPilot <noreply@launchpilot.com>

# Frontend
FRONTEND_URL=http://localhost:3000

# African Market Settings
DEFAULT_TIMEZONE=Africa/Lagos
DEFAULT_CURRENCY=NGN
```

---

**You're all set! Start building amazing products for African markets! 🚀**

For questions or issues, check the main [README.md](README.md) or [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md).
