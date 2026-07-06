# Sprout Social - Technická Architektura

## 🏗️ Systémová Architektura

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  │
│  │  Web Dashboard   │  │  Mobile App      │  │  Slack/Teams Bot │  │
│  │  (React/Vue)     │  │  (React Native)  │  │  (ChatBot)       │  │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      API GATEWAY LAYER                              │
│  ┌────────────────────────────────────────────────────────────────┐ │
│  │  Load Balancer (nginx/HAProxy)                                 │ │
│  │  - Request routing                                             │ │
│  │  - Rate limiting                                               │ │
│  │  - DDoS protection                                             │ │
│  │  - CORS handling                                               │ │
│  └────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    MICROSERVICES LAYER                               │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Content Service  │  │ Analytics Service│  │ Community Service│   │
│  │ - Post creation  │  │ - Metrics calc   │  │ - Messages       │   │
│  │ - Scheduling     │  │ - Reports        │  │ - Comments       │   │
│  │ - Publishing     │  │ - Benchmarking   │  │ - Moderation     │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ Listening Service│  │  Engagement Srv  │  │  Auth Service    │   │
│  │ - Monitoring     │  │ - AI Responses   │  │ - User auth      │   │
│  │ - Sentiment API  │  │ - Recommendations│  │ - OAuth 2.0      │   │
│  │ - Alerts         │  │ - Automation     │  │ - SSO            │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
                    ▼            ▼            ▼
┌──────────────────────────────────────────────────────────────────────┐
│                    DATA ACCESS LAYER                                 │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │ PostgreSQL       │  │ Redis Cache      │  │ Elasticsearch    │   │
│  │ Primary Database │  │ Session, Cache   │  │ Full-text Search │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │ S3 Storage - Images, Videos, Assets                          │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
                                 │
                    ┌────────────┼────────────────────┐
                    │            │                    │
                    ▼            ▼                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                  EXTERNAL INTEGRATIONS LAYER                         │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Social Media APIs                                              │  │
│  │ Facebook Graph API | Instagram Graph API | Twitter API v2     │  │
│  │ LinkedIn API | TikTok API | Pinterest API | YouTube API       │  │
│  └────────────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │ Third-Party Services                                           │  │
│  │ Salesforce | HubSpot | Zapier | Slack | Microsoft Teams       │  │
│  └────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘
```

## 📦 Komponenty

### 1. Content Service
**Odpovědnost:** Správa vytváření, plánování a publikování obsahu

**Key Features:**
- Post builder s preview
- Content calendar (Editorial Calendar)
- Scheduling engine
- Cross-posting na více sítě
- Workflow approval system

**Technologie:**
- Node.js/Express nebo Python/Django
- Job Queue (Bull/Celery)
- Cron scheduler

**Database:**
- Posts table
- Scheduled_posts table
- Approvals table

### 2. Analytics Service
**Odpovědnost:** Sběr, zpracování a zobrazení analytických dat

**Key Features:**
- Real-time metrics aggregation
- Custom dashboard builder
- Report generation
- Benchmarking
- Forecasting

**Technologie:**
- Apache Spark / Apache Flink pro stream processing
- Data warehouse (Redshift / BigQuery)
- BI Tool (Tableau, Superset)

**Database:**
- Metrics table
- Aggregated_metrics (hourly, daily, weekly)
- Reports table

### 3. Community Service
**Odpovědnost:** Správa zpráv, komentářů a interakcí

**Key Features:**
- Unified inbox
- Comment management
- Message routing
- Moderation tools
- Interaction tracking

**Technologie:**
- Real-time messaging (WebSocket)
- Message queue (RabbitMQ, Kafka)

**Database:**
- Messages table
- Comments table
- Interactions table

### 4. Listening Service
**Odpovědnost:** Monitoring a sentiment analýza

**Key Features:**
- Keyword monitoring
- Competitor tracking
- Sentiment analysis
- Trend detection
- Alert system

**Technologie:**
- NLP/ML Models (spaCy, BERT)
- Stream processing
- Full-text search (Elasticsearch)

**Database:**
- Mentions table
- Alerts table
- Sentiment_analysis table

### 5. Engagement Service
**Odpovědnost:** AI-powered engagement a automatizace

**Key Features:**
- Auto-reply system
- Chatbot
- Content recommendations
- Best time to post
- Hashtag suggestions

**Technologie:**
- ML Models
- NLP
- Predictive analytics

### 6. Authentication Service
**Odpovědnost:** User management a security

**Key Features:**
- User authentication
- OAuth 2.0 integration
- SSO
- Role-based access control (RBAC)
- API key management

**Technologie:**
- JWT tokens
- OAuth 2.0
- LDAP/AD integration

## 🗄️ Datový Model

### Klíčové Tabulky

```sql
-- Accounts
CREATE TABLE accounts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  platform VARCHAR(50),
  platform_account_id VARCHAR(255),
  account_name VARCHAR(255),
  access_token VARCHAR(1024),
  refresh_token VARCHAR(1024),
  token_expires_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT,
  scheduled_at TIMESTAMP,
  published_at TIMESTAMP,
  status VARCHAR(50), -- draft, scheduled, published
  accounts_json JSONB, -- array of account IDs
  media_attachments JSONB, -- images, videos
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Metrics
CREATE TABLE metrics (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id),
  post_id UUID REFERENCES posts(id),
  metric_type VARCHAR(100), -- impressions, reach, engagement
  value BIGINT,
  recorded_at TIMESTAMP,
  created_at TIMESTAMP
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  account_id UUID REFERENCES accounts(id),
  sender_id VARCHAR(255),
  sender_name VARCHAR(255),
  content TEXT,
  message_type VARCHAR(50), -- dm, comment, mention
  platform VARCHAR(50),
  platform_message_id VARCHAR(255),
  status VARCHAR(50), -- unread, read, responded
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Approvals
CREATE TABLE approvals (
  id UUID PRIMARY KEY,
  post_id UUID REFERENCES posts(id),
  requested_by UUID REFERENCES users(id),
  assigned_to UUID REFERENCES users(id),
  status VARCHAR(50), -- pending, approved, rejected
  comment TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## 🔄 API Endpoints

### Content Management
```
POST   /api/v1/posts              - Create post
GET    /api/v1/posts              - List posts
GET    /api/v1/posts/:id          - Get post
PUT    /api/v1/posts/:id          - Update post
DELETE /api/v1/posts/:id          - Delete post
POST   /api/v1/posts/:id/publish  - Publish post
POST   /api/v1/posts/:id/schedule - Schedule post
```

### Analytics
```
GET    /api/v1/analytics/metrics     - Get metrics
GET    /api/v1/analytics/reports     - Get reports
GET    /api/v1/analytics/benchmarks  - Compare vs competitors
POST   /api/v1/analytics/dashboard   - Create custom dashboard
```

### Community
```
GET    /api/v1/messages/inbox        - Get messages
POST   /api/v1/messages/:id/reply    - Reply to message
GET    /api/v1/comments              - Get comments
POST   /api/v1/comments/:id/approve  - Approve comment
```

### Listening
```
POST   /api/v1/listening/keywords    - Add keyword monitoring
GET    /api/v1/listening/mentions    - Get mentions
GET    /api/v1/listening/sentiment   - Get sentiment analysis
```

## 🔐 Security Architecture

### Authentication Flow
```
1. User login -> Auth Service
2. Auth Service validates credentials
3. JWT token issued with expiry
4. Refresh token stored in httpOnly cookie
5. All API requests include Authorization header
```

### OAuth Flow (Social Networks)
```
1. User clicks "Connect Account"
2. Redirect to social network OAuth
3. User authorizes app
4. OAuth callback to our server
5. Exchange code for access token
6. Store encrypted token in database
7. Use token for API calls
```

### Role-Based Access Control (RBAC)
```
- Admin: Full access to account and team
- Manager: Can create/approve content, view analytics
- Team Member: Can create content, moderate
- Viewer: Read-only access
```

## 🚀 Deployment Architecture

### Container Orchestration
```
Kubernetes Cluster
├── Namespace: production
│   ├── Content Service Deployment (3 replicas)
│   ├── Analytics Service Deployment (3 replicas)
│   ├── Community Service Deployment (3 replicas)
│   ├── Listening Service Deployment (2 replicas)
│   ├── Auth Service Deployment (2 replicas)
│   ├── PostgreSQL StatefulSet
│   ├── Redis StatefulSet
│   └── Elasticsearch StatefulSet
└── ConfigMaps & Secrets for config
```

### CI/CD Pipeline
```
1. Push to git
2. Automated tests
3. Code coverage check
4. Security scanning
5. Build Docker images
6. Push to Docker registry
7. Deploy to staging
8. Run smoke tests
9. Deploy to production with blue-green strategy
```

## 📊 Monitoring & Observability

### Metrics Collection
- Prometheus for metrics
- Grafana for dashboards
- Alert Manager for notifications

### Logging
- ELK Stack (Elasticsearch, Logstash, Kibana)
- Centralized logging across all services
- Log aggregation and analysis

### Tracing
- Jaeger for distributed tracing
- Understand service-to-service calls
- Performance bottleneck identification

## 🔄 Data Flow Examples

### Content Publishing Flow
```
1. User creates post in UI
2. POST /api/v1/posts -> Content Service
3. Post stored in PostgreSQL
4. If scheduling: Add to scheduling queue
5. At scheduled time: Job runs
6. Content Service calls social media APIs
7. Response from APIs stored
8. Metrics collection job triggered
```

### Real-time Messaging Flow
```
1. New message arrives from social network
2. Webhook received from social platform
3. Message Service processes and stores
4. Real-time event pushed via WebSocket
5. UI updates in real-time
6. User can see and respond to message
```

---

**Architektura verze:** 1.0  
**Poslední update:** Červenec 2026
