using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace dot_net_server.Helpers;

public class JwtHelper
{
    private readonly string _secret;
    private readonly int _expiresInDays;

    public JwtHelper(IConfiguration configuration)
    {
        // Prefer env vars (loaded from .env), fall back to appsettings.json
        _secret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? configuration["JwtSettings:Secret"]
            ?? "fallback_secret_key_change_in_production";
        _expiresInDays = int.Parse(
            Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_DAYS")
            ?? configuration["JwtSettings:ExpiresInDays"]
            ?? "7");
    }

    /// <summary>
    /// Generate a JWT token with userId and role claims.
    /// Matches the Node.js server's token format:
    ///   payload: { userId, role, iat, exp }
    /// </summary>
    public string GenerateToken(int userId, string role)
    {
        // .NET requires HS256 keys to be at least 256 bits (32 bytes).
        // Pad the secret if it's shorter (Node.js jsonwebtoken doesn't enforce this).
        var secretBytes = Encoding.UTF8.GetBytes(_secret);
        if (secretBytes.Length < 32)
        {
            var padded = new byte[32];
            Array.Copy(secretBytes, padded, secretBytes.Length);
            secretBytes = padded;
        }
        var key = new SymmetricSecurityKey(secretBytes);
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("userId", userId.ToString()),
            new Claim("role", role)
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(_expiresInDays),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}