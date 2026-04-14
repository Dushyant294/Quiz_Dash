using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/bug-reports")]
public class BugReportController : ControllerBase
{
    private readonly DapperContext _db;

    public BugReportController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// POST /api/bug-reports — Create bug report (protected)
    /// </summary>
    [HttpPost]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> CreateReport([FromBody] CreateBugReportRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Title))
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Title is required" });

            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var report = await connection.QueryFirstAsync<dynamic>(
                @"INSERT INTO bug_reports (reported_by, title, description, specific_issue, type, priority)
                  VALUES (@ReportedBy, @Title, @Description, @SpecificIssue, @Type, @Priority) RETURNING *",
                new
                {
                    ReportedBy = userId,
                    request.Title,
                    request.Description,
                    request.SpecificIssue,
                    Type = request.Type ?? "bug",
                    Priority = request.Priority ?? "medium"
                });

            return StatusCode(201, new ApiResponse<object> { Success = true, Message = "Bug report submitted successfully", Data = report });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Create Report Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to submit bug report" });
        }
    }

    /// <summary>
    /// GET /api/bug-reports — Get all reports (admin)
    /// </summary>
    [HttpGet]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> GetAllReports()
    {
        try
        {
            using var connection = _db.CreateConnection();
            var reports = await connection.QueryAsync<dynamic>(
                @"SELECT br.*, u.username, u.email
                  FROM bug_reports br
                  JOIN users u ON br.reported_by = u.user_id
                  ORDER BY br.created_at DESC");

            return Ok(new ApiResponse<object> { Success = true, Message = "Bug reports fetched successfully", Data = reports });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Reports Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch reports" });
        }
    }

    /// <summary>
    /// PUT /api/bug-reports/{id}/status — Update report status (admin)
    /// </summary>
    [HttpPut("{id}/status")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> UpdateReportStatus(int id, [FromBody] UpdateReportStatusRequest request)
    {
        try
        {
            var validStatuses = new[] { "unresolved", "resolved", "closed" };
            if (!validStatuses.Contains(request.Status))
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Invalid status. Must be unresolved, resolved, or closed" });

            using var connection = _db.CreateConnection();

            var resolvedAt = request.Status == "resolved" ? "CURRENT_TIMESTAMP" : "NULL";
            var updated = await connection.QueryFirstOrDefaultAsync<dynamic>(
                $"UPDATE bug_reports SET status = @Status, resolved_at = {resolvedAt} WHERE report_id = @Id RETURNING *",
                new { Status = request.Status, Id = id });

            if (updated == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Report not found" });

            return Ok(new ApiResponse<object> { Success = true, Message = $"Report marked as {request.Status}", Data = updated });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Update Report Status Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to update status" });
        }
    }
}