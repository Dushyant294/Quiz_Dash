using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

/// <summary>
/// Matches the Node server's JSON response format exactly:
/// { "success": true, "message": "...", "data": { "user": {...}, "token": "..." } }
/// or { "success": false, "error": "..." }
/// </summary>
public class ApiResponse<T>
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    [JsonPropertyName("message")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Message { get; set; }

    [JsonPropertyName("error")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public string? Error { get; set; }

    [JsonPropertyName("data")]
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingNull)]
    public T? Data { get; set; }
}

public class AuthData
{
    [JsonPropertyName("user")]
    public object User { get; set; } = null!;

    [JsonPropertyName("token")]
    public string Token { get; set; } = string.Empty;
}