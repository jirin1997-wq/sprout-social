import express from 'express';
import { pool } from '../server.js';
import { v4 as uuidv4 } from 'uuid';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Connect social account
router.post('/connect', authMiddleware, async (req, res) => {
  try {
    const { platform, platformAccountId, accessToken, displayName } = req.body;

    const accountId = uuidv4();
    const result = await pool.query(
      `INSERT INTO accounts (
        id, team_id, platform, platform_account_id,
        access_token, display_name, name, connected_by
      ) VALUES (
        $1, (SELECT id FROM teams LIMIT 1), $2, $3, $4, $5, $6, $7
      )
      RETURNING *`,
      [
        accountId,
        platform,
        platformAccountId,
        accessToken,
        displayName,
        displayName,
        req.user.userId
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user's connected accounts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT a.id, a.platform, a.name, a.display_name, a.follower_count,
              a.verified, a.status, a.connected_at
       FROM accounts a
       JOIN teams t ON a.team_id = t.id
       WHERE t.owner_id = $1
       ORDER BY a.platform ASC`,
      [req.user.userId]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get account metrics
router.get('/:id/metrics', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        am.recorded_at,
        am.follower_count,
        am.new_followers,
        am.total_impressions,
        am.average_engagement_rate,
        am.posts_published
       FROM account_metrics am
       WHERE am.account_id = $1
       ORDER BY am.recorded_at DESC
       LIMIT 30`,
      [req.params.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Disconnect account
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE accounts
       SET status = 'disconnected', updated_at = NOW()
       WHERE id = $1
       RETURNING id`,
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found' });
    }

    res.json({ message: 'Account disconnected' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
