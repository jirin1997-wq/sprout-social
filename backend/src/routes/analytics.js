import express from 'express';
import { pool } from '../server.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard metrics
router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        COUNT(DISTINCT a.id) as total_accounts,
        SUM(a.follower_count) as total_followers,
        COUNT(DISTINCT p.id) as total_posts,
        SUM(pm.impressions) as total_impressions,
        SUM(pm.engagements) as total_engagements,
        AVG(pm.engagements::float / NULLIF(pm.impressions, 0)) * 100 as avg_engagement_rate
       FROM accounts a
       LEFT JOIN posts p ON p.account_id = a.id
       LEFT JOIN post_metrics pm ON pm.post_id = p.id
       WHERE a.team_id = (SELECT id FROM teams LIMIT 1)`,
      []
    );

    const metrics = result.rows[0];
    res.json({
      totalAccounts: parseInt(metrics.total_accounts) || 0,
      totalFollowers: parseInt(metrics.total_followers) || 0,
      totalPosts: parseInt(metrics.total_posts) || 0,
      totalImpressions: parseInt(metrics.total_impressions) || 0,
      totalEngagements: parseInt(metrics.total_engagements) || 0,
      avgEngagementRate: parseFloat(metrics.avg_engagement_rate) || 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get performance over time
router.get('/performance', authMiddleware, async (req, res) => {
  try {
    const days = req.query.days || 30;
    const result = await pool.query(
      `SELECT
        DATE(pm.recorded_at) as date,
        SUM(pm.impressions) as impressions,
        SUM(pm.engagements) as engagements,
        COUNT(DISTINCT pm.post_id) as posts_count
       FROM post_metrics pm
       JOIN posts p ON pm.post_id = p.id
       WHERE p.created_by = $1
       AND pm.recorded_at >= NOW() - INTERVAL '${days} days'
       GROUP BY DATE(pm.recorded_at)
       ORDER BY date DESC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top posts
router.get('/top-posts', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        p.id,
        p.content,
        p.published_at,
        SUM(pm.impressions) as impressions,
        SUM(pm.engagements) as engagements,
        SUM(pm.likes) as likes,
        SUM(pm.comments) as comments
       FROM posts p
       LEFT JOIN post_metrics pm ON p.id = pm.post_id
       WHERE p.created_by = $1 AND p.status = 'published'
       GROUP BY p.id
       ORDER BY engagements DESC
       LIMIT 10`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get platform breakdown
router.get('/platform-breakdown', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        a.platform,
        COUNT(DISTINCT p.id) as posts,
        SUM(pm.impressions) as impressions,
        SUM(pm.engagements) as engagements
       FROM accounts a
       LEFT JOIN posts p ON p.account_id = a.id
       LEFT JOIN post_metrics pm ON pm.post_id = p.id
       WHERE a.team_id = (SELECT id FROM teams LIMIT 1)
       GROUP BY a.platform`,
      []
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
