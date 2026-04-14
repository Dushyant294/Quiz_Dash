using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── News DTOs ──────────────────────────────────

public class CreateNewsRequest
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("tag")]
    public string? Tag { get; set; }
}