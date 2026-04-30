import { Router, Response } from 'express';
import { getDb, queryAll, queryOne, run } from '../db/index.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// All saved routes require authentication
router.use(authMiddleware);

// GET /api/saved - Get user's saved colleges
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const saved = await queryAll(db, `
      SELECT c.id, c.name, c.location, c.state, c.fees, c.rating, c.courses,
             c.placement_percentage, c.type, c.image_url, c.avg_package, c.total_students,
             sc.created_at as saved_at
      FROM saved_colleges sc
      JOIN colleges c ON sc.college_id = c.id
      WHERE sc.user_id = ?
      ORDER BY sc.created_at DESC
    `, [req.userId!]);

    const parsed = saved.map((s: any) => ({
      ...s,
      courses: JSON.parse(s.courses)
    }));

    res.json({ saved: parsed });
  } catch (error) {
    console.error('Error fetching saved:', error);
    res.status(500).json({ error: 'Failed to fetch saved colleges' });
  }
});

// POST /api/saved - Save a college
router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const { collegeId } = req.body;

    if (!collegeId) {
      res.status(400).json({ error: 'College ID is required' });
      return;
    }

    const college = await queryOne(db, 'SELECT id FROM colleges WHERE id = ?', [collegeId]);
    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    const existing = await queryOne(db, 'SELECT id FROM saved_colleges WHERE user_id = ? AND college_id = ?', [req.userId!, collegeId]);
    if (existing) {
      res.status(409).json({ error: 'College already saved' });
      return;
    }

    await run(db, 'INSERT INTO saved_colleges (user_id, college_id) VALUES (?, ?)', [req.userId!, collegeId]);

    res.status(201).json({ message: 'College saved successfully' });
  } catch (error) {
    console.error('Error saving college:', error);
    res.status(500).json({ error: 'Failed to save college' });
  }
});

// DELETE /api/saved/:collegeId - Unsave a college
router.delete('/:collegeId', async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const { collegeId } = req.params;

    const existing = await queryOne(db, 'SELECT id FROM saved_colleges WHERE user_id = ? AND college_id = ?', [req.userId!, parseInt(collegeId)]);
    if (!existing) {
      res.status(404).json({ error: 'Saved college not found' });
      return;
    }

    await run(db, 'DELETE FROM saved_colleges WHERE user_id = ? AND college_id = ?', [req.userId!, parseInt(collegeId)]);

    res.json({ message: 'College removed from saved' });
  } catch (error) {
    console.error('Error removing saved:', error);
    res.status(500).json({ error: 'Failed to remove saved college' });
  }
});

// GET /api/saved/check/:collegeId - Check if a college is saved
router.get('/check/:collegeId', async (req: AuthRequest, res: Response) => {
  try {
    const db = await getDb();
    const { collegeId } = req.params;
    const existing = await queryOne(db, 'SELECT id FROM saved_colleges WHERE user_id = ? AND college_id = ?', [req.userId!, parseInt(collegeId)]);
    res.json({ saved: !!existing });
  } catch (error) {
    console.error('Error checking saved:', error);
    res.status(500).json({ error: 'Failed to check saved status' });
  }
});

export default router;
