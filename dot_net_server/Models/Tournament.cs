using System.Text.Json.Serialization;

namespace dot_net_server.Models;

public class Tournament
{
    [JsonPropertyName("tournament_id")]
    public int TournamentId { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("category_id")]
    public int? CategoryId { get; set; }

    [JsonPropertyName("subject")]
    public string? Subject { get; set; }

    [JsonPropertyName("thumbnail_url")]
    public string? ThumbnailUrl { get; set; }

    [JsonPropertyName("start_date")]
    public DateTime StartDate { get; set; }

    [JsonPropertyName("end_date")]
    public DateTime EndDate { get; set; }

    [JsonPropertyName("registration_deadline")]
    public DateTime? RegistrationDeadline { get; set; }

    [JsonPropertyName("rounds")]
    public int Rounds { get; set; } = 1;

    [JsonPropertyName("total_questions")]
    public int TotalQuestions { get; set; } = 50;

    [JsonPropertyName("status")]
    public string Status { get; set; } = "upcoming";

    [JsonPropertyName("created_by")]
    public int CreatedBy { get; set; }

    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }

    [JsonPropertyName("updated_at")]
    public DateTime? UpdatedAt { get; set; }

    // Joined fields
    [JsonPropertyName("category_name")]
    public string? CategoryName { get; set; }

    [JsonPropertyName("participant_count")]
    public int ParticipantCount { get; set; }

    // Navigation
    [JsonPropertyName("participants")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public List<TournamentParticipant>? Participants { get; set; }
}

public class TournamentParticipant
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("tournament_id")]
    public int TournamentId { get; set; }

    [JsonPropertyName("user_id")]
    public int UserId { get; set; }

    [JsonPropertyName("score")]
    public int Score { get; set; }

    [JsonPropertyName("joined_at")]
    public DateTime JoinedAt { get; set; }

    // Joined fields
    [JsonPropertyName("username")]
    public string? Username { get; set; }

    [JsonPropertyName("full_name")]
    public string? FullName { get; set; }

    [JsonPropertyName("total_points")]
    public int TotalPoints { get; set; }
}