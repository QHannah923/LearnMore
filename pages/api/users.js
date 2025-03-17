import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await db.query('SELECT * FROM users');
    res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch users' });
  }
}