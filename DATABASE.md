# Sprout Social - Datový Model

## 🗄️ Databázové Schéma

### Entitní Diagram (ER Diagram)

```
┌─────────────┐
│    Users    │
├─────────────┤
│ id (PK)     │
│ email       │
│ name        │
│ password    │
│ avatar_url  │
│ created_at  │
└──────┬──────┘
       │
       │1:N
       │
    ┌──────────────┐
    │  Teams       │
    ├──────────────┤
    │ id (PK)      │
    │ name         │
    │ owner_id (FK)│
    │ created_at   │
    └──────┬───────┘
           │1:N
           │
    ┌────────────────┐
    │ TeamMembers    │
    ├────────────────┤
    │ id (PK)        │
    │ team_id (FK)   │
    │ user_id (FK)   │
    │ role           │
    └────────────────┘

┌──────────────┐
│  Accounts    │────────┐
├──────────────┤        │
│ id (PK)      │        │
│ team_id (FK) │        │
│ platform     │        │
│ name         │        │
│ access_token │        │
│ created_at   │        │
└──────────────┘        │
                        │1:N
                        │
                    ┌───────────┐
                    │   Posts   │
                    ├───────────┤
                    │ id (PK)   │
                    │ account_id│
                    │ content   │
                    │ status    │
                    │ created_at│
                    └─────┬─────┘
                          │
              ┌───────────┼───────────┐
              │           │           │
         ┌────▼──┐   ┌───▼────┐  ┌──▼─────┐
         │Metrics│   │Comments│  │ Approvals
         └───────┘   └────────┘  └─────────┘
```

## 📋 Tabulky

### 1. Users (Uživatelé)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    mfa_enabled BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active', -- active, inactive, suspended
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_status ON users(status);
```

### 2. Teams (Týmy)
```sql
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'business', -- business, agency, enterprise
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_teams_owner_id ON teams(owner_id);
CREATE INDEX idx_teams_plan ON teams(plan);
CREATE INDEX idx_teams_status ON teams(status);
```

### 3. TeamMembers (Členové Týmu)
```sql
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- admin, manager, member, viewer
    invited_by UUID REFERENCES users(id),
    joined_at TIMESTAMP DEFAULT NOW(),
    invited_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'active', -- active, pending, inactive
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(team_id, user_id)
);

-- Indexes
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_team_members_user_id ON team_members(user_id);
CREATE INDEX idx_team_members_role ON team_members(role);
```

### 4. Accounts (Sociální Sítě)
```sql
CREATE TABLE accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL, -- facebook, instagram, twitter, linkedin, tiktok, pinterest, youtube, gmb
    platform_account_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    display_name VARCHAR(255),
    profile_picture_url VARCHAR(500),
    bio TEXT,
    follower_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    
    -- OAuth Tokens
    access_token TEXT, -- Encrypted
    refresh_token TEXT, -- Encrypted
    token_expires_at TIMESTAMP,
    
    -- Platform Metadata
    metadata JSONB, -- Platform-specific data
    
    status VARCHAR(20) DEFAULT 'connected', -- connected, disconnected, expired, error
    
    connected_by UUID REFERENCES users(id),
    connected_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(team_id, platform, platform_account_id)
);

-- Indexes
CREATE INDEX idx_accounts_team_id ON accounts(team_id);
CREATE INDEX idx_accounts_platform ON accounts(platform);
CREATE INDEX idx_accounts_status ON accounts(status);
```

### 5. Posts (Příspěvky)
```sql
CREATE TABLE posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL, -- draft, pending_approval, approved, scheduled, published, failed
    
    -- Scheduling
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    
    -- Publishing Info
    accounts_to_publish JSONB, -- Array of account IDs
    
    -- Media
    media JSONB, -- Array of media objects
    
    -- Metadata
    tags JSONB, -- Array of hashtags
    mentions JSONB, -- Array of mentions
    external_links JSONB, -- Array of links
    
    -- Performance
    view_count BIGINT DEFAULT 0,
    engagement_count BIGINT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Indexes
CREATE INDEX idx_posts_team_id ON posts(team_id);
CREATE INDEX idx_posts_account_id ON posts(account_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_scheduled_at ON posts(scheduled_at);
CREATE INDEX idx_posts_published_at ON posts(published_at);
CREATE INDEX idx_posts_created_by ON posts(created_by);
```

### 6. PostMetrics (Metriky Příspěvků)
```sql
CREATE TABLE post_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    
    platform VARCHAR(50) NOT NULL,
    platform_post_id VARCHAR(255),
    
    -- Basic Metrics
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    engagements BIGINT DEFAULT 0,
    
    -- Engagement Breakdown
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,
    retweets BIGINT DEFAULT 0,
    
    -- Video Metrics
    video_views BIGINT,
    video_duration INT, -- seconds
    video_completion_rate DECIMAL(5,2),
    
    -- Click Metrics
    clicks BIGINT DEFAULT 0,
    click_through_rate DECIMAL(5,2),
    
    -- Metadata
    recorded_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(post_id, account_id, recorded_at)
);

-- Indexes
CREATE INDEX idx_post_metrics_post_id ON post_metrics(post_id);
CREATE INDEX idx_post_metrics_account_id ON post_metrics(account_id);
CREATE INDEX idx_post_metrics_recorded_at ON post_metrics(recorded_at);
```

### 7. AccountMetrics (Metriky Účtu)
```sql
CREATE TABLE account_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    
    -- Follower Metrics
    follower_count BIGINT NOT NULL,
    following_count BIGINT,
    new_followers BIGINT,
    
    -- Engagement Metrics
    total_impressions BIGINT,
    total_reach BIGINT,
    average_engagement_rate DECIMAL(5,2),
    
    -- Aggregate Metrics
    posts_published INT,
    posts_with_engagement INT,
    
    recorded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(account_id, recorded_at)
);

-- Indexes
CREATE INDEX idx_account_metrics_account_id ON account_metrics(account_id);
CREATE INDEX idx_account_metrics_recorded_at ON account_metrics(recorded_at);
```

### 8. Messages (Zprávy/Konverzace)
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    
    -- From Social Network User
    sender_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    sender_profile_image_url VARCHAR(500),
    
    -- Message Info
    platform VARCHAR(50) NOT NULL,
    platform_message_id VARCHAR(255) UNIQUE,
    message_type VARCHAR(50), -- dm, comment, mention, inbox
    
    content TEXT,
    
    -- Threading
    conversation_id VARCHAR(255),
    parent_message_id VARCHAR(255),
    
    -- Status
    status VARCHAR(50) DEFAULT 'new', -- new, read, responded, archived, spam
    assigned_to UUID REFERENCES users(id),
    
    -- Sentiment
    sentiment VARCHAR(50), -- positive, neutral, negative
    sentiment_score DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    received_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_messages_team_id ON messages(team_id);
CREATE INDEX idx_messages_account_id ON messages(account_id);
CREATE INDEX idx_messages_status ON messages(status);
CREATE INDEX idx_messages_assigned_to ON messages(assigned_to);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_received_at ON messages(received_at);
```

### 9. Comments (Komentáře)
```sql
CREATE TABLE comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    
    -- Comment Source
    platform VARCHAR(50) NOT NULL,
    platform_comment_id VARCHAR(255) UNIQUE,
    
    -- Author
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_profile_url VARCHAR(500),
    
    content TEXT NOT NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, spam
    moderated_by UUID REFERENCES users(id),
    
    -- Sentiment
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_platform_comment_id ON comments(platform_comment_id);
CREATE INDEX idx_comments_status ON comments(status);
```

### 10. PostApprovals (Schválení)
```sql
CREATE TABLE post_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    
    requested_by UUID NOT NULL REFERENCES users(id),
    assigned_to UUID NOT NULL REFERENCES users(id),
    
    status VARCHAR(50) NOT NULL, -- pending, approved, changes_requested, rejected
    
    approval_comment TEXT,
    
    requested_at TIMESTAMP DEFAULT NOW(),
    responded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_post_approvals_post_id ON post_approvals(post_id);
CREATE INDEX idx_post_approvals_assigned_to ON post_approvals(assigned_to);
CREATE INDEX idx_post_approvals_status ON post_approvals(status);
```

### 11. Keywords (Monitoring)
```sql
CREATE TABLE keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    
    keyword VARCHAR(255) NOT NULL,
    keyword_type VARCHAR(50), -- brand, competitor, industry, hashtag, topic
    
    enabled BOOLEAN DEFAULT true,
    
    -- Notification Settings
    notify_on_mention BOOLEAN DEFAULT true,
    notification_level VARCHAR(50), -- critical, high, medium, low
    
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    
    UNIQUE(team_id, keyword)
);

-- Indexes
CREATE INDEX idx_keywords_team_id ON keywords(team_id);
CREATE INDEX idx_keywords_keyword_type ON keywords(keyword_type);
```

### 12. Mentions (Zmínky)
```sql
CREATE TABLE mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    
    keyword_id UUID REFERENCES keywords(id) ON DELETE SET NULL,
    
    platform VARCHAR(50) NOT NULL,
    platform_mention_id VARCHAR(255) UNIQUE,
    
    -- Author Info
    author_id VARCHAR(255),
    author_name VARCHAR(255),
    author_profile_url VARCHAR(500),
    author_follower_count BIGINT,
    
    content TEXT NOT NULL,
    
    -- Link to Social Post
    source_url VARCHAR(500),
    
    -- Analysis
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    
    status VARCHAR(50) DEFAULT 'new', -- new, reviewed, responded, ignored
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    mentioned_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_mentions_team_id ON mentions(team_id);
CREATE INDEX idx_mentions_keyword_id ON mentions(keyword_id);
CREATE INDEX idx_mentions_sentiment ON mentions(sentiment);
CREATE INDEX idx_mentions_mentioned_at ON mentions(mentioned_at);
```

### 13. AuditLog (Audit Trail)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    
    action VARCHAR(100) NOT NULL, -- post_created, post_published, comment_approved, etc
    entity_type VARCHAR(50), -- post, comment, account, etc
    entity_id VARCHAR(255),
    
    old_values JSONB,
    new_values JSONB,
    
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_team_id ON audit_logs(team_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

## 🔍 Database Performance Queries

### Active Users Per Day
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(DISTINCT created_by) as active_users
FROM posts
WHERE team_id = $1
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Top Performing Posts
```sql
SELECT 
    p.id,
    p.content,
    SUM(pm.engagements) as total_engagements,
    AVG(pm.engagements) as avg_engagement
FROM posts p
LEFT JOIN post_metrics pm ON p.id = pm.post_id
WHERE p.team_id = $1 
  AND p.published_at >= NOW() - INTERVAL '30 days'
GROUP BY p.id
ORDER BY total_engagements DESC
LIMIT 10;
```

### Follower Growth Trend
```sql
SELECT 
    account_id,
    recorded_at,
    follower_count,
    LAG(follower_count) OVER (
        PARTITION BY account_id 
        ORDER BY recorded_at
    ) as prev_follower_count
FROM account_metrics
WHERE team_id = $1
ORDER BY account_id, recorded_at DESC;
```

## 📊 Indexing Strategy

**Hot Tables:** posts, messages, account_metrics, post_metrics
**Frequent Filters:** team_id, status, account_id, created_at, platform
**Sorting:** created_at, recorded_at, published_at

---

**Databáze verze:** 1.0  
**Poslední update:** Červenec 2026
