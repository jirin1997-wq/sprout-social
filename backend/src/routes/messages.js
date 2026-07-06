import express from 'express';
import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get messages (inbox)
router.get('/inbox', authMiddleware, async (req, res) => {
  try {
    const status = req.query.status || 'new';
    const result = await pool.query(
      `SELECT
        m.id,
        m.platform,
        m.sender_name,
        m.content,
        m.status,
        m.created_at,
        a.name as account_name
       FROM messages m
       JOIN accounts a ON m.account_id = a.id
       WHERE a.team_id = (SELECT id FROM teams LIMIT 1)
       AND m.status = $1
       ORDER BY m.created_at DESC
       LIMIT 50`,
      [status]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single message
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT m.*, a.name as account_name
       FROM messages m
       JOIN accounts a ON m.account_id = a.id
       WHERE m.id = $1`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get comments
router.get('/post/:postId/comments', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        c.id,
        c.author_name,
        c.content,
        c.sentiment,
        c.status,
        c.created_at
       FROM comments c
       WHERE c.post_id = $1
       ORDER BY c.created_at DESC`,
      [req.params.postId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark message as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE messages
       SET status = 'read', updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message marked as read' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve comment
router.post('/comments/:id/approve', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE comments
       SET status = 'approved', moderated_by = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [req.user.userId, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject comment
router.post('/comments/:id/reject', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE comments
       SET status = 'rejected', moderated_by = $1, updated_at = NOW()
       WHERE id = $2
       RETURNING *`,
      [req.user.userId, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    res.json({ message: 'Comment rejected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
