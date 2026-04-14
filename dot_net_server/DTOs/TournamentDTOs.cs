using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Tournament DTOs ──────────────────────────────────

public class CreateTournamentRequest
{
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
}