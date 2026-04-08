const db = require('../config/db');
const { success, error } = require('../utils/apiResponse');

// @desc    Get user profile by ID
// @route   GET /api/users/:id
// @access  Public (or Protected later)
exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;

    // Fetch basic user data (using valid columns from the schema)
    const userResult = await db.query(
      'SELECT user_id, full_name, email, username, role, profile_picture, created_at, total_points, global_rank, current_streak, highest_streak, win_rate, time_played_min, completion_rate, best_category, fav_category, weakest_category FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return error(res, 'User not found', 404);
    }

    const user = userResult.rows[0];

    // Fetch user recent activity
    const activityResult = await db.query(
      'SELECT activity_type, title as description, metadata, created_at FROM user_activity WHERE user_id = $1 ORDER BY created_at DESC LIMIT 10',
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

    // Get user's basic info including total_points
    const userResult = await db.query(
      'SELECT total_points, global_rank FROM users WHERE user_id = $1',
      [userId]
    );

    // Get quiz session stats
    let sessionStats = { total_quizzes_taken: 0, completed_quizzes: 0, total_score_earned: 0, highest_score: 0 };
    try {
      const statsResult = await db.query(`
        SELECT 
          COUNT(*) as total_quizzes_taken,
          COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_quizzes,
          COALESCE(SUM(GREATEST(user1_score, COALESCE(user2_score, 0))), 0) as total_score_earned,
          COALESCE(MAX(GREATEST(user1_score, COALESCE(user2_score, 0))), 0) as highest_score
        FROM quiz_sessions
        WHERE user1_id = $1 OR user2_id = $1
      `, [userId]);
      if (statsResult.rows.length > 0) {
        sessionStats = statsResult.rows[0];
      }
    } catch (e) {
      console.error('Quiz sessions query error (table may not exist yet):', e.message);
    }

    const dashData = {
      total_quizzes_taken: parseInt(sessionStats.total_quizzes_taken) || 0,
      completed_quizzes: parseInt(sessionStats.completed_quizzes) || 0,
      total_score_earned: parseInt(sessionStats.total_score_earned) || (userResult.rows[0]?.total_points || 0),
      highest_score: parseInt(sessionStats.highest_score) || 0,
      global_rank: userResult.rows[0]?.global_rank || null
    };

    return success(res, dashData, 'Dashboard data fetched successfully');
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
      WHERE quiz_type = '1v1' AND (user1_id = $1 OR user2_id = $1) AND status = 'completed'
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
