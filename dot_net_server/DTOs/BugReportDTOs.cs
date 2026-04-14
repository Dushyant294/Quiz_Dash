using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Bug Report DTOs ──────────────────────────────────

public class CreateBugReportRequest
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("specific_issue")]
    public string? SpecificIssue { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("priority")]
    public string? Priority { get; set; }
}

public class UpdateReportStatusRequest
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = string.Empty;
}