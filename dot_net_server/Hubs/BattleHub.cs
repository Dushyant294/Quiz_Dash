using System.Collections.Concurrent;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Dapper;
using dot_net_server.Helpers;
using Microsoft.AspNetCore.SignalR;
using Microsoft.IdentityModel.Tokens;

namespace dot_net_server.Hubs;

/// <summary>
/// SignalR Hub — direct port of Node.js battleSocket.js (Socket.IO).
/// Handles 1v1 real-time matchmaking with in-memory queue.
///
/// Client events (Socket.IO → SignalR mapping):
///   socket.emit('battle:find-match', data)   →  hub.invoke('FindMatch', data)
///   socket.emit('battle:cancel-search')      →  hub.invoke('CancelSearch')
///   socket.on('battle:matched', cb)          →  hub.on('BattleMatched', cb)
///   socket.on('battle:searching', cb)        →  hub.on('BattleSearching', cb)
///   socket.on('battle:timeout', cb)          →  hub.on('BattleTimeout', cb)
///   socket.on('battle:error', cb)            →  hub.on('BattleError', cb)
///   socket.on('battle:cancelled', cb)        →  hub.on('BattleCancelled', cb)
/// </summary>
public class BattleHub : Hub
{
    private readonly DapperContext _db;
    private readonly string _jwtSecret;

    // ─── In-memory matchmaking queue (mirrors Node.js matchQueue) ───
    // Key: "category_id:subject_id"
    // Value: list of waiting entries
    private static readonly ConcurrentDictionary<string, List<QueueEntry>> MatchQueue = new();

    // Track which connectionId is in which queue key (for fast cleanup)
    private static readonly ConcurrentDictionary<string, QueueInfo> ConnectionToQueue = new();

    // Track pending timeout cancellation tokens
    private static readonly ConcurrentDictionary<string, CancellationTokenSource> TimeoutTokens = new();

    private static readonly TimeSpan FiveMinutes = TimeSpan.FromMinutes(5);

    public BattleHub(DapperContext db, IConfiguration configuration)
    {
        _db = db;
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? configuration["JwtSettings:Secret"]
            ?? "fallback_secret_key_change_in_production";
    }

    // ─── CONNECTION LIFECYCLE ─────────────────────────────────────

    public override async Task OnConnectedAsync()
    {
        // Authenticate from query string token (mirrors Socket.IO handshake.auth.token)
        var token = Context.GetHttpContext()?.Request.Query["token"].FirstOrDefault();
        if (string.IsNullOrEmpty(token))
        {
            Context.Abort();
            return;
        }

        var (userId, role) = ValidateToken(token);
        if (userId == null)
        {
            Context.Abort();
            return;
        }

        // Store user info in connection context
        Context.Items["userId"] = userId.Value;
        Context.Items["role"] = role;

        Console.WriteLine($"[SignalR] User {userId} connected ({Context.ConnectionId})");
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.Items["userId"] as int? ?? 0;
        Console.WriteLine($"[SignalR] User {userId} disconnected ({Context.ConnectionId})");
        RemoveFromQueue(Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }

    // ─── FIND MATCH ──────────────────────────────────────────────

    public async Task FindMatch(FindMatchData data)
    {
        try
        {
            var userId = (int)(Context.Items["userId"] ?? 0);
            if (userId == 0)
            {
                await Clients.Caller.SendAsync("BattleError", new { message = "Not authenticated" });
                return;
            }

            var qCount = Math.Min(data.QuestionCount > 0 ? data.QuestionCount : 10, 30);
            var catKey = data.CategoryId > 0 ? data.CategoryId.ToString() : "any";
            var subKey = data.SubjectId > 0 ? data.SubjectId.ToString() : "any";
            var queueKey = $"{catKey}:{subKey}";

            Console.WriteLine($"[Queue] User {userId} searching for match (key: \"{queueKey}\", questions: {qCount})");

            // Remove if already in a queue
            if (ConnectionToQueue.ContainsKey(Context.ConnectionId))
            {
                RemoveFromQueue(Context.ConnectionId);
            }

            // Check if there's already someone waiting in this queue
            QueueEntry? opponent = null;
            lock (MatchQueue)
            {
                if (MatchQueue.TryGetValue(queueKey, out var queueList))
                {
                    opponent = queueList.FirstOrDefault(e => e.UserId != userId);
                    if (opponent != null)
                    {
                        queueList.Remove(opponent);
                        if (queueList.Count == 0) MatchQueue.TryRemove(queueKey, out _);
                    }
                }
            }

            if (opponent != null)
            {
                // ── MATCH FOUND! ──
                Console.WriteLine($"[Match] ✅ Pairing user {userId} with user {opponent.UserId} (key: \"{queueKey}\")");

                // Clean up opponent's timeout and queue tracking
                if (TimeoutTokens.TryRemove(opponent.ConnectionId, out var cts))
                    cts.Cancel();
                ConnectionToQueue.TryRemove(opponent.ConnectionId, out _);

                var finalQuestionCount = Math.Min(qCount, opponent.QuestionCount);
                int? catId = data.CategoryId > 0 ? data.CategoryId : null;
                int? subId = data.SubjectId > 0 ? data.SubjectId : null;

                using var connection = _db.CreateConnection();

                // Fetch random questions
                var qSql = "SELECT * FROM questions WHERE is_active = true";
                var qParams = new DynamicParameters();
                if (catId.HasValue) { qSql += " AND category_id = @CategoryId"; qParams.Add("CategoryId", catId); }
                if (subId.HasValue) { qSql += " AND subject_id = @SubjectId"; qParams.Add("SubjectId", subId); }
                qSql += " ORDER BY RANDOM() LIMIT @Limit";
                qParams.Add("Limit", finalQuestionCount);

                var questions = (await connection.QueryAsync<dynamic>(qSql, qParams)).ToList();

                Console.WriteLine($"[Match] Found {questions.Count} questions for key \"{queueKey}\"");

                if (questions.Count == 0)
                {
                    await Clients.Caller.SendAsync("BattleError", new { message = "No questions available for this category/subject" });
                    await Clients.Client(opponent.ConnectionId).SendAsync("BattleError", new { message = "No questions available for this category/subject" });
                    return;
                }

                // Create session
                var session = await connection.QueryFirstAsync<dynamic>(
                    @"INSERT INTO quiz_sessions (
                        quiz_type, category_id, subject_id, topic_id, micro_topic_id,
                        difficulty, question_count, time_per_question, user1_id, user2_id, status
                      ) VALUES ('1v1', @CategoryId, @SubjectId, NULL, NULL,
                        'Medium', @QuestionCount, 60, @User1Id, @User2Id, 'in_progress') RETURNING *",
                    new
                    {
                        CategoryId = catId,
                        SubjectId = subId,
                        QuestionCount = questions.Count,
                        User1Id = opponent.UserId,
                        User2Id = userId
                    });

                Console.WriteLine($"[Match] Session {(int)session.session_id} created");

                // Link questions to session
                for (int i = 0; i < questions.Count; i++)
                {
                    await connection.ExecuteAsync(
                        "INSERT INTO quiz_session_questions (session_id, question_id, question_order) VALUES (@SessionId, @QuestionId, @Order)",
                        new { SessionId = (int)session.session_id, QuestionId = (int)questions[i].question_id, Order = i + 1 });
                }

                // Get player names
                string user1Name = "Player 1", user2Name = "Player 2";
                try
                {
                    var u1 = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        "SELECT full_name, username FROM users WHERE user_id = @Id", new { Id = opponent.UserId });
                    if (u1 != null) user1Name = (string?)u1.full_name ?? (string?)u1.username ?? "Player 1";

                    var u2 = await connection.QueryFirstOrDefaultAsync<dynamic>(
                        "SELECT full_name, username FROM users WHERE user_id = @Id", new { Id = userId });
                    if (u2 != null) user2Name = (string?)u2.full_name ?? (string?)u2.username ?? "Player 2";
                }
                catch (Exception e) { Console.Error.WriteLine($"[Match] Error fetching names: {e}"); }

                // Notify opponent (user1 — was waiting)
                await Clients.Client(opponent.ConnectionId).SendAsync("BattleMatched", new
                {
                    session_id = (int)session.session_id,
                    question_count = questions.Count,
                    opponent_name = user2Name,
                    you_are = "user1"
                });
                Console.WriteLine($"[Match] Notified user1 ({opponent.UserId}) via {opponent.ConnectionId}");

                // Notify current user (user2 — just joined)
                await Clients.Caller.SendAsync("BattleMatched", new
                {
                    session_id = (int)session.session_id,
                    question_count = questions.Count,
                    opponent_name = user1Name,
                    you_are = "user2"
                });
                Console.WriteLine($"[Match] Notified user2 ({userId}) via {Context.ConnectionId}");

                Console.WriteLine($"[Match] ✅ Session {(int)session.session_id} ready with {questions.Count} questions");
            }
            else
            {
                // ── NO MATCH — ADD TO QUEUE ──
                var entry = new QueueEntry
                {
                    UserId = userId,
                    ConnectionId = Context.ConnectionId,
                    QuestionCount = qCount,
                    JoinedAt = DateTime.UtcNow
                };

                lock (MatchQueue)
                {
                    if (!MatchQueue.ContainsKey(queueKey))
                        MatchQueue[queueKey] = new List<QueueEntry>();
                    MatchQueue[queueKey].Add(entry);
                }

                ConnectionToQueue[Context.ConnectionId] = new QueueInfo { QueueKey = queueKey, UserId = userId };

                // Set 5-minute timeout
                var timeoutCts = new CancellationTokenSource();
                TimeoutTokens[Context.ConnectionId] = timeoutCts;
                _ = Task.Delay(FiveMinutes, timeoutCts.Token).ContinueWith(async t =>
                {
                    if (!t.IsCanceled)
                    {
                        Console.WriteLine($"[Timeout] User {userId} timed out from queue \"{queueKey}\"");
                        RemoveFromQueue(Context.ConnectionId);
                        try
                        {
                            await Clients.Client(Context.ConnectionId).SendAsync("BattleTimeout",
                                new { message = "No opponent found within 5 minutes" });
                        }
                        catch { /* client may have disconnected */ }
                    }
                });

                Console.WriteLine($"[Queue] User {userId} added to queue \"{queueKey}\"");

                await Clients.Caller.SendAsync("BattleSearching", new
                {
                    message = "Searching for opponent...",
                    queueKey
                });
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"[SignalR] Find match error: {ex}");
            await Clients.Caller.SendAsync("BattleError", new { message = "Failed to find match: " + ex.Message });
        }
    }

    // ─── CANCEL SEARCH ──────────────────────────────────────────

    public async Task CancelSearch()
    {
        var userId = Context.Items["userId"] as int? ?? 0;
        Console.WriteLine($"[Queue] User {userId} cancelled search");
        RemoveFromQueue(Context.ConnectionId);
        await Clients.Caller.SendAsync("BattleCancelled", new { message = "Search cancelled" });
    }

    // ─── HELPERS ─────────────────────────────────────────────────

    private static void RemoveFromQueue(string connectionId)
    {
        if (!ConnectionToQueue.TryRemove(connectionId, out var info)) return;

        // Cancel timeout
        if (TimeoutTokens.TryRemove(connectionId, out var cts))
            cts.Cancel();

        // Remove from queue
        lock (MatchQueue)
        {
            if (MatchQueue.TryGetValue(info.QueueKey, out var list))
            {
                list.RemoveAll(e => e.ConnectionId == connectionId);
                if (list.Count == 0) MatchQueue.TryRemove(info.QueueKey, out _);
            }
        }

        Console.WriteLine($"[Queue] Removed {connectionId} from queue \"{info.QueueKey}\"");
    }

    private (int? userId, string? role) ValidateToken(string token)
    {
        try
        {
            var secretBytes = Encoding.UTF8.GetBytes(_jwtSecret);
            if (secretBytes.Length < 32)
            {
                var padded = new byte[32];
                Array.Copy(secretBytes, padded, secretBytes.Length);
                secretBytes = padded;
            }

            var handler = new JwtSecurityTokenHandler();
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out _);

            var userIdClaim = principal.FindFirst("userId")?.Value;
            var roleClaim = principal.FindFirst("role")?.Value;

            return userIdClaim != null ? (int.Parse(userIdClaim), roleClaim) : (null, null);
        }
        catch
        {
            return (null, null);
        }
    }

    // ─── MODELS ──────────────────────────────────────────────────

    private class QueueEntry
    {
        public int UserId { get; set; }
        public string ConnectionId { get; set; } = string.Empty;
        public int QuestionCount { get; set; }
        public DateTime JoinedAt { get; set; }
    }

    private class QueueInfo
    {
        public string QueueKey { get; set; } = string.Empty;
        public int UserId { get; set; }
    }
}

// ─── DTO for FindMatch hub method ──────────────────────────────────
public class FindMatchData
{
    public int CategoryId { get; set; }
    public int SubjectId { get; set; }
    public int QuestionCount { get; set; }
}