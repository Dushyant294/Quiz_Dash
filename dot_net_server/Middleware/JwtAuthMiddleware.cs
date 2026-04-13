using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.IdentityModel.Tokens;

namespace dot_net_server.Middleware;

/// <summary>
/// Mirrors Node.js protect middleware — validates JWT and sets userId + role on HttpContext.
/// Usage: [ServiceFilter(typeof(JwtAuthFilter))]
/// </summary>
public class JwtAuthFilter : IAsyncActionFilter
{
    private readonly string _secret;

    public JwtAuthFilter(IConfiguration configuration)
    {
        _secret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? configuration["JwtSettings:Secret"]
            ?? "fallback_secret_key_change_in_production";
    }

    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var authHeader = context.HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
        {
            context.Result = new UnauthorizedObjectResult(new { success = false, error = "Not authorized — no token provided" });
            return;
        }

        var token = authHeader["Bearer ".Length..];
        try
        {
            var secretBytes = Encoding.UTF8.GetBytes(_secret);
            if (secretBytes.Length < 32)
            {
                var padded = new byte[32];
                Array.Copy(secretBytes, padded, secretBytes.Length);
                secretBytes = padded;
            }

            var handler = new JwtSecurityTokenHandler();
            // CRITICAL: Clear the default claim mapping so "role" stays as "role"
            // instead of being remapped to "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
            handler.InboundClaimTypeMap.Clear();
            var principal = handler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(secretBytes),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out _);

            var userId = principal.FindFirst("userId")?.Value;
            var role = principal.FindFirst("role")?.Value;

            if (string.IsNullOrEmpty(userId))
            {
                context.Result = new UnauthorizedObjectResult(new { success = false, error = "Not authorized — invalid token" });
                return;
            }

            context.HttpContext.Items["userId"] = int.Parse(userId);
            context.HttpContext.Items["role"] = role ?? "student";
        }
        catch
        {
            context.Result = new UnauthorizedObjectResult(new { success = false, error = "Not authorized — invalid token" });
            return;
        }

        await next();
    }
}

/// <summary>
/// Mirrors Node.js adminOnly middleware.
/// Usage: [ServiceFilter(typeof(AdminOnlyFilter))]
/// Must come AFTER JwtAuthFilter.
/// </summary>
public class AdminOnlyFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var role = context.HttpContext.Items["role"]?.ToString();
        if (role != "admin")
        {
            context.Result = new ObjectResult(new { success = false, error = "Access denied — admin only" }) { StatusCode = 403 };
            return;
        }
        await next();
    }
}

/// <summary>
/// Mirrors Node.js instructorOrAdmin middleware.
/// Usage: [ServiceFilter(typeof(InstructorOrAdminFilter))]
/// Must come AFTER JwtAuthFilter.
/// </summary>
public class InstructorOrAdminFilter : IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var role = context.HttpContext.Items["role"]?.ToString();
        if (role != "instructor" && role != "admin")
        {
            context.Result = new ObjectResult(new { success = false, error = "Access denied — instructor or admin only" }) { StatusCode = 403 };
            return;
        }
        await next();
    }
}