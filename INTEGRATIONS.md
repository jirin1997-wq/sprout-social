# Sprout Social - Integrační Příručka

## 🔗 Sociální Sítě (Nativní Integrace)

### Facebook
**API Version:** Graph API v18.0+

**Podporované Funkce:**
- Publikování na Pages
- Scheduling příspěvků
- Přístup k Messenger
- Komentáře a reactions
- Page Insights (analytics)
- Group management

**Autentizace:**
```
OAuth 2.0 s scopem: 
- pages_read_engagement
- pages_manage_posts
- pages_manage_engagement
- instagram_basic
- messenger_page_list
```

**Rate Limits:** 
- 200 calls/user/hour

**Webhook Subscriptions:**
- feed (nový obsah)
- message (nové zprávy)
- comments (nové komentáře)

### Instagram
**API Version:** Instagram Graph API v18.0+

**Podporované Funkce:**
- Publishing na Feed, Stories, Reels
- Insights (impressions, reach, engagement)
- Stories metrics
- Reels insights
- Hashtag research
- Mention detection

**Autentizace:**
```
OAuth 2.0 s scopem:
- instagram_basic
- instagram_content_publish
- pages_read_engagement
```

**Rate Limits:** 
- 200 calls/user/hour

### Twitter/X
**API Version:** Twitter API v2

**Podporované Funkce:**
- Tweet creation
- Tweet scheduling
- Retweets a replies
- Likes management
- Thread management
- Search past tweets
- Conversation tracking

**Autentizace:**
```
OAuth 2.0 s scopem:
- tweet.read
- tweet.write
- users.read
- followers.read
```

**Rate Limits:** 
- Tweet creation: 50/15min
- Search: 300/15min

### LinkedIn
**API Version:** LinkedIn Marketing Developer Platform

**Podporované Funkce:**
- Publishing company updates
- Employee advocacy
- Ads management insights
- Employee profile insights
- Messaging (LinkedIn Messaging)
- Job posting

**Autentizace:**
```
OAuth 2.0 s scopem:
- w_member_social
- r_member_social
- r_ads
- r_ads_reporting
```

**Rate Limits:** 
- 100 calls/day (depends on tier)

### TikTok
**API Version:** TikTok Business API v0.9.1

**Podporované Funkce:**
- Video upload
- Publishing
- Video analytics
- Audience insights
- Hashtag tracking
- Sound library

**Autentizace:**
```
OAuth 2.0 s scopem:
- video.list
- video.upload
- user.info
```

**Rate Limits:** 
- 500 calls/hour

### Pinterest
**API Version:** Pinterest API v5

**Podporované Funkce:**
- Pin creation
- Pin scheduling
- Board management
- Analytics (impressions, outbound clicks)
- Hashtag research
- User boards/pins

**Autentizace:**
```
OAuth 2.0 s scopem:
- pins:read
- pins:write
- boards:read
- boards:write
```

**Rate Limits:** 
- 200 calls/hour

### YouTube
**API Version:** YouTube Data API v3

**Podporované Funkce:**
- Video upload (programmatic)
- Video scheduling
- Comment moderation
- Channel analytics
- Playlist management
- Video recommendations

**Autentizace:**
```
OAuth 2.0 s scopem:
- youtube.readonly
- youtube.upload
- youtube.force-ssl
```

### Google My Business
**API Version:** Google My Business API

**Podporované Funkce:**
- Local post creation
- Location posts scheduling
- Q&A management
- Review responses
- Location insights
- Photo uploads

**Autentizace:**
```
OAuth 2.0 s scopem:
- https://www.googleapis.com/auth/mybusiness
```

## 🧠 AI & Machine Learning Integrations

### OpenAI (Content Generation)
```
- Model: GPT-4 / GPT-3.5-turbo
- Use case: Content suggestions, copywriting
- Rate Limits: Depends on plan
```

**Funkcionalita:**
```python
def generate_post_copy(topic: str, tone: str) -> str:
    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a social media expert."},
            {"role": "user", "content": f"Write a {tone} post about {topic}"}
        ]
    )
    return response.choices[0].message.content
```

### Google Cloud NLP (Sentiment Analysis)
```
- Analyzes sentiment of comments
- Detects entity mentions
- Analyzes syntax
```

### Hugging Face Models (On-premise)
```
- Sentiment analysis
- Text classification
- Named entity recognition
- Topic modeling
```

## 🔌 Marketing & CRM Integrations

### Salesforce
**Connection:** OAuth 2.0

**Synced Data:**
- Lead creation from social followers
- Contact synchronization
- Campaign tracking
- Custom objects

**API Endpoints:**
```
POST /services/oauth2/token
GET  /services/data/v59.0/sobjects/Contact
POST /services/data/v59.0/sobjects/Lead
```

**Use Cases:**
- Auto-create leads from Instagram/Facebook
- Sync email addresses
- Track social engagement in CRM

### HubSpot
**Connection:** API Key / OAuth 2.0

**Synced Data:**
- Contacts sync
- Companies sync
- Deals sync
- Custom properties

**Webhook:** 
- Contact created/updated events

**Use Cases:**
- Lead scoring based on social engagement
- Contact enrichment
- Campaign attribution

### Mailchimp
**Connection:** API Key

**Functionality:**
- Email list sync with social followers
- Campaign tracking
- Audience segmentation

**API:**
```
GET  /3.0/lists
POST /3.0/lists/{list_id}/members
```

### Pipedrive
**Connection:** OAuth 2.0

**Synced Data:**
- Leads from social
- Deal tracking
- Pipeline management

## 🤖 Workflow Automation

### Zapier
**Supported Triggers:**
- New post published
- New message received
- New mention
- Analytics milestone reached
- Scheduled time reached

**Supported Actions:**
- Create task
- Send email
- Create spreadsheet row
- Send Slack message
- Create Asana task

**Example Zap:**
```
Trigger: Instagram post published
→ Action: Create task in Asana
→ Action: Send email to team
```

### IFTTT (If This Then That)
**Simple rule-based automation**

**Examples:**
```
If new tweet with #hashtag
Then add row to Google Sheets

If Instagram post reaches 1000 likes
Then send email notification

If new message from VIP follower
Then send Slack alert
```

## 📊 Analytics & Business Intelligence

### Google Analytics 4
**Integration:** UTM parameter tracking

**Track:**
- Traffic from social posts
- Conversion tracking
- User journey
- Custom events

**API:**
```
GET /v1beta/properties/{property}/data:runReport
```

### Looker Studio (Google Data Studio)
**Direct data connection**

**Dashboard Creation:**
- Connect Sprout Social data
- Create custom reports
- Share with stakeholders

### Tableau
**API Connection:**

**Features:**
- Custom dashboards
- Real-time data
- Advanced visualizations

### Brandwatch
**Third-party sentiment partner**

**Provides:**
- Advanced NLP analysis
- Competitive intelligence
- Trend detection
- Crisis monitoring

## 💬 Communication Integrations

### Slack
**Integration:** OAuth 2.0 + Webhooks

**Functionality:**
```
/sprout-social-status - Get account status
/sprout-social-mention - Log mention
Scheduled alerts to channel
Post notifications
Team collaboration
```

**Webhook Events:**
- New mention
- Message received
- Alert triggered
- Post scheduled
- Analytics milestone

### Microsoft Teams
**Integration:** OAuth 2.0 + Webhooks

**Similar to Slack**
- Bot integration
- Channel notifications
- Card formatting
- Interactive approvals

### Email
**SMTP Integration**

**Notifications:**
- Daily/weekly digests
- Alert emails
- Report delivery
- Approval requests

## 🛒 E-commerce Integrations

### Shopify
**Connection:** OAuth 2.0

**Features:**
- Product tagging in posts
- Shoppable posts
- Sales attribution
- Analytics sync

**Webhook:** 
- Order created
- Product updated

### WooCommerce
**Connection:** REST API Key

**Features:**
- WordPress integration
- Product posts
- Sales tracking

### BigCommerce
**Connection:** OAuth 2.0

**Features:**
- Product catalog sync
- Sales tracking
- Order attribution

## 📱 Asset & Design Integrations

### Canva
**Connection:** OAuth 2.0

**Features:**
- Design templates
- Drag & drop editor
- Brand kit sync
- Direct import to Sprout

### Unsplash & Pexels
**REST API Integration**

**Features:**
- Free stock photo search
- Direct import
- Attribution handling

### GIPHY
**API Integration**

**Features:**
- GIF search
- Sticker library
- Trending GIFs

### Adobe Stock
**OAuth 2.0 Integration**

**Features:**
- Premium image library
- License management
- Direct import

## 🔔 Notification & Messaging

### Twilio
**SMS/Voice notifications**

**Use Case:**
- Critical alerts via SMS
- Phone notifications

### SendGrid
**Transactional email**

**Use Case:**
- Approval requests
- Password resets
- Notifications

## 🔐 Analytics & Monitoring

### Mixpanel
**Product analytics**

**Tracks:**
- User behavior
- Feature usage
- Funnel analysis

### Segment
**Customer data platform**

**Features:**
- Centralize data collection
- Route to multiple tools
- Single customer view

## 🌐 Webhook Support

### Receiving Webhooks
Sprout Social can receive webhooks from:
- Social platforms (real-time data)
- Third-party apps (events)
- Custom integrations

### Sending Webhooks
```
POST https://your-server.com/webhooks/sprout

Body:
{
  "event": "post.published",
  "timestamp": "2024-07-01T10:30:00Z",
  "data": {
    "post_id": "123",
    "accounts": ["facebook", "instagram"],
    "published_at": "2024-07-01T10:30:00Z"
  }
}
```

## 🔑 API Key Management

**Secure Storage:**
- Encrypted in database
- Never logged
- Rotated automatically
- Per-user audit trail
- Revocation tracking

## ⚙️ Integration Configuration

**In Admin Panel:**
```
Settings -> Integrations
├── Social Networks
├── Marketing Tools
├── Analytics
├── Communication
├── E-commerce
└── Custom Webhooks
```

---

**Integrace verze:** 1.0  
**Poslední update:** Červenec 2026
