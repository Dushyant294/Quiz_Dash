using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/leaderboard")]
public class LeaderboardController : ControllerBase
{
    private readonly DapperContext _db;

    public LeaderboardController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/leaderboard — Top users by points
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetLeaderboard([FromQuery] int limit = 50)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var users = await connection.QueryAsync<dynamic>(
                @"SELECT user_id, username, full_name, total_points, total_quizzes, best_category, global_rank
                  FROM users
                  WHERE is_active = true
                  ORDER BY total_points DESC
                  LIMIT @Limit",
                new { Limit = limit });

            var leaderboard = users.Select((user, index) => new
            {
                rank = index + 1,
                user_id = (int)user.user_id,
                username = (string)user.username,
                full_name = (string)user.full_name,
                total_points = (int)user.total_points,
                total_quizzes = user.total_quizzes,
                best_category = (string?)user.best_category,
                global_rank = user.global_rank
            });

            return Ok(new ApiResponse<object> { Success = true, Message = "Leaderboard fetched successfully", Data = leaderboard });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Leaderboard Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch leaderboard" });
        }
    }

    /// <summary>
    /// GET /api/leaderboard/rank/{userId} — User's rank
    /// </summary>
    [HttpGet("rank/{userId}")]
    public async Task<IActionResult> GetUserRank(int userId)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT COUNT(*) + 1 as rank
                  FROM users
                  WHERE total_points > (SELECT total_points FROM users WHERE user_id = @UserId)
                  AND is_active = true",
                new { UserId = userId });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "User rank fetched",
                Data = new { rank = result != null ? (int)(long)result.rank : 1 }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get User Rank Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch user rank" });
        }
    }
}