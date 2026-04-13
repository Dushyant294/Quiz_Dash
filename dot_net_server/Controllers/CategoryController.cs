using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoryController : ControllerBase
{
    private readonly DapperContext _db;

    public CategoryController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/categories — All categories
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllCategories()
    {
        try
        {
            using var connection = _db.CreateConnection();
            var categories = await connection.QueryAsync<dynamic>(
                "SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC");

            return Ok(new ApiResponse<object> { Success = true, Message = "Categories fetched successfully", Data = categories });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Categories Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch categories" });
        }
    }

    /// <summary>
    /// GET /api/categories/{id}/subjects — Subjects for a category
    /// </summary>
    [HttpGet("{id}/subjects")]
    public async Task<IActionResult> GetSubjects(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var subjects = await connection.QueryAsync<dynamic>(
                "SELECT * FROM subjects WHERE category_id = @Id ORDER BY name ASC",
                new { Id = id });

            return Ok(new ApiResponse<object> { Success = true, Message = "Subjects fetched successfully", Data = subjects });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Subjects Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch subjects" });
        }
    }
}

/// <summary>
/// Separate controller for /api/subjects/{id}/topics route
/// </summary>
[ApiController]
[Route("api/subjects")]
public class SubjectController : ControllerBase
{
    private readonly DapperContext _db;

    public SubjectController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/subjects/{id}/topics — Topics for a subject
    /// </summary>
    [HttpGet("{id}/topics")]
    public async Task<IActionResult> GetTopics(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var topics = await connection.QueryAsync<dynamic>(
                "SELECT * FROM topics WHERE subject_id = @Id ORDER BY name ASC",
                new { Id = id });

            return Ok(new ApiResponse<object> { Success = true, Message = "Topics fetched successfully", Data = topics });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Topics Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch topics" });
        }
    }
}

/// <summary>
/// Separate controller for /api/topics/{id}/micro-topics route
/// </summary>
[ApiController]
[Route("api/topics")]
public class TopicController : ControllerBase
{
    private readonly DapperContext _db;

    public TopicController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// GET /api/topics/{id}/micro-topics — Micro topics for a topic
    /// </summary>
    [HttpGet("{id}/micro-topics")]
    public async Task<IActionResult> GetMicroTopics(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var microTopics = await connection.QueryAsync<dynamic>(
                "SELECT * FROM micro_topics WHERE topic_id = @Id ORDER BY name ASC",
                new { Id = id });

            return Ok(new ApiResponse<object> { Success = true, Message = "Micro topics fetched successfully", Data = microTopics });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Micro Topics Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch micro topics" });
        }
    }
}