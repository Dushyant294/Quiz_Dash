using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Models;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly DapperContext _db;
    private readonly JwtHelper _jwt;

    public AuthController(DapperContext db, JwtHelper jwt)
    {
        _db = db;
        _jwt = jwt;
    }

    /// <summary>
    /// POST /api/auth/register
    /// Mirrors Node server's authController.register exactly.
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            // 1. Validate input
            if (string.IsNullOrWhiteSpace(request.FullName) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Username) ||
                string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Please provide full_name, email, username, and password"
                });
            }

            if (request.Password.Length < 6)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Password must be at least 6 characters long"
                });
            }

            using var connection = _db.CreateConnection();

            // 2. Check existing user by email
            var emailExists = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email",
                new { request.Email });

            if (emailExists != null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "User with this email already exists"
                });
            }

            // 3. Check existing user by username
            var usernameExists = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE username = @Username",
                new { request.Username });

            if (usernameExists != null)
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Username is already taken"
                });
            }

            // 4. Hash password
            var passwordHash = PasswordHelper.HashPassword(request.Password);

            // 5. Ensure role is valid
            var finalRole = "student";
            if (request.Role == "instructor" || request.Role == "admin")
            {
                finalRole = request.Role;
            }

            // 6. Create user
            var newUser = await connection.QueryFirstAsync<User>(
                @"INSERT INTO users (full_name, email, username, password_hash, role)
                  VALUES (@FullName, @Email, @Username, @PasswordHash, @Role)
                  RETURNING user_id, full_name, email, username, role, created_at",
                new
                {
                    FullName = request.FullName,
                    Email = request.Email,
                    Username = request.Username,
                    PasswordHash = passwordHash,
                    Role = finalRole
                });

            // 7. Generate token
            var token = _jwt.GenerateToken(newUser.UserId, newUser.Role);

            return StatusCode(201, new ApiResponse<AuthData>
            {
                Success = true,
                Message = "User registered successfully",
                Data = new AuthData
                {
                    User = new
                    {
                        user_id = newUser.UserId,
                        full_name = newUser.FullName,
                        email = newUser.Email,
                        username = newUser.Username,
                        role = newUser.Role,
                        created_at = newUser.CreatedAt
                    },
                    Token = token
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Registration Error: {ex}");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = "Server error during registration"
            });
        }
    }

    /// <summary>
    /// POST /api/auth/login
    /// Mirrors Node server's authController.login exactly.
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            // 1. Validate input
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Please provide email and password"
                });
            }

            using var connection = _db.CreateConnection();

            // 2. Find user by email
            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email",
                new { request.Email });

            if (user == null)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Invalid credentials"
                });
            }

            // 3. Verify password
            if (!PasswordHelper.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Invalid credentials"
                });
            }

            // 4. Check if user is active
            if (!user.IsActive)
            {
                return StatusCode(403, new ApiResponse<object>
                {
                    Success = false,
                    Error = "Account is deactivated. Please contact support."
                });
            }

            // 5. Generate token
            var token = _jwt.GenerateToken(user.UserId, user.Role);

            return Ok(new ApiResponse<AuthData>
            {
                Success = true,
                Message = "Logged in successfully",
                Data = new AuthData
                {
                    User = new
                    {
                        user_id = user.UserId,
                        full_name = user.FullName,
                        email = user.Email,
                        username = user.Username,
                        role = user.Role,
                        bio = user.Bio,
                        profile_image_url = user.ProfileImageUrl,
                        is_active = user.IsActive,
                        total_points = user.TotalPoints,
                        rank_tier = user.RankTier,
                        created_at = user.CreatedAt
                    },
                    Token = token
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Login Error: {ex}");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = "Server error during login"
            });
        }
    }
}