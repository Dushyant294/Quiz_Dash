using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class QuizSession
{
    [JsonPropertyName("session_id")]
    public int SessionId { get; set; }

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
    public string Difficulty { get; set; } = "Medium";

    [JsonPropertyName("question_count")]
    public int QuestionCount { get; set; }

    [JsonPropertyName("time_per_question")]
    public int TimePerQuestion { get; set; } = 10;

    [JsonPropertyName("user1_id")]
    public int User1Id { get; set; }

    [JsonPropertyName("user2_id")]
    public int? User2Id { get; set; }

    [JsonPropertyName("user1_score")]
    public int User1Score { get; set; }

    [JsonPropertyName("user2_score")]
    public int User2Score { get; set; }

    [JsonPropertyName("winner_id")]
    public int? WinnerId { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "active";

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("completed_at")]
    public DateTime? CompletedAt { get; set; }
}

public class QuizSessionQuestion
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("session_id")]
    public int SessionId { get; set; }

    [JsonPropertyName("question_id")]
    public int QuestionId { get; set; }

    [JsonPropertyName("question_order")]
    public int QuestionOrder { get; set; }

    [JsonPropertyName("user1_answer")]
    public string? User1Answer { get; set; }

    [JsonPropertyName("user2_answer")]
    public string? User2Answer { get; set; }

    [JsonPropertyName("user1_correct")]
    public bool User1Correct { get; set; }

    [JsonPropertyName("user2_correct")]
    public bool User2Correct { get; set; }

    [JsonPropertyName("answered_at")]
    public DateTime? AnsweredAt { get; set; }

    // Joined fields from questions table
    [JsonPropertyName("full_question_text")]
    public string? FullQuestionText { get; set; }

    [JsonPropertyName("option_a")]
    public string? OptionA { get; set; }

    [JsonPropertyName("option_b")]
    public string? OptionB { get; set; }

    [JsonPropertyName("option_c")]
    public string? OptionC { get; set; }

    [JsonPropertyName("option_d")]
    public string? OptionD { get; set; }

    [JsonPropertyName("correct_answer")]
    public string? CorrectAnswer { get; set; }

    [JsonPropertyName("question_image_url")]
    public string? QuestionImageUrl { get; set; }

    [JsonPropertyName("difficulty_label")]
    public string? DifficultyLabel { get; set; }

    [JsonPropertyName("hint")]
    public string? Hint { get; set; }
}