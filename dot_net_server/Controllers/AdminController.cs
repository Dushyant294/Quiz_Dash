using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/admin")]
[ServiceFilter(typeof(JwtAuthFilter))]
[ServiceFilter(typeof(AdminOnlyFilter))]
public class AdminController : ControllerBase
{
    private readonly DapperContext _db;

    public AdminController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/admin/dashboard — Dashboard stats
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats()
    {
        try
        {
            using var connection = _db.CreateConnection();

            var usersCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM users");
            var quizzesCount = await connection.ExecuteScalarAsync<long>("SELECT COUNT(*) FROM question_files");
            var tournamentsCount = await connection.ExecuteScalarAsync<long>(
                "SELECT COUNT(*) FROM tournaments WHERE status = 'active' OR status = 'upcoming'");
            var reportsCount = await connection.ExecuteScalarAsync<long>(
                "SELECT COUNT(*) FROM bug_reports WHERE status = 'unresolved'");

            var recentActivity = await connection.QueryAsync<dynamic>(
                @"SELECT ua.*, u.username, u.full_name
                  FROM user_activity ua
                  JOIN users u ON ua.user_id = u.user_id
                  ORDER BY ua.created_at DESC LIMIT 5");

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Dashboard stats fetched",
                Data = new
                {
                    totalUsers = (int)usersCount,
                    totalQuizzes = (int)quizzesCount,
                    activeTournaments = (int)tournamentsCount,
                    pendingReports = (int)reportsCount,
                    recentActivity
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Dashboard Stats Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch dashboard stats" });
        }
    }

    /// <summary>
    /// GET /api/admin/users — All users
    /// </summary>
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            using var connection = _db.CreateConnection();
            var users = await connection.QueryAsync<dynamic>(
                "SELECT user_id, full_name, email, username, role, total_points, is_active, created_at FROM users ORDER BY created_at DESC");

            return Ok(new ApiResponse<object> { Success = true, Message = "Users fetched successfully", Data = users });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Users Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch users" });
        }
    }

    /// <summary>
    /// PUT /api/admin/users/{id}/role — Update user role
    /// </summary>
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> UpdateUserRole(int id, [FromBody] UpdateUserRoleRequest request)
    {
        try
        {
            var validRoles = new[] { "student", "instructor", "admin" };
            if (!validRoles.Contains(request.Role))
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Invalid role" });

            using var connection = _db.CreateConnection();
            var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "UPDATE users SET role = @Role, updated_at = CURRENT_TIMESTAMP WHERE user_id = @Id RETURNING user_id, username, role",
                new { Role = request.Role, Id = id });

            if (result == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "User not found" });

            return Ok(new ApiResponse<object> { Success = true, Message = $"User role updated to {request.Role}", Data = result });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Update Role Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to update role" });
        }
    }

    /// <summary>
    /// PUT /api/admin/users/{id}/active — Toggle user active status
    /// </summary>
    [HttpPut("users/{id}/active")]
    public async Task<IActionResult> ToggleUserActive(int id, [FromBody] ToggleUserActiveRequest request)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "UPDATE users SET is_active = @IsActive, updated_at = CURRENT_TIMESTAMP WHERE user_id = @Id RETURNING user_id, username, is_active",
                new { request.IsActive, Id = id });

            if (result == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "User not found" });

            bool active = (bool)result.is_active;
            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = $"User {(active ? "activated" : "deactivated")}",
                Data = result
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Toggle Active Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to toggle user status" });
        }
    }

    /// <summary>
    /// DELETE /api/admin/users/{id} — Delete user
    /// </summary>
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();
            await connection.ExecuteAsync("DELETE FROM users WHERE user_id = @Id", new { Id = id });
            return Ok(new ApiResponse<object> { Success = true, Message = "User deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Delete User Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to delete user" });
        }
    }

    /// <summary>
    /// GET /api/admin/content — All question files
    /// </summary>
    [HttpGet("content")]
    public async Task<IActionResult> GetAllContent()
    {
        try
        {
            using var connection = _db.CreateConnection();
            var files = await connection.QueryAsync<dynamic>(
                @"SELECT qf.*, u.username as uploaded_by_username
                  FROM question_files qf
                  LEFT JOIN users u ON qf.uploaded_by = u.user_id
                  WHERE qf.status != 'Archived'
                  ORDER BY qf.uploaded_at DESC");

            return Ok(new ApiResponse<object> { Success = true, Message = "Content fetched successfully", Data = files });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Content Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch content" });
        }
    }

    /// <summary>
    /// GET /api/admin/content/{fileId}/questions — Questions in a file
    /// </summary>
    [HttpGet("content/{fileId}/questions")]
    public async Task<IActionResult> GetContentQuestions(int fileId)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var questions = await connection.QueryAsync<dynamic>(
                "SELECT * FROM questions WHERE file_id = @FileId AND is_active = true ORDER BY question_id ASC",
                new { FileId = fileId });

            return Ok(new ApiResponse<object> { Success = true, Message = "Questions fetched successfully", Data = questions });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Content Questions Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch questions" });
        }
    }

    /// <summary>
    /// DELETE /api/admin/content/{fileId} — Delete content file (soft delete)
    /// </summary>
    [HttpDelete("content/{fileId}")]
    public async Task<IActionResult> DeleteContent(int fileId)
    {
        try
        {
            using var connection = _db.CreateConnection();
            await connection.ExecuteAsync("UPDATE questions SET is_active = false WHERE file_id = @FileId", new { FileId = fileId });
            await connection.ExecuteAsync("UPDATE question_files SET status = 'Archived' WHERE file_id = @FileId", new { FileId = fileId });
            return Ok(new ApiResponse<object> { Success = true, Message = "Content deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Delete Content Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to delete content" });
        }
    }

    /// <summary>
    /// DELETE /api/admin/questions/{questionId} — Delete single question (soft delete)
    /// </summary>
    [HttpDelete("questions/{questionId}")]
    public async Task<IActionResult> DeleteQuestion(int questionId)
    {
        try
        {
            using var connection = _db.CreateConnection();
            await connection.ExecuteAsync("UPDATE questions SET is_active = false WHERE question_id = @Id", new { Id = questionId });
            return Ok(new ApiResponse<object> { Success = true, Message = "Question deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Delete Question Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to delete question" });
        }
    }

    /// <summary>
    /// PUT /api/admin/questions/{questionId} — Update a question
    /// Mirrors Node server's adminController.updateQuestion exactly.
    /// </summary>
    [HttpPut("questions/{questionId}")]
    public async Task<IActionResult> UpdateQuestion(int questionId, [FromBody] UpdateQuestionRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.FullQuestionText) ||
                string.IsNullOrWhiteSpace(request.OptionA) ||
                string.IsNullOrWhiteSpace(request.OptionB) ||
                string.IsNullOrWhiteSpace(request.CorrectAnswer))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Question text, at least options A & B, and correct answer are required"
                });
            }

            using var connection = _db.CreateConnection();

            var updated = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"UPDATE questions SET
                    full_question_text = @FullQuestionText,
                    option_a = @OptionA,
                    option_b = @OptionB,
                    option_c = @OptionC,
                    option_d = @OptionD,
                    correct_answer = @CorrectAnswer,
                    hint = @Hint,
                    explanation = @Explanation,
                    updated_at = CURRENT_TIMESTAMP
                  WHERE question_id = @QuestionId RETURNING *",
                new
                {
                    request.FullQuestionText,
                    request.OptionA,
                    request.OptionB,
                    request.OptionC,
                    request.OptionD,
                    request.CorrectAnswer,
                    request.Hint,
                    request.Explanation,
                    QuestionId = questionId
                });

            if (updated == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Question not found" });

            return Ok(new ApiResponse<object> { Success = true, Message = "Question updated successfully", Data = updated });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Update Question Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to update question" });
        }
    }
}