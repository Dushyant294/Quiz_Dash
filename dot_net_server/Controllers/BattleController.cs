using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Middleware;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/battle")]
public class BattleController : ControllerBase
{
    private readonly DapperContext _db;

    public BattleController(DapperContext db)
    {
        _db = db;
    }

    /// <summary>
    /// POST /api/battle/find-match — HTTP matchmaking fallback for 1v1 battles.
    /// Mirrors Node server's battleController.findMatch exactly.
    /// </summary>
    [HttpPost("find-match")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> FindMatch([FromBody] FindMatchRequest request)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            var qCount = Math.Min(request.QuestionCount ?? 10, 30);

            using var connection = _db.CreateConnection();

            // Cancel any expired waiting sessions first
            await connection.ExecuteAsync(
                "UPDATE quiz_sessions SET status = 'cancelled' WHERE status = 'waiting' AND started_at < NOW() - INTERVAL '5 minutes'");

            // 1. Look for an existing waiting session matching category + subject
            var sql = "SELECT * FROM quiz_sessions WHERE status = 'waiting' AND quiz_type = '1v1' AND user1_id != @UserId";
            var parameters = new DynamicParameters();
            parameters.Add("UserId", userId);

            if (request.CategoryId.HasValue)
            {
                sql += " AND category_id = @CategoryId";
                parameters.Add("CategoryId", request.CategoryId);
            }
            if (request.SubjectId.HasValue)
            {
                sql += " AND subject_id = @SubjectId";
                parameters.Add("SubjectId", request.SubjectId);
            }
            sql += " ORDER BY started_at ASC LIMIT 1";

            var existingSession = await connection.QueryFirstOrDefaultAsync<dynamic>(sql, parameters);

            if (existingSession != null)
            {
                // Found an opponent — join the session
                var joined = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "UPDATE quiz_sessions SET user2_id = @UserId, status = 'in_progress' WHERE session_id = @SessionId AND status = 'waiting' RETURNING *",
                    new { UserId = userId, SessionId = (int)existingSession.session_id });

                if (joined != null)
                {
                    return Ok(new ApiResponse<object>
                    {
                        Success = true,
                        Message = "Opponent found! Battle starting.",
                        Data = new
                        {
                            session = joined,
                            matched = true,
                            questionCount = (int)joined.question_count
                        }
                    });
                }
            }

            // 2. No match found — fetch questions and create a waiting session
            var questionSql = "SELECT * FROM questions WHERE is_active = true";
            var qParams = new DynamicParameters();

            if (request.CategoryId.HasValue)
            {
                questionSql += " AND category_id = @CategoryId";
                qParams.Add("CategoryId", request.CategoryId);
            }
            if (request.SubjectId.HasValue)
            {
                questionSql += " AND subject_id = @SubjectId";
                qParams.Add("SubjectId", request.SubjectId);
            }
            questionSql += " ORDER BY RANDOM() LIMIT @Limit";
            qParams.Add("Limit", qCount);

            var questions = (await connection.QueryAsync<dynamic>(questionSql, qParams)).ToList();

            if (questions.Count == 0)
                return NotFound(new ApiResponse<object> { Success = false, Error = "No questions match the selected criteria" });

            var firstQ = questions[0];
            // Create session with 'waiting' status
            var session = await connection.QueryFirstAsync<dynamic>(
                @"INSERT INTO quiz_sessions (
                    quiz_type, category_id, subject_id, topic_id, micro_topic_id,
                    difficulty, question_count, time_per_question, user1_id, user2_id, status
                  ) VALUES ('1v1', @CategoryId, @SubjectId, @TopicId, @MicroTopicId,
                    'Medium', @QuestionCount, 60, @User1Id, NULL, 'waiting') RETURNING *",
                new
                {
                    CategoryId = request.CategoryId ?? (int?)firstQ.category_id,
                    SubjectId = request.SubjectId ?? (int?)firstQ.subject_id,
                    TopicId = (int?)null,
                    MicroTopicId = (int?)null,
                    QuestionCount = questions.Count,
                    User1Id = userId
                });

            // Link questions to session
            for (int i = 0; i < questions.Count; i++)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO quiz_session_questions (session_id, question_id, question_order) VALUES (@SessionId, @QuestionId, @Order)",
                    new { SessionId = (int)session.session_id, QuestionId = (int)questions[i].question_id, Order = i + 1 });
            }

            return StatusCode(201, new ApiResponse<object>
            {
                Success = true,
                Message = "Waiting for opponent...",
                Data = new { session, matched = false, questionCount = questions.Count }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Find Match Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to find match" });
        }
    }

    /// <summary>
    /// GET /api/battle/{sessionId}/status — Check match status (polling for 1v1)
    /// Mirrors Node server's battleController.checkMatchStatus exactly.
    /// </summary>
    [HttpGet("{sessionId}/status")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> CheckMatchStatus(int sessionId)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var session = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM quiz_sessions WHERE session_id = @SessionId",
                new { SessionId = sessionId });

            if (session == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Session not found" });

            // Check if 5 min timeout exceeded
            var startedAt = (DateTime)session.started_at;
            var waitingTime = DateTime.UtcNow - startedAt;
            var fiveMinutes = TimeSpan.FromMinutes(5);

            if ((string)session.status == "waiting" && waitingTime > fiveMinutes)
            {
                await connection.ExecuteAsync(
                    "UPDATE quiz_sessions SET status = 'cancelled' WHERE session_id = @SessionId",
                    new { SessionId = sessionId });

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Match timed out",
                    Data = new { status = "cancelled", matched = false, message = "No opponent found" }
                });
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Match status fetched",
                Data = new
                {
                    status = (string)session.status,
                    matched = (string)session.status == "in_progress" && session.user2_id != null,
                    session
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Check Match Status Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to check status" });
        }
    }

    /// <summary>
    /// POST /api/battle/create — Create quiz session (solo mode)
    /// Mirrors Node server's battleController.createSession exactly.
    /// </summary>
    [HttpPost("create")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> CreateSession([FromBody] CreateSessionRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.QuizType))
                return BadRequest(new ApiResponse<object> { Success = false, Error = "quiz_type is required" });

            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            // 1. Fetch questions
            IEnumerable<dynamic> questions;
            int? finalSubjectId = request.SubjectId;

            if (request.FileId.HasValue)
            {
                questions = await connection.QueryAsync<dynamic>(
                    "SELECT * FROM questions WHERE file_id = @FileId AND is_active = true ORDER BY question_id ASC",
                    new { FileId = request.FileId.Value });

                if (!questions.Any())
                    return NotFound(new ApiResponse<object> { Success = false, Error = "No questions found for this quiz" });

                if (request.QuestionCount.HasValue && request.QuestionCount.Value < questions.Count())
                    questions = questions.Take(request.QuestionCount.Value);
            }
            else
            {
                if (!request.QuestionCount.HasValue)
                    return BadRequest(new ApiResponse<object> { Success = false, Error = "question_count is required when no file_id is provided" });

                // Build dynamic filter query
                var sql = "SELECT * FROM questions WHERE is_active = true";
                var parameters = new DynamicParameters();

                if (request.CategoryId.HasValue) { sql += " AND category_id = @CategoryId"; parameters.Add("CategoryId", request.CategoryId); }
                if (finalSubjectId.HasValue) { sql += " AND subject_id = @SubjectId"; parameters.Add("SubjectId", finalSubjectId); }
                if (request.TopicId.HasValue) { sql += " AND topic_id = @TopicId"; parameters.Add("TopicId", request.TopicId); }
                if (request.MicroTopicId.HasValue) { sql += " AND micro_topic_id = @MicroTopicId"; parameters.Add("MicroTopicId", request.MicroTopicId); }
                if (!string.IsNullOrEmpty(request.Difficulty)) { sql += " AND difficulty_label = @Difficulty"; parameters.Add("Difficulty", request.Difficulty); }

                sql += " ORDER BY RANDOM() LIMIT @Limit";
                parameters.Add("Limit", request.QuestionCount.Value);

                questions = await connection.QueryAsync<dynamic>(sql, parameters);
            }

            if (!questions.Any())
                return NotFound(new ApiResponse<object> { Success = false, Error = "No questions match the selected criteria" });

            var questionList = questions.ToList();

            // 2. Create session
            var firstQ = questionList[0];
            var session = await connection.QueryFirstAsync<dynamic>(
                @"INSERT INTO quiz_sessions (
                    quiz_type, category_id, subject_id, topic_id, micro_topic_id,
                    difficulty, question_count, time_per_question, user1_id, user2_id, status
                  ) VALUES (@QuizType, @CategoryId, @SubjectId, @TopicId, @MicroTopicId,
                    @Difficulty, @QuestionCount, @TimePerQuestion, @User1Id, NULL, 'in_progress') RETURNING *",
                new
                {
                    request.QuizType,
                    CategoryId = request.CategoryId ?? (int?)firstQ.category_id,
                    SubjectId = finalSubjectId ?? (int?)firstQ.subject_id,
                    TopicId = request.TopicId ?? (int?)firstQ.topic_id,
                    MicroTopicId = request.MicroTopicId ?? (int?)firstQ.micro_topic_id,
                    Difficulty = request.Difficulty ?? ((string?)firstQ.difficulty_label ?? "Medium"),
                    QuestionCount = questionList.Count,
                    TimePerQuestion = request.TimePerQuestion ?? 60,
                    User1Id = userId
                });

            // 3. Link questions to session
            for (int i = 0; i < questionList.Count; i++)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO quiz_session_questions (session_id, question_id, question_order) VALUES (@SessionId, @QuestionId, @Order)",
                    new { SessionId = (int)session.session_id, QuestionId = (int)questionList[i].question_id, Order = i + 1 });
            }

            return StatusCode(201, new ApiResponse<object>
            {
                Success = true,
                Message = "Quiz session created",
                Data = new { session, questionCount = questionList.Count }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Create Session Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to create session" });
        }
    }

    /// <summary>
    /// GET /api/battle/{sessionId}/questions — Get session questions (no answers leaked) + opponent name
    /// Mirrors Node server's battleController.getSessionQuestions exactly.
    /// </summary>
    [HttpGet("{sessionId}/questions")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> GetSessionQuestions(int sessionId)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var session = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM quiz_sessions WHERE session_id = @SessionId",
                new { SessionId = sessionId });

            if (session == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Session not found" });

            var questions = await connection.QueryAsync<dynamic>(
                @"SELECT qsq.id, qsq.question_id, qsq.question_order,
                         q.full_question_text, q.option_a, q.option_b, q.option_c, q.option_d,
                         q.question_image_url, q.difficulty_label
                  FROM quiz_session_questions qsq
                  JOIN questions q ON qsq.question_id = q.question_id
                  WHERE qsq.session_id = @SessionId
                  ORDER BY qsq.question_order ASC",
                new { SessionId = sessionId });

            // Get opponent name for 1v1
            string? opponentName = null;
            if ((string)session.quiz_type == "1v1")
            {
                bool isUser1 = (int)session.user1_id == userId;
                int? opponentId = isUser1 ? (int?)session.user2_id : (int?)session.user1_id;
                if (opponentId.HasValue)
                {
                    var opp = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        "SELECT username, full_name FROM users WHERE user_id = @Id",
                        new { Id = opponentId.Value });
                    if (opp != null)
                        opponentName = (string?)opp.full_name ?? (string?)opp.username;
                }
            }

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = "Session questions fetched",
                Data = new
                {
                    questions,
                    timePerQuestion = (int)(session.time_per_question ?? 60),
                    quizType = (string)session.quiz_type,
                    opponentName
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Get Session Questions Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to fetch session questions" });
        }
    }

    /// <summary>
    /// POST /api/battle/{sessionId}/answer — Submit answer (includes timeTaken)
    /// Mirrors Node server's battleController.submitAnswer exactly.
    /// </summary>
    [HttpPost("{sessionId}/answer")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> SubmitAnswer(int sessionId, [FromBody] SubmitAnswerRequest request)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var session = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM quiz_sessions WHERE session_id = @SessionId",
                new { SessionId = sessionId });

            if (session == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Session not found" });

            bool isUser1 = (int)session.user1_id == userId;
            string col = isUser1 ? "user1_answer" : "user2_answer";
            string correctCol = isUser1 ? "user1_correct" : "user2_correct";
            string timeCol = isUser1 ? "user1_time_sec" : "user2_time_sec";

            // Get correct answer
            var qResult = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT q.correct_answer FROM quiz_session_questions qsq
                  JOIN questions q ON qsq.question_id = q.question_id
                  WHERE qsq.id = @QuestionId",
                new { QuestionId = request.QuestionId });

            if (qResult == null)
                return Ok(new ApiResponse<object> { Success = true, Message = "Answer submitted", Data = new { isCorrect = false } });

            string? correctAnswer = (string?)qResult.correct_answer;
            // Robust answer matching: compare trimmed, case-insensitive (mirrors Node.js logic)
            bool isCorrect = correctAnswer != null && request.Answer != null &&
                correctAnswer.Trim().Equals(request.Answer.Trim(), StringComparison.OrdinalIgnoreCase);

            await connection.ExecuteAsync(
                $"UPDATE quiz_session_questions SET {col} = @Answer, {correctCol} = @IsCorrect, {timeCol} = @TimeTaken, answered_at = CURRENT_TIMESTAMP WHERE id = @QuestionId",
                new { Answer = request.Answer, IsCorrect = isCorrect, TimeTaken = request.TimeTaken, QuestionId = request.QuestionId });

            return Ok(new ApiResponse<object> { Success = true, Message = "Answer submitted", Data = new { isCorrect } });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Submit Answer Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to submit answer" });
        }
    }

    /// <summary>
    /// POST /api/battle/{sessionId}/complete — Complete session with full finalize logic.
    /// Mirrors Node server's battleController.completeSession + finalizeSession exactly.
    /// Handles: per-player completion, quiz_attempts, user stats, activity logging, win rate.
    /// </summary>
    [HttpPost("{sessionId}/complete")]
    [ServiceFilter(typeof(JwtAuthFilter))]
    public async Task<IActionResult> CompleteSession(int sessionId)
    {
        try
        {
            var userId = (int)HttpContext.Items["userId"]!;
            using var connection = _db.CreateConnection();

            var session = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT * FROM quiz_sessions WHERE session_id = @SessionId",
                new { SessionId = sessionId });

            if (session == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "Session not found" });

            // If already completed, return existing results
            if ((string)session.status == "completed")
            {
                var existingQuestions = (await connection.QueryAsync<dynamic>(
                    @"SELECT qsq.*, q.full_question_text, q.correct_answer
                      FROM quiz_session_questions qsq
                      JOIN questions q ON qsq.question_id = q.question_id
                      WHERE qsq.session_id = @SessionId
                      ORDER BY qsq.question_order ASC",
                    new { SessionId = sessionId })).ToList();

                int eu1Score = existingQuestions.Count(q => (bool)(q.user1_correct ?? false));
                int eu2Score = existingQuestions.Count(q => (bool)(q.user2_correct ?? false));

                string? eu1Name = null, eu2Name = null;
                var eu1 = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    "SELECT username, full_name FROM users WHERE user_id = @Id", new { Id = (int)session.user1_id });
                if (eu1 != null) eu1Name = (string?)eu1.full_name ?? (string?)eu1.username;
                if (session.user2_id != null)
                {
                    var eu2 = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        "SELECT username, full_name FROM users WHERE user_id = @Id", new { Id = (int)session.user2_id });
                    if (eu2 != null) eu2Name = (string?)eu2.full_name ?? (string?)eu2.username;
                }

                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Session already completed",
                    Data = new
                    {
                        session,
                        user1Score = eu1Score, user2Score = eu2Score,
                        totalQuestions = existingQuestions.Count,
                        user1TotalTime = (int)(session.user1_total_time_sec ?? 0),
                        user2TotalTime = (int)(session.user2_total_time_sec ?? 0),
                        winnerId = (int?)session.winner_id,
                        user1_id = (int)session.user1_id,
                        user2_id = (int?)session.user2_id,
                        user1Name = eu1Name, user2Name = eu2Name,
                        quizType = (string)session.quiz_type,
                        waitingForOpponent = false
                    }
                });
            }

            bool isUser1 = (int)session.user1_id == userId;
            bool is1v1 = (string)session.quiz_type == "1v1" && session.user2_id != null;

            // ── SOLO MODE or no opponent: finalize immediately ──
            if (!is1v1)
            {
                var questions = (await connection.QueryAsync<dynamic>(
                    @"SELECT qsq.*, q.full_question_text, q.correct_answer
                      FROM quiz_session_questions qsq
                      JOIN questions q ON qsq.question_id = q.question_id
                      WHERE qsq.session_id = @SessionId ORDER BY qsq.question_order ASC",
                    new { SessionId = sessionId })).ToList();

                var result = await FinalizeSession(connection, session, questions, userId);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Session completed",
                    Data = new
                    {
                        result.Session, result.User1Score, result.User2Score,
                        result.TotalQuestions, result.User1TotalTime, result.User2TotalTime,
                        result.WinnerId, result.User1Id, result.User2Id,
                        result.User1Name, result.User2Name, result.QuizType,
                        waitingForOpponent = false
                    }
                });
            }

            // ── 1v1 MODE: Mark this player as completed ──
            string completedCol = isUser1 ? "user1_completed" : "user2_completed";
            var updated = await connection.QueryFirstAsync<dynamic>(
                $"UPDATE quiz_sessions SET {completedCol} = TRUE WHERE session_id = @SessionId RETURNING *",
                new { SessionId = sessionId });

            bool bothDone = (bool)(updated.user1_completed ?? false) && (bool)(updated.user2_completed ?? false);

            if (!bothDone)
            {
                // Other player hasn't finished yet
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Waiting for opponent to finish...",
                    Data = new
                    {
                        waitingForOpponent = true,
                        user1Completed = (bool)(updated.user1_completed ?? false),
                        user2Completed = (bool)(updated.user2_completed ?? false),
                        session_id = sessionId
                    }
                });
            }

            // ── BOTH DONE: Finalize! ──
            {
                var questions = (await connection.QueryAsync<dynamic>(
                    @"SELECT qsq.*, q.full_question_text, q.correct_answer
                      FROM quiz_session_questions qsq
                      JOIN questions q ON qsq.question_id = q.question_id
                      WHERE qsq.session_id = @SessionId ORDER BY qsq.question_order ASC",
                    new { SessionId = sessionId })).ToList();

                var result = await FinalizeSession(connection, session, questions, userId);
                return Ok(new ApiResponse<object>
                {
                    Success = true,
                    Message = "Session completed",
                    Data = new
                    {
                        result.Session, result.User1Score, result.User2Score,
                        result.TotalQuestions, result.User1TotalTime, result.User2TotalTime,
                        result.WinnerId, result.User1Id, result.User2Id,
                        result.User1Name, result.User2Name, result.QuizType,
                        waitingForOpponent = false
                    }
                });
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Complete Session Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Failed to complete session" });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // HELPER: Finalize a session (called only when both players done / solo)
    // Mirrors Node.js finalizeSession() exactly — including quiz_attempts,
    // user stats updates, win_rate calculation, and activity logging.
    // ─────────────────────────────────────────────────────────────
    private static async Task<FinalizeResult> FinalizeSession(
        System.Data.IDbConnection connection, dynamic session, List<dynamic> questions, int requestingUserId)
    {
        int user1Score = questions.Count(q => (bool)(q.user1_correct ?? false));
        int user2Score = questions.Count(q => (bool)(q.user2_correct ?? false));

        int user1TotalTime = questions.Sum(q => (int)(q.user1_time_sec ?? 0));
        int user2TotalTime = questions.Sum(q => (int)(q.user2_time_sec ?? 0));

        // Update scores
        await connection.ExecuteAsync(
            "UPDATE quiz_sessions SET user1_score = @U1, user2_score = @U2 WHERE session_id = @SessionId",
            new { U1 = user1Score, U2 = user2Score, SessionId = (int)session.session_id });

        // Determine winner
        int? winnerId = null;
        if ((string)session.quiz_type == "1v1" && session.user2_id != null)
        {
            if (user1Score > user2Score) winnerId = (int)session.user1_id;
            else if (user2Score > user1Score) winnerId = (int)session.user2_id;
            // tie = no winner
        }

        // Complete session
        var completed = await connection.QueryFirstAsync<dynamic>(
            @"UPDATE quiz_sessions SET status = 'completed', completed_at = CURRENT_TIMESTAMP,
              winner_id = @WinnerId, user1_total_time_sec = @U1Time, user2_total_time_sec = @U2Time
              WHERE session_id = @SessionId RETURNING *",
            new { WinnerId = winnerId, U1Time = user1TotalTime, U2Time = user2TotalTime, SessionId = (int)session.session_id });

        // --- Create quiz_attempt records ---
        int scorePercent1 = questions.Count > 0 ? (int)Math.Round((double)user1Score / questions.Count * 100) : 0;
        await connection.ExecuteAsync(
            @"INSERT INTO quiz_attempts (user_id, session_id, score_percent, total_questions, correct_answers, time_taken_sec, status)
              VALUES (@UserId, @SessionId, @ScorePercent, @TotalQuestions, @CorrectAnswers, @TimeTaken, 'Completed')",
            new
            {
                UserId = (int)session.user1_id,
                SessionId = (int)session.session_id,
                ScorePercent = scorePercent1,
                TotalQuestions = questions.Count,
                CorrectAnswers = user1Score,
                TimeTaken = user1TotalTime
            });

        if (session.user2_id != null)
        {
            int scorePercent2 = questions.Count > 0 ? (int)Math.Round((double)user2Score / questions.Count * 100) : 0;
            await connection.ExecuteAsync(
                @"INSERT INTO quiz_attempts (user_id, session_id, score_percent, total_questions, correct_answers, time_taken_sec, status)
                  VALUES (@UserId, @SessionId, @ScorePercent, @TotalQuestions, @CorrectAnswers, @TimeTaken, 'Completed')",
                new
                {
                    UserId = (int)session.user2_id,
                    SessionId = (int)session.session_id,
                    ScorePercent = scorePercent2,
                    TotalQuestions = questions.Count,
                    CorrectAnswers = user2Score,
                    TimeTaken = user2TotalTime
                });
        }

        // --- Update user stats ---
        await connection.ExecuteAsync(
            "UPDATE users SET total_points = total_points + @Score, total_quizzes = total_quizzes + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = @UserId",
            new { Score = user1Score, UserId = (int)session.user1_id });

        if (session.user2_id != null)
        {
            await connection.ExecuteAsync(
                "UPDATE users SET total_points = total_points + @Score, total_quizzes = total_quizzes + 1, updated_at = CURRENT_TIMESTAMP WHERE user_id = @UserId",
                new { Score = user2Score, UserId = (int)session.user2_id });

            // Update win_rate for both players in 1v1
            foreach (var uid in new[] { (int)session.user1_id, (int)session.user2_id })
            {
                var winData = await connection.QueryFirstOrDefaultAsync<dynamic>(
                    @"SELECT COUNT(*) as total, COUNT(CASE WHEN winner_id = @Uid THEN 1 END) as wins
                      FROM quiz_sessions WHERE quiz_type = '1v1' AND (user1_id = @Uid OR user2_id = @Uid) AND status = 'completed'",
                    new { Uid = uid });

                long total = (long)(winData?.total ?? 0);
                long wins = (long)(winData?.wins ?? 0);
                int winRate = total > 0 ? (int)Math.Round((double)wins / total * 100) : 0;
                await connection.ExecuteAsync("UPDATE users SET win_rate = @WinRate WHERE user_id = @Uid", new { WinRate = winRate, Uid = uid });
            }
        }

        // --- Log activity for all players ---
        if ((string)session.quiz_type == "1v1" && session.user2_id != null)
        {
            if (winnerId == (int)session.user1_id)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'battle_won', @Title, @Score)",
                    new { Uid = (int)session.user1_id, Title = $"Won 1v1 battle with score {user1Score}/{questions.Count}", Score = $"{user1Score}/{questions.Count}" });
                await connection.ExecuteAsync(
                    "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'battle_lost', @Title, @Score)",
                    new { Uid = (int)session.user2_id, Title = $"Lost 1v1 battle with score {user2Score}/{questions.Count}", Score = $"{user2Score}/{questions.Count}" });
            }
            else if (winnerId != null && winnerId == (int)session.user2_id)
            {
                await connection.ExecuteAsync(
                    "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'battle_won', @Title, @Score)",
                    new { Uid = (int)session.user2_id, Title = $"Won 1v1 battle with score {user2Score}/{questions.Count}", Score = $"{user2Score}/{questions.Count}" });
                await connection.ExecuteAsync(
                    "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'battle_lost', @Title, @Score)",
                    new { Uid = (int)session.user1_id, Title = $"Lost 1v1 battle with score {user1Score}/{questions.Count}", Score = $"{user1Score}/{questions.Count}" });
            }
            else
            {
                // Tie
                await connection.ExecuteAsync(
                    "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'quiz_completed', @Title, @Score)",
                    new { Uid = (int)session.user1_id, Title = $"Tied 1v1 battle with score {user1Score}/{questions.Count}", Score = $"{user1Score}/{questions.Count}" });
                await connection.ExecuteAsync(
                    "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'quiz_completed', @Title, @Score)",
                    new { Uid = (int)session.user2_id, Title = $"Tied 1v1 battle with score {user2Score}/{questions.Count}", Score = $"{user2Score}/{questions.Count}" });
            }
        }
        else
        {
            // Solo quiz
            await connection.ExecuteAsync(
                "INSERT INTO user_activity (user_id, activity_type, title, score) VALUES (@Uid, 'quiz_completed', @Title, @Score)",
                new { Uid = requestingUserId, Title = $"Completed solo quiz with score {user1Score}/{questions.Count}", Score = $"{user1Score}/{questions.Count}" });
        }

        // Get player names
        string? user1Name = null, user2Name = null;
        var u1 = await connection.QueryFirstOrDefaultAsync<dynamic>(
            "SELECT username, full_name FROM users WHERE user_id = @Id", new { Id = (int)session.user1_id });
        if (u1 != null) user1Name = (string?)u1.full_name ?? (string?)u1.username;
        if (session.user2_id != null)
        {
            var u2 = await connection.QueryFirstOrDefaultAsync<dynamic>(
                "SELECT username, full_name FROM users WHERE user_id = @Id", new { Id = (int)session.user2_id });
            if (u2 != null) user2Name = (string?)u2.full_name ?? (string?)u2.username;
        }

        return new FinalizeResult
        {
            Session = completed,
            User1Score = user1Score,
            User2Score = user2Score,
            TotalQuestions = questions.Count,
            User1TotalTime = user1TotalTime,
            User2TotalTime = user2TotalTime,
            WinnerId = winnerId,
            User1Id = (int)session.user1_id,
            User2Id = (int?)session.user2_id,
            User1Name = user1Name,
            User2Name = user2Name,
            QuizType = (string)session.quiz_type
        };
    }

    private class FinalizeResult
    {
        public dynamic? Session { get; set; }
        public int User1Score { get; set; }
        public int User2Score { get; set; }
        public int TotalQuestions { get; set; }
        public int User1TotalTime { get; set; }
        public int User2TotalTime { get; set; }
        public int? WinnerId { get; set; }
        public int User1Id { get; set; }
        public int? User2Id { get; set; }
        public string? User1Name { get; set; }
        public string? User2Name { get; set; }
        public string? QuizType { get; set; }
    }
}