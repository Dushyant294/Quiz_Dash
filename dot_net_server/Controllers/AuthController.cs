using Microsoft.AspNetCore.Mvc;
using Dapper;
using dot_net_server.DTOs;
using dot_net_server.Helpers;
using dot_net_server.Models;
using dot_net_server.Services;

namespace dot_net_server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly DapperContext _db;
    private readonly JwtHelper _jwt;
    private readonly EmailService _emailService;
    private readonly GoogleAuthService _googleAuth;

    public AuthController(DapperContext db, JwtHelper jwt, EmailService emailService, GoogleAuthService googleAuth)
    {
        _db = db;
        _jwt = jwt;
        _emailService = emailService;
        _googleAuth = googleAuth;
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

    /// <summary>
    /// POST /api/auth/google
    /// Validates a Google ID token, finds or creates the user, and returns a JWT.
    /// </summary>
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleAuthRequest request)
    {
        try
        {
            // 1. Validate input
            if (string.IsNullOrWhiteSpace(request.IdToken))
            {
                return BadRequest(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Google ID token is required"
                });
            }

            // 2. Validate the Google ID token
            Google.Apis.Auth.GoogleJsonWebSignature.Payload payload;
            try
            {
                payload = await _googleAuth.ValidateTokenAsync(request.IdToken);
            }
            catch (Exception)
            {
                return Unauthorized(new ApiResponse<object>
                {
                    Success = false,
                    Error = "Invalid or expired Google token"
                });
            }

            var email = payload.Email;
            var fullName = payload.Name ?? email.Split('@')[0];

            using var connection = _db.CreateConnection();

            // 3. Check if user already exists by email
            var existingUser = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email",
                new { Email = email });

            if (existingUser != null)
            {
                // User exists — check if active
                if (!existingUser.IsActive)
                {
                    return StatusCode(403, new ApiResponse<object>
                    {
                        Success = false,
                        Error = "Account is deactivated. Please contact support."
                    });
                }

                // Generate token and return
                var token = _jwt.GenerateToken(existingUser.UserId, existingUser.Role);

                return Ok(new ApiResponse<AuthData>
                {
                    Success = true,
                    Message = "Logged in with Google successfully",
                    Data = new AuthData
                    {
                        User = new
                        {
                            user_id = existingUser.UserId,
                            full_name = existingUser.FullName,
                            email = existingUser.Email,
                            username = existingUser.Username,
                            role = existingUser.Role,
                            bio = existingUser.Bio,
                            profile_image_url = existingUser.ProfileImageUrl,
                            is_active = existingUser.IsActive,
                            total_points = existingUser.TotalPoints,
                            rank_tier = existingUser.RankTier,
                            created_at = existingUser.CreatedAt
                        },
                        Token = token
                    }
                });
            }

            // 4. User does not exist — create new account
            // Generate unique username from email prefix
            var baseUsername = email.Split('@')[0].ToLowerInvariant();
            // Remove non-alphanumeric characters except underscores
            baseUsername = System.Text.RegularExpressions.Regex.Replace(baseUsername, @"[^a-z0-9_]", "");
            if (string.IsNullOrEmpty(baseUsername)) baseUsername = "user";

            var username = baseUsername;
            var suffix = 1;
            while (true)
            {
                var taken = await connection.QueryFirstOrDefaultAsync<User>(
                    "SELECT user_id FROM users WHERE username = @Username",
                    new { Username = username });
                if (taken == null) break;
                username = $"{baseUsername}{suffix}";
                suffix++;
            }

            // 5. Insert new user (no password for Google users)
            var newUser = await connection.QueryFirstAsync<User>(
                @"INSERT INTO users (full_name, email, username, password_hash, role)
                  VALUES (@FullName, @Email, @Username, @PasswordHash, @Role)
                  RETURNING user_id, full_name, email, username, role, created_at",
                new
                {
                    FullName = fullName,
                    Email = email,
                    Username = username,
                    PasswordHash = string.Empty,
                    Role = "student"
                });

            // 6. Generate token
            var newToken = _jwt.GenerateToken(newUser.UserId, newUser.Role);

            return StatusCode(201, new ApiResponse<AuthData>
            {
                Success = true,
                Message = "Account created with Google successfully",
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
                    Token = newToken
                }
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Google Auth Error: {ex}");
            return StatusCode(500, new ApiResponse<object>
            {
                Success = false,
                Error = "Server error during Google authentication"
            });
        }
    }

    /// <summary>
    /// POST /api/auth/forgot-password
    /// Generates OTP, stores in password_resets table, sends email via SMTP.
    /// Mirrors Node server's authController.forgotPassword exactly.
    /// </summary>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Email is required" });

            using var connection = _db.CreateConnection();

            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email",
                new { request.Email });

            if (user == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "User not found" });

            // Generate 6-digit OTP
            var otp = new Random().Next(100000, 999999).ToString();
            var expiresAt = DateTime.UtcNow.AddMinutes(10);

            // Store OTP in password_resets table
            await connection.ExecuteAsync(
                "INSERT INTO password_resets (user_id, otp, expires_at) VALUES (@UserId, @Otp, @ExpiresAt)",
                new { UserId = user.UserId, Otp = otp, ExpiresAt = expiresAt });

            // Try sending real email
            bool emailSent = await _emailService.SendPasswordResetOtp(request.Email, otp);

            // Always log to console (matches Node.js behavior)
            Console.WriteLine($"\n\n=== PASSWORD RESET SIMULATION ===\nEmail to: {request.Email}\nYour OTP is: {otp}\n=================================\n\n");

            return Ok(new ApiResponse<object>
            {
                Success = true,
                Message = emailSent
                    ? "OTP sent to your email successfully."
                    : "OTP sent (Check server console if missing SMTP credentials)"
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Forgot Password Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error during forgot password" });
        }
    }

    /// <summary>
    /// POST /api/auth/verify-otp
    /// Verifies the OTP from password_resets table.
    /// Mirrors Node server's authController.verifyOTP exactly.
    /// </summary>
    [HttpPost("verify-otp")]
    public async Task<IActionResult> VerifyOtp([FromBody] VerifyOtpRequest request)
    {
        try
        {
            using var connection = _db.CreateConnection();

            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email",
                new { request.Email });

            if (user == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "User not found" });

            var result = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT * FROM password_resets
                  WHERE user_id = @UserId AND otp = @Otp AND is_used = false AND expires_at > NOW()",
                new { UserId = user.UserId, Otp = request.Otp });

            if (result == null)
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Invalid or expired OTP" });

            return Ok(new ApiResponse<object> { Success = true, Message = "OTP verified successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Verify OTP Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error during OTP verification" });
        }
    }

    /// <summary>
    /// POST /api/auth/reset-password
    /// Resets password after OTP verification.
    /// Mirrors Node server's authController.resetPassword exactly.
    /// </summary>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest request)
    {
        try
        {
            if (request.NewPassword.Length < 6)
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Password must be at least 6 characters long" });

            using var connection = _db.CreateConnection();

            var user = await connection.QueryFirstOrDefaultAsync<User>(
                "SELECT * FROM users WHERE email = @Email",
                new { request.Email });

            if (user == null)
                return NotFound(new ApiResponse<object> { Success = false, Error = "User not found" });

            var tokenResult = await connection.QueryFirstOrDefaultAsync<dynamic>(
                @"SELECT id FROM password_resets
                  WHERE user_id = @UserId AND otp = @Otp AND is_used = false AND expires_at > NOW()",
                new { UserId = user.UserId, Otp = request.Otp });

            if (tokenResult == null)
                return BadRequest(new ApiResponse<object> { Success = false, Error = "Invalid or expired OTP" });

            var passwordHash = PasswordHelper.HashPassword(request.NewPassword);

            await connection.ExecuteAsync(
                "UPDATE users SET password_hash = @PasswordHash WHERE user_id = @UserId",
                new { PasswordHash = passwordHash, UserId = user.UserId });

            await connection.ExecuteAsync(
                "UPDATE password_resets SET is_used = true WHERE id = @Id",
                new { Id = (int)tokenResult.id });

            return Ok(new ApiResponse<object> { Success = true, Message = "Password reset successfully" });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Reset Password Error: {ex}");
            return StatusCode(500, new ApiResponse<object> { Success = false, Error = "Server error during password reset" });
        }
    }
}