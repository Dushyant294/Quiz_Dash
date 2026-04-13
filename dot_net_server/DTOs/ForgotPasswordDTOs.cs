using System.Text.Json.Serialization;

namespace dot_net_server.DTOs;

// ─── Forgot Password DTOs ──────────────────────────────────

public class ForgotPasswordRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
}

public class VerifyOtpRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("otp")]
    public string Otp { get; set; } = string.Empty;
}

public class ResetPasswordRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("otp")]
    public string Otp { get; set; } = string.Empty;

    [JsonPropertyName("newPassword")]
    public string NewPassword { get; set; } = string.Empty;
}