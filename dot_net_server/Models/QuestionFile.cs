using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class QuestionFile
{
    [JsonPropertyName("file_id")]
    public int FileId { get; set; }

    [JsonPropertyName("uploaded_by")]
    public int UploadedBy { get; set; }

    [JsonPropertyName("file_name")]
    public string FileName { get; set; } = string.Empty;

    [JsonPropertyName("file_url")]
    public string? FileUrl { get; set; }

    [JsonPropertyName("subject")]
    public string? Subject { get; set; }

    [JsonPropertyName("topic")]
    public string? Topic { get; set; }

    [JsonPropertyName("micro_topic")]
    public string? MicroTopic { get; set; }

    [JsonPropertyName("question_count")]
    public int QuestionCount { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = "Draft";

    [JsonPropertyName("uploaded_at")]
    public DateTime UploadedAt { get; set; }

    // Joined field (admin queries)
    [JsonPropertyName("uploaded_by_username")]
    public string? UploadedByUsername { get; set; }
}