using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class User
{
    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("full_name")]
    public string FullName { get; set; } = string.Empty;

    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("username")]
    public string Username { get; set; } = string.Empty;

    [JsonPropertyName("password_hash")]
    public string PasswordHash { get; set; } = string.Empty;

    [JsonPropertyName("role")]
    public string Role { get; set; } = "student";

    [JsonPropertyName("bio")]
    public string? Bio { get; set; }

    [JsonPropertyName("profile_image_url")]
    public string? ProfileImageUrl { get; set; }

    [JsonPropertyName("is_active")]
    public bool IsActive { get; set; } = true;

    [JsonPropertyName("total_points")]
    public int TotalPoints { get; set; } = 0;

    [JsonPropertyName("rank_tier")]
    public string? RankTier { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }
}