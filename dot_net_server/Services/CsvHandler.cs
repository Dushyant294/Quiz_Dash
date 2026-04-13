using Dapper;
using dot_net_server.Helpers;
using static dot_net_server.Services.CsvParserService;

namespace dot_net_server.Services;

/// <summary>
/// Handles CSV upload bulk insert with dynamic category hierarchy resolution.
/// Mirrors Node.js csvHandler.js — includes fuzzy matching (Levenshtein distance).
/// </summary>
public class CsvHandler
{
    private readonly DapperContext _db;

    public CsvHandler(DapperContext db)
    {
        _db = db;
    }

    // ─── Levenshtein Distance ──────────────────────────
    private static int GetEditDistance(string a, string b)
    {
        if (a.Length == 0) return b.Length;
        if (b.Length == 0) return a.Length;

        var matrix = new int[b.Length + 1, a.Length + 1];
        for (int i = 0; i <= b.Length; i++) matrix[i, 0] = i;
        for (int j = 0; j <= a.Length; j++) matrix[0, j] = j;

        for (int i = 1; i <= b.Length; i++)
        {
            for (int j = 1; j <= a.Length; j++)
            {
                if (b[i - 1] == a[j - 1])
                    matrix[i, j] = matrix[i - 1, j - 1];
                else
                    matrix[i, j] = Math.Min(matrix[i - 1, j - 1] + 1,
                        Math.Min(matrix[i, j - 1] + 1, matrix[i - 1, j] + 1));
            }
        }
        return matrix[b.Length, a.Length];
    }

    private static int? NormalizeAndMatch(string? input, IEnumerable<dynamic> dbArray, string nameKey, string idKey)
    {
        if (string.IsNullOrWhiteSpace(input)) return null;
        var target = input.Trim().ToLowerInvariant();

        // Direct match
        foreach (var item in dbArray)
        {
            var dict = (IDictionary<string, object>)item;
            var name = dict[nameKey]?.ToString()?.Trim().ToLowerInvariant();
            if (name == target) return (int)dict[idKey];
        }

        // Fuzzy match
        int? bestMatch = null;
        int minDistance = int.MaxValue;

        foreach (var item in dbArray)
        {
            var dict = (IDictionary<string, object>)item;
            var name = dict[nameKey]?.ToString()?.Trim().ToLowerInvariant();
            if (name == null) continue;

            var distance = GetEditDistance(target, name);
            int threshold = target.Length > 12 ? 3 : target.Length > 6 ? 2 : 1;

            if (distance <= threshold && distance < minDistance)
            {
                minDistance = distance;
                bestMatch = (int)dict[idKey];
            }
        }

        return bestMatch;
    }

    private static string TitleCase(string s) =>
        string.Join(' ', s.Split(' ').Select(w =>
            w.Length > 0 ? char.ToUpperInvariant(w[0]) + w[1..] : w));

    public class UploadResult
    {
        public object? File { get; set; }
        public int InsertedCount { get; set; }
        public int TotalParsed { get; set; }
    }

    public async Task<UploadResult> HandleUpload(
        List<ParsedQuestion> questions, string fileName, string fileUrl,
        string? subject, string? topic, string? microTopic, int userId)
    {
        using var connection = _db.CreateConnection();

        // Load cache
        var categories = (await connection.QueryAsync<dynamic>(
            "SELECT * FROM categories WHERE is_active = true")).ToList();
        var subjectsCache = new Dictionary<int, List<dynamic>>();
        var topicsCache = new Dictionary<int, List<dynamic>>();
        var microTopicsCache = new Dictionary<int, List<dynamic>>();

        foreach (var q in questions)
        {
            // CATEGORY
            var qCatInfo = q.Category ?? subject;
            int? catId = NormalizeAndMatch(qCatInfo, categories, "name", "category_id");

            if (!string.IsNullOrWhiteSpace(qCatInfo) && !catId.HasValue)
            {
                var cleanName = TitleCase(qCatInfo.Trim());
                var newCat = await connection.QueryFirstAsync<dynamic>(
                    "INSERT INTO categories (name) VALUES (@Name) RETURNING *", new { Name = cleanName });
                categories.Add(newCat);
                catId = (int)newCat.category_id;
            }
            q.CategoryId = catId;

            // SUBJECT
            var qSubInfo = q.Subject ?? (qCatInfo != null ? topic : null);
            int? subId = null;
            if (catId.HasValue && !string.IsNullOrWhiteSpace(qSubInfo))
            {
                if (!subjectsCache.ContainsKey(catId.Value))
                    subjectsCache[catId.Value] = (await connection.QueryAsync<dynamic>(
                        "SELECT * FROM subjects WHERE category_id = @CatId", new { CatId = catId.Value })).ToList();

                subId = NormalizeAndMatch(qSubInfo, subjectsCache[catId.Value], "name", "subject_id");
                if (!subId.HasValue)
                {
                    var cleanName = TitleCase(qSubInfo.Trim());
                    var newSub = await connection.QueryFirstAsync<dynamic>(
                        "INSERT INTO subjects (category_id, name) VALUES (@CatId, @Name) RETURNING *",
                        new { CatId = catId.Value, Name = cleanName });
                    subjectsCache[catId.Value].Add(newSub);
                    subId = (int)newSub.subject_id;
                }
            }
            q.SubjectId = subId;

            // TOPIC
            var qTopInfo = q.Topic ?? (qSubInfo != null ? microTopic : null);
            int? topId = null;
            if (subId.HasValue && !string.IsNullOrWhiteSpace(qTopInfo))
            {
                if (!topicsCache.ContainsKey(subId.Value))
                    topicsCache[subId.Value] = (await connection.QueryAsync<dynamic>(
                        "SELECT * FROM topics WHERE subject_id = @SubId", new { SubId = subId.Value })).ToList();

                topId = NormalizeAndMatch(qTopInfo, topicsCache[subId.Value], "name", "topic_id");
                if (!topId.HasValue)
                {
                    var cleanName = TitleCase(qTopInfo.Trim());
                    var newTop = await connection.QueryFirstAsync<dynamic>(
                        "INSERT INTO topics (subject_id, name) VALUES (@SubId, @Name) RETURNING *",
                        new { SubId = subId.Value, Name = cleanName });
                    topicsCache[subId.Value].Add(newTop);
                    topId = (int)newTop.topic_id;
                }
            }
            q.TopicId = topId;

            // MICRO-TOPIC
            int? mTopId = null;
            if (topId.HasValue && !string.IsNullOrWhiteSpace(q.MicroTopic))
            {
                if (!microTopicsCache.ContainsKey(topId.Value))
                    microTopicsCache[topId.Value] = (await connection.QueryAsync<dynamic>(
                        "SELECT * FROM micro_topics WHERE topic_id = @TopId", new { TopId = topId.Value })).ToList();

                mTopId = NormalizeAndMatch(q.MicroTopic, microTopicsCache[topId.Value], "name", "micro_topic_id");
                if (!mTopId.HasValue)
                {
                    var cleanName = TitleCase(q.MicroTopic.Trim());
                    var newMTop = await connection.QueryFirstAsync<dynamic>(
                        "INSERT INTO micro_topics (topic_id, name) VALUES (@TopId, @Name) RETURNING *",
                        new { TopId = topId.Value, Name = cleanName });
                    microTopicsCache[topId.Value].Add(newMTop);
                    mTopId = (int)newMTop.micro_topic_id;
                }
            }
            q.MicroTopicId = mTopId;
        }

        // Create question_files record
        var firstCatStr = questions[0].Category ?? subject;
        var firstSubStr = questions[0].Subject ?? topic;
        var firstTopStr = questions[0].Topic ?? microTopic;

        var fileRecord = await connection.QueryFirstAsync<dynamic>(
            @"INSERT INTO question_files (uploaded_by, file_name, file_url, subject, topic, micro_topic, question_count, status)
              VALUES (@UploadedBy, @FileName, @FileUrl, @Subject, @Topic, @MicroTopic, @QuestionCount, 'Draft') RETURNING *",
            new
            {
                UploadedBy = userId,
                FileName = fileName,
                FileUrl = fileUrl,
                Subject = firstCatStr,
                Topic = firstSubStr,
                MicroTopic = firstTopStr,
                QuestionCount = questions.Count
            });

        int fileId = (int)fileRecord.file_id;

        // Bulk insert questions
        int insertedCount = 0;
        foreach (var q in questions)
        {
            await connection.ExecuteAsync(
                @"INSERT INTO questions (
                    created_by, file_id, category_id, subject_id, topic_id, micro_topic_id,
                    question_type, full_question_text, option_a, option_b, option_c, option_d,
                    correct_answer, explanation, hint, difficulty_label, exam, primary_concept
                  ) VALUES (
                    @CreatedBy, @FileId, @CategoryId, @SubjectId, @TopicId, @MicroTopicId,
                    @QuestionType, @FullQuestionText, @OptionA, @OptionB, @OptionC, @OptionD,
                    @CorrectAnswer, @Explanation, @Hint, @DifficultyLabel, @Exam, @PrimaryConcept)",
                new
                {
                    CreatedBy = userId,
                    FileId = fileId,
                    q.CategoryId,
                    q.SubjectId,
                    q.TopicId,
                    q.MicroTopicId,
                    q.QuestionType,
                    q.FullQuestionText,
                    q.OptionA,
                    q.OptionB,
                    q.OptionC,
                    q.OptionD,
                    q.CorrectAnswer,
                    q.Explanation,
                    q.Hint,
                    q.DifficultyLabel,
                    Exam = q.Category ?? (string?)null,
                    q.PrimaryConcept
                });
            insertedCount++;
        }

        // Update question count
        await connection.ExecuteAsync(
            "UPDATE question_files SET question_count = @Count WHERE file_id = @FileId",
            new { Count = insertedCount, FileId = fileId });

        return new UploadResult
        {
            File = fileRecord,
            InsertedCount = insertedCount,
            TotalParsed = questions.Count
        };
    }
}