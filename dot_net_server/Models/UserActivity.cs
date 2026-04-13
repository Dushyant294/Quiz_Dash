using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class UserActivity
{
    [JsonPropertyName("activity_id")]
    public int ActivityId { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("activity_type")]
    public string ActivityType { get; set; } = string.Empty;

    [JsonPropertyName("title")]
    public string? Title { get; set; }

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("score")]
    public string? Score { get; set; }

    [JsonPropertyName("metadata")]
    public string? Metadata { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    // Joined fields
    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("full_name")]
    public string? FullName { get; set; }
}