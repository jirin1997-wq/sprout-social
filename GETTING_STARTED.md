# Sprout Social - Getting Started Guide

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (optional, if running locally)
- Git

### Option 1: Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/jirin1997-wq/sprout-social-overview.git
cd sprout-social-overview

# Copy environment file
cp .env.example .env

# Build and start services
docker-compose up --build
```

**Services will be available at:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Database: localhost:5432

### Option 2: Run Locally

#### 1. Setup Database
```bash
# Install PostgreSQL
# Create database
createdb sprout_social

# Initialize schema
psql sprout_social < backend/src/db/init.sql
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp ../.env.example ../.env
npm run dev
```

#### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

## 📝 First Steps

### 1. Create Account
Visit http://localhost:5173 and sign up:
```
Email: test@example.com
Password: password123
```

### 2. Connect Social Account
- Go to **Settings** → **Integrations**
- Select a social network (Facebook, Instagram, etc.)
- Click "Connect Account"
- Follow OAuth flow

### 3. Create First Post
- Navigate to **Content** → **New Post**
- Write your content
- Select networks to publish to
- Click "Create" to save as draft or "Publish" to publish immediately

### 4. View Analytics
- Go to **Analytics** dashboard
- See real-time metrics:
  - Total followers
  - Impressions
  - Engagement rate
  - Top performing posts

## 📚 API Documentation

### Authentication

**Register:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Posts

**Create Post:**
```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Hello World!",
    "accountIds": ["facebook", "instagram"],
    "status": "draft"
  }'
```

**Get Posts:**
```bash
curl -X GET http://localhost:3000/api/posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Publish Post:**
```bash
curl -X POST http://localhost:3000/api/posts/{postId}/publish \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Analytics

**Dashboard Metrics:**
```bash
curl -X GET http://localhost:3000/api/analytics/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Performance Data:**
```bash
curl -X GET "http://localhost:3000/api/analytics/performance?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Top Posts:**
```bash
curl -X GET http://localhost:3000/api/analytics/top-posts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Messages

**Get Inbox:**
```bash
curl -X GET http://localhost:3000/api/messages/inbox \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Mark as Read:**
```bash
curl -X PUT http://localhost:3000/api/messages/{messageId}/read \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 🗂️ Project Structure

```
sprout-social-overview/
├── backend/                    # Node.js API server
│   ├── src/
│   │   ├── server.js          # Express app
│   │   ├── routes/            # API endpoints
│   │   │   ├── auth.js        # Authentication
│   │   │   ├── posts.js       # Posts management
│   │   │   ├── accounts.js    # Social accounts
│   │   │   ├── analytics.js   # Analytics data
│   │   │   └── messages.js    # Messaging
│   │   ├── middleware/        # Custom middleware
│   │   │   └── auth.js        # Auth middleware
│   │   └── db/
│   │       └── init.sql       # Database schema
│   ├── package.json
│   └── Dockerfile
├── frontend/                   # React application
│   ├── src/
│   │   ├── App.jsx           # Main app component
│   │   ├── pages/            # Page components
│   │   │   ├── LoginPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── ContentPage.jsx
│   │   │   ├── AnalyticsPage.jsx
│   │   │   └── InboxPage.jsx
│   │   ├── components/       # Reusable components
│   │   │   └── Layout.jsx
│   │   ├── hooks/            # Custom hooks
│   │   │   └── useAuth.js
│   │   └── App.css
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml         # Docker orchestration
├── .env.example              # Environment variables template
├── README.md                 # Overview
├── ARCHITECTURE.md           # Technical architecture
├── FEATURES.md              # Detailed features
├── INTEGRATIONS.md          # Third-party integrations
└── DATABASE.md              # Database schema
```

## 🔧 Configuration

### Environment Variables

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DB_USER=postgres
DB_PASSWORD=password
DB_NAME=sprout_social

# Backend
JWT_SECRET=your-secret-key-here

# Social Media OAuth Keys
FACEBOOK_APP_ID=xxx
FACEBOOK_APP_SECRET=xxx
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Check if PostgreSQL is running
docker-compose logs postgres

# Verify connection
psql -U postgres -h localhost -d sprout_social
```

### Port Already in Use
```bash
# Change port in docker-compose.yml or .env
# Or stop other services using the port
lsof -i :5173
lsof -i :3000
kill -9 <PID>
```

### Build Issues
```bash
# Clear Docker cache
docker-compose down
docker system prune -a
docker-compose up --build
```

## 📖 Next Steps

1. **Integrate Social Networks**
   - Set up OAuth credentials for each platform
   - Follow integration guides in INTEGRATIONS.md

2. **Customize Dashboard**
   - Add more widgets
   - Create custom reports
   - Build AI features

3. **Deploy to Production**
   - Set up AWS/GCP/Azure
   - Configure HTTPS
   - Set up monitoring
   - See DEPLOYMENT.md for details

4. **Add More Features**
   - Team collaboration
   - Advanced analytics
   - Content calendar
   - Social listening

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Open pull request

## 📄 License

MIT License - see LICENSE file

## 🆘 Support

- Check existing issues
- Read documentation
- Open new issue with details
- Include error logs and steps to reproduce

---

**Happy social media managing! 🌱**
