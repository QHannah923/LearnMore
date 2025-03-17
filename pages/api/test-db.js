import db from '../../lib/db';

export default async function handler(req, res) {
  try {
    const result = await db.query('SELECT NOW() as current_time');
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ success: false, error: 'Database connection failed' });
  }
}