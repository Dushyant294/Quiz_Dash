const db = require('../config/db');
const { success, error } = require('../utils/apiResponse');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (or Protected later)
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch basic user data
    const userResult = await db.query(
      'SELECT user_id, full_name, email, username, role, bio, profile_image_url, created_at, total_points, rank_tier FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return error(res, 'User not found', 404);
    }

    const user = userResult.rows[0];

    // Fetch user recent activity
    const activityResult = await db.query(
      'SELECT activity_type, description, metadata, created_at FROM user_activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
      [userId]
    );

    user.activity_feed = activityResult.rows;

    return success(res, user, 'User profile fetched successfully');
  } catch (err) {
    console.error('Error fetching user profile:', err);
    return error(res, 'Server error while fetching profile', 500);
  }
};

// @desc    Get dashboard metrics for a user
// @route   GET /api/users/dashboard/:id
// @access  Public (or Protected later)
exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.params.id;

    // We will aggregate stats from quiz_attempts
    const statsResult = await db.query(`
      SELECT 
        COUNT(attempt_id) as total_quizzes_taken,
        COALESCE(SUM(score), 0) as total_score_earned,
        COALESCE(MAX(score), 0) as highest_score,
        COUNT(CASE WHEN is_completed = true THEN 1 END) as completed_quizzes
      FROM quiz_attempts
      WHERE user_id = $1
    `, [userId]);

    return success(res, statsResult.rows[0], 'Dashboard data fetched successfully');
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    return error(res, 'Server error while fetching dashboard data', 500);
  }
};

// @desc    Get detailed stats (e.g. for charts)
// @route   GET /api/users/stats/:id
// @access  Public (or Protected later)
exports.getUserStats = async (req, res) => {
  try {
    const userId = req.params.id;

    // Get win/loss ratio from quiz_sessions (battles)
    const battlesResult = await db.query(`
      SELECT 
        COUNT(*) as total_battles,
        COUNT(CASE WHEN winner_id = $1 THEN 1 END) as wins
      FROM quiz_sessions
      WHERE session_type = '1v1_battle' AND (player1_id = $1 OR player2_id = $1) AND status = 'completed'
    `, [userId]);

    const stats = battlesResult.rows[0];

    // Calculate win rate
    stats.win_rate = stats.total_battles > 0
      ? Math.round((stats.wins / stats.total_battles) * 100)
      : 0;

    return success(res, stats, 'User stats fetched successfully');
  } catch (err) {
    console.error('Error fetching user stats:', err);
    return error(res, 'Server error while fetching user stats', 500);
  }
};
