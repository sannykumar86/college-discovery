import { Router, Request, Response } from 'express';
import { getDb, queryAll, queryOne } from '../db/index.js';

const router = Router();

// GET /api/colleges - List colleges with search, filter, pagination
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const {
      search = '',
      location = '',
      state = '',
      minFees = '',
      maxFees = '',
      type = '',
      course = '',
      sortBy = 'rating',
      sortOrder = 'desc',
      page = '1',
      limit = '12'
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit) || 12));
    const offset = (pageNum - 1) * limitNum;

    let whereClause = 'WHERE 1=1';
    const params: any[] = [];

    if (search) {
      whereClause += ' AND (name ILIKE ? OR location ILIKE ? OR state ILIKE ? OR courses ILIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (location) {
      whereClause += ' AND location = ?';
      params.push(location);
    }

    if (state) {
      whereClause += ' AND state = ?';
      params.push(state);
    }

    if (minFees) {
      whereClause += ' AND fees >= ?';
      params.push(parseInt(minFees));
    }

    if (maxFees) {
      whereClause += ' AND fees <= ?';
      params.push(parseInt(maxFees));
    }

    if (type) {
      whereClause += ' AND type = ?';
      params.push(type);
    }

    if (course) {
      whereClause += ' AND courses ILIKE ?';
      params.push(`%${course}%`);
    }

    // Validate sort column
    const validSortCols = ['rating', 'fees', 'name', 'placement_percentage', 'established_year'];
    const sortCol = validSortCols.includes(sortBy) ? sortBy : 'rating';
    const sortDir = sortOrder === 'asc' ? 'ASC' : 'DESC';

    // Get total count
    const countRow = await queryOne(db, `SELECT COUNT(*) as total FROM colleges ${whereClause}`, params);
    const total = countRow?.total || 0;

    // Get colleges
    const colleges = await queryAll(db,
      `SELECT id, name, location, state, fees, rating, courses, placement_percentage, 
              established_year, type, image_url, avg_package, total_students
       FROM colleges ${whereClause} 
       ORDER BY ${sortCol} ${sortDir} 
       LIMIT ? OFFSET ?`,
      [...params, limitNum, offset]
    );

    // Parse courses JSON safely
    const parsedColleges = colleges.map((c: any) => {
      let courses = [];
      try {
        courses = typeof c.courses === 'string' ? JSON.parse(c.courses) : (Array.isArray(c.courses) ? c.courses : []);
      } catch (e) {
        console.error(`Error parsing courses for college ${c.id}:`, e);
      }
      return { ...c, courses };
    });

    res.json({
      colleges: parsedColleges,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching colleges:', error);
    res.status(500).json({ error: 'Failed to fetch colleges' });
  }
});

// GET /api/colleges/filters - Get available filter options
router.get('/filters', async (_req: Request, res: Response) => {
  try {
    const db = await getDb();
    const locations = await queryAll(db, 'SELECT DISTINCT location FROM colleges ORDER BY location');
    const states = await queryAll(db, 'SELECT DISTINCT state FROM colleges ORDER BY state');
    const types = await queryAll(db, 'SELECT DISTINCT type FROM colleges ORDER BY type');
    const feesRange = await queryOne(db, 'SELECT MIN(fees) as minFees, MAX(fees) as maxFees FROM colleges');

    // Get all unique courses
    const allCourses = await queryAll(db, 'SELECT courses FROM colleges');
    const courseSet = new Set<string>();
    allCourses.forEach((row: any) => {
      try {
        const courses = typeof row.courses === 'string' ? JSON.parse(row.courses) : (Array.isArray(row.courses) ? row.courses : []);
        courses.forEach((c: string) => courseSet.add(c));
      } catch (e) {
        console.error('Error parsing courses from row:', e);
      }
    });

    res.json({
      locations: locations.map((l: any) => l.location),
      states: states.map((s: any) => s.state),
      types: types.map((t: any) => t.type),
      courses: Array.from(courseSet).sort(),
      feesRange: feesRange || { minFees: 0, maxFees: 1000000 }
    });
  } catch (error) {
    console.error('Error fetching filters:', error);
    res.status(500).json({ error: 'Failed to fetch filter options' });
  }
});

// GET /api/colleges/:id - Get college detail
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const idStr = id as string;
    const college = await queryOne(db, 'SELECT * FROM colleges WHERE id = ?', [parseInt(idStr)]);

    if (!college) {
      res.status(404).json({ error: 'College not found' });
      return;
    }

    try {
      college.courses = typeof college.courses === 'string' ? JSON.parse(college.courses) : (Array.isArray(college.courses) ? college.courses : []);
    } catch (e) {
      console.error(`Error parsing courses for college ${id}:`, e);
      college.courses = [];
    }

    try {
      college.accepted_exams = typeof college.accepted_exams === 'string' ? JSON.parse(college.accepted_exams) : (Array.isArray(college.accepted_exams) ? college.accepted_exams : []);
    } catch (e) {
      console.error(`Error parsing exams for college ${id}:`, e);
      college.accepted_exams = [];
    }

    // Get reviews
    const reviews = await queryAll(db, 'SELECT * FROM reviews WHERE college_id = ? ORDER BY created_at DESC', [parseInt(idStr)]);

    // Calculate review stats
    const reviewStats = await queryOne(db, 'SELECT COUNT(*) as count, AVG(rating) as avgRating FROM reviews WHERE college_id = ?', [parseInt(idStr)]);

    res.json({
      ...college,
      reviews,
      reviewStats: {
        count: reviewStats?.count || 0,
        avgRating: reviewStats?.avgRating ? Math.round(reviewStats.avgRating * 10) / 10 : 0
      }
    });
  } catch (error) {
    console.error('Error fetching college:', error);
    res.status(500).json({ error: 'Failed to fetch college details' });
  }
});

// POST /api/colleges/compare - Compare colleges
router.post('/compare', async (req: Request, res: Response) => {
  try {
    const db = await getDb();
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length < 2 || ids.length > 3) {
      res.status(400).json({ error: 'Please provide 2-3 college IDs to compare' });
      return;
    }

    const placeholders = ids.map(() => '?').join(',');
    const colleges = await queryAll(db,
      `SELECT id, name, location, state, fees, rating, courses, placement_percentage,
              established_year, type, avg_package, highest_package, total_students, accepted_exams
       FROM colleges WHERE id IN (${placeholders})`,
      ids.map(Number)
    );

    if (colleges.length < 2) {
      res.status(404).json({ error: 'One or more colleges not found' });
      return;
    }

    const parsedColleges = colleges.map((c: any) => {
      let courses = [];
      let accepted_exams = [];
      try {
        courses = typeof c.courses === 'string' ? JSON.parse(c.courses) : (Array.isArray(c.courses) ? c.courses : []);
      } catch (e) {
        console.error(`Error parsing courses for college ${c.id}:`, e);
      }
      try {
        accepted_exams = typeof c.accepted_exams === 'string' ? JSON.parse(c.accepted_exams) : (Array.isArray(c.accepted_exams) ? c.accepted_exams : []);
      } catch (e) {
        console.error(`Error parsing exams for college ${c.id}:`, e);
      }
      return { ...c, courses, accepted_exams };
    });

    res.json({ colleges: parsedColleges });
  } catch (error) {
    console.error('Error comparing colleges:', error);
    res.status(500).json({ error: 'Failed to compare colleges' });
  }
});

export default router;
