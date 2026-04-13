using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Tournament Attempt / Leaderboard DTOs ──────────────────────────────────

public class RecordAttemptRequest
{
    [JsonPropertyName("score")]
    public int Score { get; set; }

    [JsonPropertyName("correctAnswers")]
    public int CorrectAnswers { get; set; }

    [JsonPropertyName("totalQuestions")]
    public int TotalQuestions { get; set; }

    [JsonPropertyName("timeTaken")]
    public int TimeTaken { get; set; }
}

// ─── Find Match DTOs ──────────────────────────────────

public class FindMatchRequest
{
    [JsonPropertyName("category_id")]
    public int? CategoryId { get; set; }

    [JsonPropertyName("subject_id")]
    public int? SubjectId { get; set; }

    [JsonPropertyName("question_count")]
    public int? QuestionCount { get; set; }

    [JsonPropertyName("time_per_question")]
    public int? TimePerQuestion { get; set; }
}

// ─── Update Question DTO ──────────────────────────────────

public class UpdateQuestionRequest
{
    [JsonPropertyName("full_question_text")]
    public string FullQuestionText { get; set; } = string.Empty;

    [JsonPropertyName("option_a")]
    public string OptionA { get; set; } = string.Empty;

    [JsonPropertyName("option_b")]
    public string OptionB { get; set; } = string.Empty;

    [JsonPropertyName("option_c")]
    public string? OptionC { get; set; }

    [JsonPropertyName("option_d")]
    public string? OptionD { get; set; }

    [JsonPropertyName("correct_answer")]
    public string CorrectAnswer { get; set; } = string.Empty;

    [JsonPropertyName("hint")]
    public string? Hint { get; set; }

    [JsonPropertyName("explanation")]
    public string? Explanation { get; set; }
}