using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/users")]
public class UserController : ControllerBase
{
    private readonly DapperContext _db;

    public UserController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/users/dashboard/{id} — Dashboard metrics
    /// Mirrors Node server's userController.getDashboardData exactly.
    /// IMPORTANT: This route MUST come before /{id} to avoid wildcard capture.
    /// </summary>
    [HttpGet("dashboard/{id}")]
    public async Task<IActionResult> GetDashboardData(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            // Get user's basic info
            var userResult = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT total_points, global_rank, total_quizzes FROM users WHERE user_id = @Id",
                new { Id = id });

            // Get quiz session stats
            dynamic sessionStats;
            try
            {
                sessionStats = await connection.QueryFirstOrDefaultAsync<dynamic>(@"
                    SELECT
                        COUNT(*) as total_quizzes_taken,
                        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_quizzes,
                        COALESCE(SUM(GREATEST(user1_score, COALESCE(user2_score, 0))), 0) as total_score_earned,
                        COALESCE(MAX(GREATEST(user1_score, COALESCE(user2_score, 0))), 0) as highest_score
                    FROM quiz_sessions
                    WHERE user1_id = @Id OR user2_id = @Id",
                    new { Id = id }) ?? new { total_quizzes_taken = 0L, completed_quizzes = 0L, total_score_earned = 0L, highest_score = 0L };
            }
            catch
            {
                sessionStats = new { total_quizzes_taken = 0L, completed_quizzes = 0L, total_score_earned = 0L, highest_score = 0L };
            }

            // Get quiz activity by subject (for chart)
            IEnumerable<dynamic> subjectActivity;
            try
            {
                subjectActivity = await connection.QueryAsync<dynamic>(@"
                    SELECT s.name as subject_name, COUNT(qs.session_id) as quiz_count
                    FROM quiz_sessions qs
                    LEFT JOIN subjects s ON qs.subject_id = s.subject_id
                    WHERE (qs.user1_id = @Id OR qs.user2_id = @Id) AND qs.status = 'completed'
                    GROUP BY s.name
                    ORDER BY quiz_count DESC
                    LIMIT 5",
                    new { Id = id });
            }
            catch { subjectActivity = []; }

            // Get highest score highlights
            IEnumerable<dynamic> highestScores;
            try
            {
                highestScores = await connection.QueryAsync<dynamic>(@"
                    SELECT qa.score_percent, qa.total_questions, qa.correct_answers,
                           qf.file_name, c.name as category_name
                    FROM quiz_attempts qa
                    LEFT JOIN question_files qf ON qa.file_id = qf.file_id
                    LEFT JOIN quiz_sessions qs ON qa.session_id = qs.session_id
                    LEFT JOIN categories c ON qs.category_id = c.category_id
                    WHERE qa.user_id = @Id
                    ORDER BY qa.score_percent DESC
                    LIMIT 3",
                    new { Id = id });
            }
            catch { highestScores = []; }

            // Get contest/tournament scores
            IEnumerable<dynamic> contestScores;
            try
            {
                contestScores = await connection.QueryAsync<dynamic>(@"
                    SELECT t.name, tp.score, tp.rank
                    FROM tournament_participants tp
                    JOIN tournaments t ON tp.tournament_id = t.tournament_id
                    WHERE tp.user_id = @Id
                    ORDER BY tp.score DESC
                    LIMIT 3",
                    new { Id = id });
            }
            catch { contestScores = []; }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Dashboard data fetched successfully",
                Data = new
                {
                    total_quizzes_taken = (long)(sessionStats.total_quizzes_taken ?? 0) > 0
                        ? (long)sessionStats.total_quizzes_taken
                        : (int)(userResult?.total_quizzes ?? 0),
                    completed_quizzes = (long)(sessionStats.completed_quizzes ?? 0),
                    total_score_earned = (long)(sessionStats.total_score_earned ?? 0) > 0
                        ? (long)sessionStats.total_score_earned
                        : (int)(userResult?.total_points ?? 0),
                    highest_score = (long)(sessionStats.highest_score ?? 0),
                    global_rank = userResult?.global_rank,
                    subjectActivity,
                    highestScores,
                    contestScores
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching dashboard data: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error while fetching dashboard data" });
        }
    }

    /// <summary>
    /// GET /api/users/stats/{id} — Battle stats with win rate
    /// Mirrors Node server's userController.getUserStats exactly.
    /// </summary>
    [HttpGet("stats/{id}")]
    public async Task<IActionResult> GetUserStats(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            // Get user base stats
            var userResult = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT total_points, total_quizzes, win_rate FROM users WHERE user_id = @Id",
                new { Id = id });

            // Get win/loss ratio from quiz_sessions (battles)
            var battlesResult = await connection.QueryFirstOrDefaultAsync<dynamic>(@"
                SELECT
                    COUNT(*) as total_battles,
                    COUNT(CASE WHEN winner_id = @Id THEN 1 END) as wins
                FROM quiz_sessions
                WHERE quiz_type = '1v1' AND (user1_id = @Id OR user2_id = @Id) AND status = 'completed'",
                new { Id = id });

            long totalBattles = (long)(battlesResult?.total_battles ?? 0);
            long wins = (long)(battlesResult?.wins ?? 0);
            int winRate = totalBattles > 0
                ? (int)Math.Round((double)wins / totalBattles * 100)
                : (int)(userResult?.win_rate ?? 0);
            int totalPoints = (int)(userResult?.total_points ?? 0);

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "User stats fetched successfully",
                Data = new { total_battles = totalBattles, wins, win_rate = winRate, total_points = totalPoints }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching user stats: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error while fetching user stats" });
        }
    }

    /// <summary>
    /// GET /api/users/notifications/{id} — User notifications from activity feed
    /// Mirrors Node server's userController.getUserNotifications exactly.
    /// </summary>
    [HttpGet("notifications/{id}")]
    public async Task<IActionResult> GetUserNotifications(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var result = await connection.QueryAsync<dynamic>(
                @"SELECT activity_id, activity_type, title, score, metadata, created_at
                  FROM user_activity
                  WHERE user_id = @Id
                  ORDER BY created_at DESC
                  LIMIT 20",
                new { Id = id });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Notifications fetched successfully",
                Data = result
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching notifications: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error while fetching notifications" });
        }
    }

    /// <summary>
    /// GET /api/users/{id} — User profile with activity feed
    /// Mirrors Node server's userController.getUserProfile exactly.
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetUserProfile(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var user = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT user_id, full_name, email, username, role, profile_picture, created_at,
                         total_points, total_quizzes, global_rank, current_streak, highest_streak,
                         win_rate, time_played_min, completion_rate, best_category, fav_category, weakest_category
                  FROM users WHERE user_id = @Id",
                new { Id = id });

            if (user == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "User not found" });

            var activity = await connection.QueryAsync<dynamic>(
                @"SELECT activity_type, title as description, metadata, created_at
                  FROM user_activity WHERE user_id = @Id
                  ORDER BY created_at DESC LIMIT 10",
                new { Id = id });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "User profile fetched successfully",
                Data = new
                {
                    user_id = (int)user.user_id,
                    full_name = (string?)user.full_name,
                    email = (string?)user.email,
                    username = (string?)user.username,
                    role = (string?)user.role,
                    profile_picture = (string?)user.profile_picture,
                    created_at = (DateTime)user.created_at,
                    total_points = (int)user.total_points,
                    total_quizzes = (int)user.total_quizzes,
                    global_rank = user.global_rank,
                    current_streak = user.current_streak,
                    highest_streak = user.highest_streak,
                    win_rate = user.win_rate,
                    time_played_min = user.time_played_min,
                    completion_rate = user.completion_rate,
                    best_category = (string?)user.best_category,
                    fav_category = (string?)user.fav_category,
                    weakest_category = (string?)user.weakest_category,
                    activity_feed = activity
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Error fetching user profile: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error while fetching profile" });
        }
    }
}