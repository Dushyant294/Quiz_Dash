using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Quiz DTOs ──────────────────────────────────────────

public class QuizListItem
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("category")]
    public string Category { get; set; } = "General";

    [JsonPropertyName("categoryId")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public int? CategoryId { get; set; }

    [JsonPropertyName("questionsCount")]
    public int QuestionsCount { get; set; }
}