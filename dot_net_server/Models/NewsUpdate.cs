using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class NewsUpdate
{
    [JsonPropertyName("news_id")]
    public int NewsId { get; set; }

    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("tag")]
    public string Tag { get; set; } = "NEW FEATURE";

    [JsonPropertyName("published_by")]
    public int PublishedBy { get; set; }

    [JsonPropertyName("published_at")]
    public DateTime PublishedAt { get; set; }
}