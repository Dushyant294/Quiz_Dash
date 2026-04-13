using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;
using dot_net_server.Services;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/quizzes")]
public class QuizController : ControllerBase
{
    private readonly DapperContext _db;
    private readonly CsvHandler _csvHandler;

    public QuizController(DapperContext db, CsvHandler csvHandler)
    {
        _db = db;
        _csvHandler = csvHandler;
    }

    /// <summary>
    /// GET /api/quizzes/latest — Latest 4 quizzes
    /// </summary>
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestQuizzes()
    {
        try
        {
            using var connection = _db.CreateConnection();
            var result = await connection.QueryAsync<dynamic>(
                @"SELECT qf.file_id, qf.file_name, qf.subject, qf.question_count, c.name as category_name
                  FROM question_files qf
                  LEFT JOIN categories c ON qf.subject = c.name
                  WHERE qf.status = 'Published' OR qf.status = 'Draft'
                  ORDER BY qf.uploaded_at DESC
                  LIMIT 4");

            var quizzes = result.Select(q => new QuizListItem
            {
                Id = (int)q.file_id,
                Title = (string)q.file_name,
                Category = (string?)q.category_name ?? (string?)q.subject ?? "General",
                QuestionsCount = (int)q.question_count
            });

            return Ok(new ApiResponse<object> { Success = true, Message = "Latest quizzes fetched successfully", Data = quizzes });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Latest Quizzes Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch latest quizzes" });
        }
    }

    /// <summary>
    /// GET /api/quizzes/explore — Explore quizzes with optional category filter
    /// </summary>
    [HttpGet("explore")]
    public async Task<IActionResult> GetExploreQuizzes([FromQuery] string? category)
    {
        try
        {
            using var connection = _db.CreateConnection();

            string sql = @"SELECT qf.file_id, qf.file_name, qf.subject, qf.question_count, c.name as category_name, c.category_id
                           FROM question_files qf
                           LEFT JOIN categories c ON qf.subject = c.name
                           WHERE qf.status = 'Published' OR qf.status = 'Draft'";

            var parameters = new DynamicParameters();

            if (!string.IsNullOrEmpty(category))
            {
                if (int.TryParse(category, out int catId))
                {
                    sql += " AND c.category_id = @CatId";
                    parameters.Add("CatId", catId);
                }
                else
                {
                    sql += " AND (c.name ILIKE @CatName OR qf.subject ILIKE @CatName)";
                    parameters.Add("CatName", $"%{category}%");
                }
            }

            sql += " ORDER BY qf.uploaded_at DESC";

            var result = await connection.QueryAsync<dynamic>(sql, parameters);

            var quizzes = result.Select(q => new QuizListItem
            {
                Id = (int)q.file_id,
                Title = (string)q.file_name,
                Category = (string?)q.category_name ?? (string?)q.subject ?? "General",
                CategoryId = (int?)q.category_id,
                QuestionsCount = (int)q.question_count
            });

            return Ok(new ApiResponse<object> { Success = true, Message = "Explore quizzes fetched successfully", Data = quizzes });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Explore Quizzes Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch explore quizzes" });
        }
    }

    /// <summary>
    /// POST /api/quizzes/upload — Upload quiz via CSV (instructor/admin)
    /// </summary>
    [HttpPost("upload")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(InstructorOrAdminFilter))]
    public async Task<IActionResult> UploadQuiz(IFormFile? csvFile, [FromForm] string? subject, [FromForm] string? topic, [FromForm] string? micro_topic)
    {
        try
        {
            if (csvFile == null || csvFile.Length == 0)
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Please upload a CSV file" });

            var userId = (int)HttpContext.Items["userId"]!;

            // 1. Parse CSV
            using var stream = csvFile.OpenReadStream();
            var parseResult = CsvParserService.ParseCsv(stream);

            if (parseResult.Questions.Count == 0)
            {
                var errorMsg = "No valid questions found in CSV.";
                if (parseResult.Errors.Count > 0)
                    errorMsg += $" Errors: {System.Text.Json.JsonSerializer.Serialize(parseResult.Errors)}";
                return BadRequest(new ApiResponse<object> { Success = false, Error = errorMsg });
            }

            // 2. Handle bulk insert with hierarchy resolution
            var result = await _csvHandler.HandleUpload(
                parseResult.Questions,
                csvFile.FileName,
                $"uploads/{csvFile.FileName}",
                subject, topic, micro_topic,
                userId);

            var data = new Dictionary<string, object?>
            {
                ["file"] = result.File,
                ["insertedCount"] = result.InsertedCount,
                ["totalParsed"] = result.TotalParsed
            };
            if (parseResult.Errors.Count > 0)
                data["parseErrors"] = parseResult.Errors;

            return StatusCode(201, new ApiResponse<object> { Success = true, Message = "Quiz uploaded successfully", Data = data });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Upload Quiz Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to upload quiz" });
        }
    }

    /// <summary>
    /// GET /api/quizzes/my — Current user's quizzes (protected)
    /// </summary>
    [HttpGet("my")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> GetMyQuizzes()
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var files = await connection.QueryAsync<dynamic>(
                "SELECT * FROM question_files WHERE uploaded_by = @UserId AND status != 'Archived' ORDER BY uploaded_at DESC",
                new { UserId = userId });

            return Ok(new ApiResponse<object> { Success = true, Message = "User quizzes fetched successfully", Data = files });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get My Quizzes Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch quizzes" });
        }
    }

    /// <summary>
    /// GET /api/quizzes/{fileId}/questions — Questions for a quiz
    /// </summary>
    [HttpGet("{fileId}/questions")]
    public async Task<IActionResult> GetQuizQuestions(int fileId)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var questions = await connection.QueryAsync<dynamic>(
                "SELECT * FROM questions WHERE file_id = @FileId AND is_active = true ORDER BY question_id ASC",
                new { FileId = fileId });

            return Ok(new ApiResponse<object> { Success = true, Message = "Quiz questions fetched successfully", Data = questions });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Quiz Questions Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch questions" });
        }
    }

    /// <summary>
    /// DELETE /api/quizzes/{fileId} — Delete a quiz (owner/admin)
    /// </summary>
    [HttpDelete("{fileId}")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> DeleteQuiz(int fileId)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            var role = HttpContext.Items["role"]?.ToString();
            using var connection = _db.CreateConnection();

            var file = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM question_files WHERE file_id = @FileId AND status != 'Archived'",
                new { FileId = fileId });

            if (file == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Quiz file not found" });

            if ((int)file.uploaded_by != userId && role != "admin")
                return StatusCode(403, new ApiResponse<object> { Success = false, Error = "Not authorized to delete this quiz" });

            // Soft delete
            await connection.ExecuteAsync("UPDATE questions SET is_active = false WHERE file_id = @FileId", new { FileId = fileId });
            await connection.ExecuteAsync("UPDATE question_files SET status = 'Archived' WHERE file_id = @FileId", new { FileId = fileId });

            return Ok(new ApiResponse<object> { Success = true, Message = "Quiz deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Delete Quiz Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to delete quiz" });
        }
    }
}