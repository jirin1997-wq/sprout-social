import express from 'express';
import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { content, accountIds, scheduledAt, status = 'draft' } = req.body;
    const userId = req.user.userId;

    const postId = uuidv4();
    const result = await pool.query(
      `INSERT INTO posts (
        id, team_id, created_by, content, status,
        accounts_to_publish, scheduled_at
      ) VALUES ($1, (SELECT id FROM teams LIMIT 1), $2, $3, $4, $5, $6)
       RETURNING *`,
      [postId, userId, content, status, JSON.stringify(accountIds || []), scheduledAt]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's posts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await pool.query(
      `SELECT p.*,
              COUNT(DISTINCT pm.id) as metric_count,
              SUM(pm.engagements) as total_engagements
       FROM posts p
       LEFT JOIN post_metrics pm ON p.id = pm.post_id
       WHERE p.created_by = $1
       GROUP BY p.id
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single post
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT p.*,
              json_agg(json_build_object(
                'metric_type', pm.platform,
                'impressions', pm.impressions,
                'engagement', pm.engagements,
                'likes', pm.likes
              )) as metrics
       FROM posts p
       LEFT JOIN post_metrics pm ON p.id = pm.post_id
       WHERE p.id = $1
       GROUP BY p.id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { content, status, scheduledAt } = req.body;
    const result = await pool.query(
      `UPDATE posts
       SET content = $1, status = $2, scheduled_at = $3, updated_at = NOW()
       WHERE id = $4 AND created_by = $5
       RETURNING *`,
      [content, status, scheduledAt, req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Publish post
router.post('/:id/publish', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE posts
       SET status = 'published', published_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND created_by = $2
       RETURNING *`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post published', post: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM posts
       WHERE id = $1 AND created_by = $2
       RETURNING id`,
      [req.params.id, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
