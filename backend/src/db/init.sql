-- Create Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(500),
    timezone VARCHAR(50) DEFAULT 'UTC',
    language VARCHAR(10) DEFAULT 'en',
    mfa_enabled BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active',
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Create Teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    logo_url VARCHAR(500),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan VARCHAR(50) DEFAULT 'business',
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create default team for first user
INSERT INTO teams (name, slug, owner_id)
SELECT 'Default Team', 'default-team', id
FROM users
LIMIT 1
ON CONFLICT DO NOTHING;

-- Create Accounts table
CREATE TABLE IF NOT EXISTS accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_account_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255),
    display_name VARCHAR(255),
    profile_picture_url VARCHAR(500),
    bio TEXT,
    follower_count BIGINT DEFAULT 0,
    following_count BIGINT DEFAULT 0,
    verified BOOLEAN DEFAULT false,
    access_token TEXT,
    refresh_token TEXT,
    token_expires_at TIMESTAMP,
    metadata JSONB,
    status VARCHAR(20) DEFAULT 'connected',
    connected_by UUID REFERENCES users(id),
    connected_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, platform, platform_account_id)
);

-- Create Posts table
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    account_id UUID REFERENCES accounts(id) ON DELETE SET NULL,
    created_by UUID NOT NULL REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    content TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'draft',
    scheduled_at TIMESTAMP,
    published_at TIMESTAMP,
    accounts_to_publish JSONB,
    media JSONB,
    tags JSONB,
    mentions JSONB,
    external_links JSONB,
    view_count BIGINT DEFAULT 0,
    engagement_count BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);

-- Create Post Metrics table
CREATE TABLE IF NOT EXISTS post_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_post_id VARCHAR(255),
    impressions BIGINT DEFAULT 0,
    reach BIGINT DEFAULT 0,
    engagements BIGINT DEFAULT 0,
    likes BIGINT DEFAULT 0,
    comments BIGINT DEFAULT 0,
    shares BIGINT DEFAULT 0,
    saves BIGINT DEFAULT 0,
    retweets BIGINT DEFAULT 0,
    video_views BIGINT,
    video_duration INT,
    video_completion_rate DECIMAL(5,2),
    clicks BIGINT DEFAULT 0,
    click_through_rate DECIMAL(5,2),
    recorded_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(post_id, account_id, recorded_at)
);

-- Create Account Metrics table
CREATE TABLE IF NOT EXISTS account_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    follower_count BIGINT NOT NULL,
    following_count BIGINT,
    new_followers BIGINT,
    total_impressions BIGINT,
    total_reach BIGINT,
    average_engagement_rate DECIMAL(5,2),
    posts_published INT,
    posts_with_engagement INT,
    recorded_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(account_id, recorded_at)
);

-- Create Messages table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
    sender_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    sender_profile_image_url VARCHAR(500),
    platform VARCHAR(50) NOT NULL,
    platform_message_id VARCHAR(255) UNIQUE,
    message_type VARCHAR(50),
    content TEXT,
    conversation_id VARCHAR(255),
    parent_message_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'new',
    assigned_to UUID REFERENCES users(id),
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    received_at TIMESTAMP DEFAULT NOW()
);

-- Create Comments table
CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    platform_comment_id VARCHAR(255) UNIQUE,
    author_id VARCHAR(255) NOT NULL,
    author_name VARCHAR(255),
    author_profile_url VARCHAR(500),
    content TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    moderated_by UUID REFERENCES users(id),
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Keywords table
CREATE TABLE IF NOT EXISTS keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    keyword VARCHAR(255) NOT NULL,
    keyword_type VARCHAR(50),
    enabled BOOLEAN DEFAULT true,
    notify_on_mention BOOLEAN DEFAULT true,
    notification_level VARCHAR(50),
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(team_id, keyword)
);

-- Create Mentions table
CREATE TABLE IF NOT EXISTS mentions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    keyword_id UUID REFERENCES keywords(id) ON DELETE SET NULL,
    platform VARCHAR(50) NOT NULL,
    platform_mention_id VARCHAR(255) UNIQUE,
    author_id VARCHAR(255),
    author_name VARCHAR(255),
    author_profile_url VARCHAR(500),
    author_follower_count BIGINT,
    content TEXT NOT NULL,
    source_url VARCHAR(500),
    sentiment VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    status VARCHAR(50) DEFAULT 'new',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    mentioned_at TIMESTAMP DEFAULT NOW()
);

-- Create Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_teams_owner_id ON teams(owner_id);
CREATE INDEX IF NOT EXISTS idx_teams_plan ON teams(plan);
CREATE INDEX IF NOT EXISTS idx_accounts_team_id ON accounts(team_id);
CREATE INDEX IF NOT EXISTS idx_accounts_platform ON accounts(platform);
CREATE INDEX IF NOT EXISTS idx_accounts_status ON accounts(status);
CREATE INDEX IF NOT EXISTS idx_posts_team_id ON posts(team_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_by ON posts(created_by);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at);
CREATE INDEX IF NOT EXISTS idx_post_metrics_post_id ON post_metrics(post_id);
CREATE INDEX IF NOT EXISTS idx_post_metrics_recorded_at ON post_metrics(recorded_at);
CREATE INDEX IF NOT EXISTS idx_account_metrics_account_id ON account_metrics(account_id);
CREATE INDEX IF NOT EXISTS idx_messages_team_id ON messages(team_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_keywords_team_id ON keywords(team_id);
CREATE INDEX IF NOT EXISTS idx_mentions_team_id ON mentions(team_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_team_id ON audit_logs(team_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
