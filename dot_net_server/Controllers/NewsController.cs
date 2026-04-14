using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly DapperContext _db;

    public NewsController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// POST /api/news — Create news (admin)
    /// </summary>
    [HttpPost]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> CreateNews([FromBody] CreateNewsRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Title) || string.IsNullOrWhiteSpace(request.Description))
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Title and description are required" });

            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var news = await connection.QueryFirstAsync<dynamic>(
                @"INSERT INTO news_updates (title, description, tag, published_by)
                  VALUES (@Title, @Description, @Tag, @PublishedBy) RETURNING *",
                new
                {
                    request.Title,
                    request.Description,
                    Tag = request.Tag ?? "NEW FEATURE",
                    PublishedBy = userId
                });

            return StatusCode(201, new ApiResponse<object> { Success = true, Message = "News published successfully", Data = news });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Create News Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to publish news" });
        }
    }

    /// <summary>
    /// GET /api/news — Get all news with optional tag filter
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllNews([FromQuery] string? tag)
    {
        try
        {
            using var connection = _db.CreateConnection();

            IEnumerable<dynamic> news;
            if (!string.IsNullOrEmpty(tag) && tag != "All Updates")
            {
                news = await connection.QueryAsync<dynamic>(
                    "SELECT * FROM news_updates WHERE tag = @Tag ORDER BY published_at DESC",
                    new { Tag = tag });
            }
            else
            {
                news = await connection.QueryAsync<dynamic>(
                    "SELECT * FROM news_updates ORDER BY published_at DESC");
            }

            return Ok(new ApiResponse<object> { Success = true, Message = "News fetched successfully", Data = news });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get News Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch news" });
        }
    }

    /// <summary>
    /// GET /api/news/latest — Get latest single news item
    /// Mirrors Node server's newsController.getLatestNews exactly.
    /// </summary>
    [HttpGet("latest")]
    public async Task<IActionResult> GetLatestNews()
    {
        try
        {
            using var connection = _db.CreateConnection();
            var news = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM news_updates ORDER BY published_at DESC LIMIT 1");

            return Ok(new ApiResponse<object> { Success = true, Message = "Latest news fetched successfully", Data = news });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Latest News Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch latest news" });
        }
    }

    /// <summary>
    /// DELETE /api/news/{id} — Delete news (admin)
    /// </summary>
    [HttpDelete("{id}")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> DeleteNews(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var existing = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM news_updates WHERE news_id = @Id", new { Id = id });
            if (existing == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "News not found" });

            await connection.ExecuteAsync("DELETE FROM news_updates WHERE news_id = @Id", new { Id = id });
            return Ok(new ApiResponse<object> { Success = true, Message = "News deleted successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Delete News Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to delete news" });
        }
    }
}
