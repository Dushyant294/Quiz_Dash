using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;
using dot_net_server.Models;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/tournaments")]
public class TournamentController : ControllerBase
{
    private readonly DapperContext _db;

    public TournamentController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// POST /api/tournaments — Create tournament (admin)
    /// </summary>
    [HttpPost]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> CreateTournament([FromBody] CreateTournamentRequest request)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var tournament = await connection.QueryFirstAsync<dynamic>(
                @"INSERT INTO tournaments (
                    name, description, category_id, subject, thumbnail_url,
                    start_date, end_date, registration_deadline, rounds, total_questions, created_by
                  ) VALUES (@Name, @Description, @CategoryId, @Subject, @ThumbnailUrl,
                    @StartDate, @EndDate, @RegistrationDeadline, @Rounds, @TotalQuestions, @CreatedBy) RETURNING *",
                new
                {
                    request.Name,
                    request.Description,
                    CategoryId = request.CategoryId ?? (int?)null,
                    request.Subject,
                    request.ThumbnailUrl,
                    request.StartDate,
                    request.EndDate,
                    request.RegistrationDeadline,
                    request.Rounds,
                    request.TotalQuestions,
                    CreatedBy = userId
                });

            return StatusCode(201, new ApiResponse<object> { Success = true, Message = "Tournament created successfully", Data = tournament });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Create Tournament Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to create tournament" });
        }
    }

    /// <summary>
    /// GET /api/tournaments — All tournaments with optional category filter
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllTournaments([FromQuery] int? category_id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            string query = @"SELECT t.*, c.name as category_name,
                (SELECT COUNT(*) FROM tournament_participants tp WHERE tp.tournament_id = t.tournament_id) as participant_count
              FROM tournaments t
              LEFT JOIN categories c ON t.category_id = c.category_id";

            if (category_id.HasValue)
                query += " WHERE t.category_id = @CategoryId";

            query += " ORDER BY t.created_at DESC";

            var tournaments = await connection.QueryAsync<dynamic>(query, new { CategoryId = category_id });
            return Ok(new ApiResponse<object> { Success = true, Message = "Tournaments fetched successfully", Data = tournaments });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Tournaments Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch tournaments" });
        }
    }

    /// <summary>
    /// GET /api/tournaments/{id} — Single tournament with participants
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTournamentById(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var tournament = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT t.*, c.name as category_name,
                    (SELECT COUNT(*) FROM tournament_participants tp WHERE tp.tournament_id = t.tournament_id) as participant_count
                  FROM tournaments t
                  LEFT JOIN categories c ON t.category_id = c.category_id
                  WHERE t.tournament_id = @Id",
                new { Id = id });

            if (tournament == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Tournament not found" });

            var participants = await connection.QueryAsync<dynamic>(
                @"SELECT tp.*, u.username, u.full_name, u.total_points
                  FROM tournament_participants tp
                  JOIN users u ON tp.user_id = u.user_id
                  WHERE tp.tournament_id = @Id
                  ORDER BY tp.score DESC",
                new { Id = id });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Tournament fetched successfully",
                Data = new
                {
                    tournament_id = (int)tournament.tournament_id,
                    name = (string)tournament.name,
                    description = (string?)tournament.description,
                    category_id = tournament.category_id,
                    subject = (string?)tournament.subject,
                    thumbnail_url = (string?)tournament.thumbnail_url,
                    start_date = (DateTime)tournament.start_date,
                    end_date = (DateTime)tournament.end_date,
                    registration_deadline = tournament.registration_deadline,
                    rounds = (int)tournament.rounds,
                    total_questions = (int)tournament.total_questions,
                    status = (string)tournament.status,
                    created_by = (int)tournament.created_by,
                    created_at = (DateTime)tournament.created_at,
                    category_name = (string?)tournament.category_name,
                    participant_count = (long)tournament.participant_count,
                    participants
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Tournament Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch tournament" });
        }
    }

    /// <summary>
    /// POST /api/tournaments/{id}/join — Join tournament (protected)
    /// </summary>
    [HttpPost("{id}/join")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> JoinTournament(int id)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var exists = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT id FROM tournament_participants WHERE tournament_id = @TournamentId AND user_id = @UserId",
                new { TournamentId = id, UserId = userId });

            if (exists != null)
                return BadRequest(new ApiResponse<object> { Success = false, Error = "You have already joined this tournament" });

            var result = await connection.QueryFirstAsync<dynamic>(
                "INSERT INTO tournament_participants (tournament_id, user_id) VALUES (@TournamentId, @UserId) RETURNING *",
                new { TournamentId = id, UserId = userId });

            return Ok(new ApiResponse<object> { Success = true, Message = "Joined tournament successfully", Data = result });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Join Tournament Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to join tournament" });
        }
    }

    /// <summary>
    /// PUT /api/tournaments/{id} — Update tournament (admin)
    /// </summary>
    [HttpPut("{id}")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> UpdateTournament(int id, [FromBody] Dictionary<string, object> body)
    {
        try
        {
            if (body.Count == 0)
                return BadRequest(new ApiResponse<object> { Success = false, Error = "No fields to update" });

            using var connection = _db.CreateConnection();

            var setClauses = new List<string>();
            var parameters = new DynamicParameters();
            foreach (var kvp in body)
            {
                setClauses.Add($"{kvp.Key} = @{kvp.Key}");
                if (kvp.Value is System.Text.Json.JsonElement element)
                {
                    switch (element.ValueKind)
                    {
                        case System.Text.Json.JsonValueKind.String:
                            if (element.TryGetDateTime(out var dateValue))
                                parameters.Add(kvp.Key, dateValue);
                            else
                                parameters.Add(kvp.Key, element.GetString());
                            break;
                        case System.Text.Json.JsonValueKind.Number:
                            if (element.TryGetInt32(out var intValue))
                                parameters.Add(kvp.Key, intValue);
                            else if (element.TryGetDecimal(out var decValue))
                                parameters.Add(kvp.Key, decValue);
                            else
                                parameters.Add(kvp.Key, element.GetDouble());
                            break;
                        case System.Text.Json.JsonValueKind.True:
                            parameters.Add(kvp.Key, true);
                            break;
                        case System.Text.Json.JsonValueKind.False:
                            parameters.Add(kvp.Key, false);
                            break;
                        case System.Text.Json.JsonValueKind.Null:
                            parameters.Add(kvp.Key, null);
                            break;
                        default:
                            parameters.Add(kvp.Key, element.ToString());
                            break;
                    }
                }
                else
                {
                    parameters.Add(kvp.Key, kvp.Value);
                }
            }
            setClauses.Add("updated_at = CURRENT_TIMESTAMP");
            parameters.Add("Id", id);

            var sql = $"UPDATE tournaments SET {string.Join(", ", setClauses)} WHERE tournament_id = @Id RETURNING *";
            var updated = await connection.QueryFirstOrDefaultAsync<dynamic>(sql, parameters);

            if (updated == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Tournament not found" });

            return Ok(new ApiResponse<object> { Success = true, Message = "Tournament updated successfully", Data = updated });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Update Tournament Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to update tournament" });
        }
    }

    /// <summary>
    /// POST /api/tournaments/{id}/end — End tournament (admin)
    /// </summary>
    [HttpPost("{id}/end")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    [ServiceFilter(typeof(AdminOnlyFilter))]
    public async Task<IActionResult> EndTournament(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();
            var ended = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "UPDATE tournaments SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE tournament_id = @Id RETURNING *",
                new { Id = id });

            if (ended == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Tournament not found" });

            return Ok(new ApiResponse<object> { Success = true, Message = "Tournament ended successfully", Data = ended });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"End Tournament Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to end tournament" });
        }
    }

    /// <summary>
    /// GET /api/tournaments/{id}/leaderboard — Tournament leaderboard
    /// Mirrors Node server's tournamentController.getLeaderboard exactly.
    /// </summary>
    [HttpGet("{id}/leaderboard")]
    public async Task<IActionResult> GetLeaderboard(int id)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var leaderboard = await connection.QueryAsync<dynamic>(
                @"SELECT u.user_id, u.username, u.full_name, MAX(t.score) AS best_score, MIN(t.time_taken) AS time_taken
                  FROM tournament_attempts t
                  JOIN users u ON t.user_id = u.user_id
                  WHERE t.tournament_id = @Id
                  GROUP BY u.user_id, u.username, u.full_name
                  ORDER BY best_score DESC, time_taken ASC",
                new { Id = id });

            return Ok(new ApiResponse<object> { Success = true, Message = "Leaderboard fetched successfully", Data = leaderboard });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Leaderboard Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch leaderboard" });
        }
    }

    /// <summary>
    /// GET /api/tournaments/{id}/my-attempts — User's attempt count and best score
    /// Mirrors Node server's tournamentController.getMyAttempts exactly.
    /// </summary>
    [HttpGet("{id}/my-attempts")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> GetMyAttempts(int id)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var attempts = await connection.ExecuteScalarAsync<long>(
                "SELECT COUNT(*) FROM tournament_attempts WHERE tournament_id = @TournamentId AND user_id = @UserId",
                new { TournamentId = id, UserId = userId });

            var bestScoreResult = await connection.ExecuteScalarAsync<int?>(
                "SELECT MAX(score) FROM tournament_attempts WHERE tournament_id = @TournamentId AND user_id = @UserId",
                new { TournamentId = id, UserId = userId });

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Attempts fetched successfully",
                Data = new { attemptsLeft = Math.Max(0, 3 - (int)attempts), bestScore = bestScoreResult ?? 0 }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get My Attempts Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch your attempts" });
        }
    }

    /// <summary>
    /// POST /api/tournaments/{id}/attempt — Record attempt
    /// Mirrors Node server's tournamentController.recordAttempt exactly.
    /// </summary>
    [HttpPost("{id}/attempt")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> RecordAttempt(int id, [FromBody] RecordAttemptRequest request)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            // Check attempt count
            var count = await connection.ExecuteScalarAsync<long>(
                "SELECT COUNT(*) FROM tournament_attempts WHERE tournament_id = @TournamentId AND user_id = @UserId",
                new { TournamentId = id, UserId = userId });

            if (count >= 3)
                return StatusCode(403, new ApiResponse<object> { Success = false, Error = "Maximum 3 attempts reached" });

            // Auto-join if not joined
            var exists = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT id FROM tournament_participants WHERE tournament_id = @TournamentId AND user_id = @UserId",
                new { TournamentId = id, UserId = userId });

            if (exists == null)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO tournament_participants (tournament_id, user_id) VALUES (@TournamentId, @UserId)",
                    new { TournamentId = id, UserId = userId });
            }

            // Record attempt
            var attempt = await connection.QueryFirstAsync<dynamic>(
                @"INSERT INTO tournament_attempts (tournament_id, user_id, score, correct_answers, total_questions, time_taken)
                  VALUES (@TournamentId, @UserId, @Score, @CorrectAnswers, @TotalQuestions, @TimeTaken) RETURNING *",
                new
                {
                    TournamentId = id,
                    UserId = userId,
                    Score = request.Score,
                    CorrectAnswers = request.CorrectAnswers,
                    TotalQuestions = request.TotalQuestions,
                    TimeTaken = request.TimeTaken
                });

            // Update best score in participants table
            await connection.ExecuteAsync(
                "UPDATE tournament_participants SET score = GREATEST(score, @Score) WHERE tournament_id = @TournamentId AND user_id = @UserId",
                new { Score = request.Score, TournamentId = id, UserId = userId });

            return StatusCode(201, new ApiResponse<object> { Success = true, Message = "Attempt recorded successfully", Data = attempt });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Record Attempt Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to record attempt" });
        }
    }
}