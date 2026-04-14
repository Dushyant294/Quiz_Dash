using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Admin DTOs ──────────────────────────────────

public class UpdateUserRoleRequest
{
    [JsonPropertyName("role")]
    public string Role { get; set; } = string.Empty;
}

public class ToggleUserActiveRequest
{
    [JsonPropertyName("is_active")]
    public bool IsActive { get; set; }
}