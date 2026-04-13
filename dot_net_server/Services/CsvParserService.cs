using System.Globalization;
using CsvHelper;
using CsvHelper.Configuration;

namespace dot_net_server.Services;

/// <summary>
/// Parses CSV files for quiz upload, mirroring Node.js csvParserService.js.
/// Handles flexible column name matching (case-insensitive, multiple naming conventions).
/// </summary>
public static class CsvParserService
{
    public class ParsedQuestion
    {
        public string FullQuestionText { get; set; } = string.Empty;
        public string? OptionA { get; set; }
        public string? OptionB { get; set; }
        public string? OptionC { get; set; }
        public string? OptionD { get; set; }
        public string CorrectAnswer { get; set; } = string.Empty;
        public string? Explanation { get; set; }
        public string? Hint { get; set; }
        public string DifficultyLabel { get; set; } = "Medium";
        public string? Category { get; set; }
        public string? Subject { get; set; }
        public string? Topic { get; set; }
        public string? MicroTopic { get; set; }
        public string QuestionType { get; set; } = "MCQ";
        public string? PrimaryConcept { get; set; }

        // Resolved IDs (set by CsvHandler)
        public int? CategoryId { get; set; }
        public int? SubjectId { get; set; }
        public int? TopicId { get; set; }
        public int? MicroTopicId { get; set; }
    }

    public class ParseError
    {
        public int Row { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class ParseResult
    {
        public List<ParsedQuestion> Questions { get; set; } = new();
        public List<ParseError> Errors { get; set; } = new();
    }

    /// <summary>
    /// Normalize a CSV header to a standard field name (mirrors Node.js logic).
    /// </summary>
    private static string NormalizeHeader(string header)
    {
        var h = header.ToLowerInvariant().Trim();
        if (h.Contains("full_question_text")) return "full_question_text";
        if (h.Contains("option_a")) return "option_a";
        if (h.Contains("option_b")) return "option_b";
        if (h.Contains("option_c")) return "option_c";
        if (h.Contains("option_d")) return "option_d";
        if (h.Contains("correct answer") || h.Contains("correct_answer")) return "correct_answer";
        if (h.Contains("hint")) return "hint";
        if (h.Contains("explanation")) return "explanation";
        if (h.Contains("difficulty_label") || h.Contains("difficulty levels")) return "difficulty_label";
        if (h.Contains("exam") || h == "category") return "category";
        if (h.Contains("subject")) return "subject";
        if (h.Contains("micro") && h.Contains("topic")) return "micro_topic";
        if (h.Contains("topic") && !h.Contains("micro") && !h.Contains("sub")) return "topic";
        if (h.Contains("question_type")) return "question_type";
        if (h.Contains("primary_concept")) return "primary_concept";
        return h;
    }

    /// <summary>
    /// Normalize difficulty label to match DB CHECK constraint ('Easy', 'Medium', 'Hard').
    /// </summary>
    private static string NormalizeDifficulty(string? diff)
    {
        if (string.IsNullOrWhiteSpace(diff)) return "Medium";
        var lower = diff.Trim().ToLowerInvariant();
        if (lower == "moderate") return "Medium";
        if (lower == "expert" || lower == "difficult") return "Hard";
        // Capitalize first letter
        return char.ToUpperInvariant(lower[0]) + lower[1..];
    }

    public static ParseResult ParseCsv(Stream stream)
    {
        var result = new ParseResult();
        var config = new CsvConfiguration(CultureInfo.InvariantCulture)
        {
            HasHeaderRecord = true,
            MissingFieldFound = null,
            HeaderValidated = null,
            BadDataFound = null,
            TrimOptions = TrimOptions.Trim
        };

        using var reader = new StreamReader(stream);
        using var csv = new CsvReader(reader, config);

        csv.Read();
        csv.ReadHeader();

        // Build header map
        var headerMap = new Dictionary<string, int>();
        if (csv.HeaderRecord != null)
        {
            for (int i = 0; i < csv.HeaderRecord.Length; i++)
            {
                var normalized = NormalizeHeader(csv.HeaderRecord[i]);
                if (!headerMap.ContainsKey(normalized))
                    headerMap[normalized] = i;
            }
        }

        int rowNum = 1;
        while (csv.Read())
        {
            rowNum++;
            try
            {
                string? GetField(string name) =>
                    headerMap.TryGetValue(name, out var idx) ? csv.GetField(idx)?.Trim() : null;

                var questionText = GetField("full_question_text");
                var correctAnswer = GetField("correct_answer");

                if (string.IsNullOrWhiteSpace(questionText) || string.IsNullOrWhiteSpace(correctAnswer))
                {
                    result.Errors.Add(new ParseError
                    {
                        Row = rowNum,
                        Message = "Missing required field: full_question_text or correct_answer"
                    });
                    continue;
                }

                result.Questions.Add(new ParsedQuestion
                {
                    FullQuestionText = questionText,
                    OptionA = GetField("option_a"),
                    OptionB = GetField("option_b"),
                    OptionC = GetField("option_c"),
                    OptionD = GetField("option_d"),
                    CorrectAnswer = correctAnswer,
                    Explanation = GetField("explanation"),
                    Hint = GetField("hint"),
                    DifficultyLabel = NormalizeDifficulty(GetField("difficulty_label")),
                    Category = GetField("category"),
                    Subject = GetField("subject"),
                    Topic = GetField("topic"),
                    MicroTopic = GetField("micro_topic"),
                    QuestionType = GetField("question_type") ?? "MCQ",
                    PrimaryConcept = GetField("primary_concept")
                });
            }
            catch
            {
                result.Errors.Add(new ParseError { Row = rowNum, Message = "Failed to parse row" });
            }
        }

        return result;
    }
}