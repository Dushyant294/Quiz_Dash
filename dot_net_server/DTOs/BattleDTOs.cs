using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Battle DTOs ──────────────────────────────────

public class CreateSessionRequest
{
    [JsonPropertyName("quiz_type")]
    public string QuizType { get; set; } = string.Empty;

    [JsonPropertyName("category_id")]
    public int? CategoryId { get; set; }

    [JsonPropertyName("subject_id")]
    public int? SubjectId { get; set; }

    [JsonPropertyName("topic_id")]
    public int? TopicId { get; set; }

    [JsonPropertyName("micro_topic_id")]
    public int? MicroTopicId { get; set; }

    [JsonPropertyName("difficulty")]
    public string? Difficulty { get; set; }

    [JsonPropertyName("question_count")]
    public int? QuestionCount { get; set; }

    [JsonPropertyName("time_per_question")]
    public int? TimePerQuestion { get; set; }

    [JsonPropertyName("file_id")]
    public int? FileId { get; set; }

    [JsonPropertyName("subject_name")]
    public string? SubjectName { get; set; }
}

public class SubmitAnswerRequest
{
    [JsonPropertyName("questionId")]
    public int QuestionId { get; set; }

    [JsonPropertyName("answer")]
    public string Answer { get; set; } = string.Empty;

    [JsonPropertyName("timeTaken")]
    public int TimeTaken { get; set; }
}
