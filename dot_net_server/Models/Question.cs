using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class Question
{
    [JsonPropertyName("question_id")]
    public int QuestionId { get; set; }

    [JsonPropertyName("created_by")]
    public int CreatedBy { get; set; }

    [JsonPropertyName("file_id")]
    public int? FileId { get; set; }

    [JsonPropertyName("category_id")]
    public int? CategoryId { get; set; }

    [JsonPropertyName("subject_id")]
    public int? SubjectId { get; set; }

    [JsonPropertyName("topic_id")]
    public int? TopicId { get; set; }

    [JsonPropertyName("micro_topic_id")]
    public int? MicroTopicId { get; set; }

    [JsonPropertyName("exam")]
    public string? Exam { get; set; }

    [JsonPropertyName("year")]
    public string? Year { get; set; }

    [JsonPropertyName("shift")]
    public string? Shift { get; set; }

    [JsonPropertyName("language")]
    public string Language { get; set; } = "English";

    [JsonPropertyName("source_type")]
    public string? SourceType { get; set; }

    [JsonPropertyName("source_organization")]
    public string? SourceOrganization { get; set; }

    [JsonPropertyName("question_type")]
    public string QuestionType { get; set; } = "MCQ";

    [JsonPropertyName("full_question_text")]
    public string FullQuestionText { get; set; } = string.Empty;

    [JsonPropertyName("option_a")]
    public string? OptionA { get; set; }

    [JsonPropertyName("option_b")]
    public string? OptionB { get; set; }

    [JsonPropertyName("option_c")]
    public string? OptionC { get; set; }

    [JsonPropertyName("option_d")]
    public string? OptionD { get; set; }

    [JsonPropertyName("correct_answer")]
    public string CorrectAnswer { get; set; } = string.Empty;

    [JsonPropertyName("explanation")]
    public string? Explanation { get; set; }

    [JsonPropertyName("hint")]
    public string? Hint { get; set; }

    [JsonPropertyName("answer_format")]
    public string AnswerFormat { get; set; } = "Single_Option";

    [JsonPropertyName("difficulty_label")]
    public string DifficultyLabel { get; set; } = "Medium";

    [JsonPropertyName("primary_concept")]
    public string? PrimaryConcept { get; set; }

    [JsonPropertyName("question_image_url")]
    public string? QuestionImageUrl { get; set; }

    [JsonPropertyName("is_active")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime? UpdatedAt { get; set; }
}