using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class BugReport
{
    [JsonPropertyName("report_id")]
    public int ReportId { get; set; }

    [JsonPropertyName("reported_by")]
    public int ReportedBy { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("specific_issue")]
    public string? SpecificIssue { get; set; }

    [JsonPropertyName("type")]
    public string Type { get; set; } = "bug";

    [JsonPropertyName("priority")]
    public string Priority { get; set; } = "medium";

    [JsonPropertyName("status")]
    public string Status { get; set; } = "unresolved";

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("resolved_at")]
    public DateTime? ResolvedAt { get; set; }

    // Joined fields
    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("email")]
    public string? Email { get; set; }
}