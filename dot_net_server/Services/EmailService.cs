using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace dot_net_server.Services;

/// <summary>
/// SMTP email service — mirrors the Node.js nodemailer transporter usage.
/// Uses Gmail SMTP with app password.
/// </summary>
public class EmailService
{
    private readonly string? _emailUser;
    private readonly string? _emailPass;

    public EmailService()
    {
        _emailUser = Environment.GetEnvironmentVariable("EMAIL_USER");
        _emailPass = Environment.GetEnvironmentVariable("EMAIL_PASS");
    }

    public bool IsConfigured => !string.IsNullOrEmpty(_emailUser) && !string.IsNullOrEmpty(_emailPass);

    /// <summary>
    /// Send a password reset OTP email — matches the Node.js HTML template exactly.
    /// </summary>
    public async Task<bool> SendPasswordResetOtp(string toEmail, string otp)
    {
        if (!IsConfigured) return false;

        try
        {
            var message = new MimeMessage();
            message.From.Add(new MailboxAddress("Medhashree", _emailUser));
            message.To.Add(new MailboxAddress("", toEmail));
            message.Subject = "Your QuizHub Password Reset OTP";

            var bodyBuilder = new BodyBuilder
            {
                HtmlBody = $@"<div style=""font-family: Arial, sans-serif; padding: 20px; text-align: center;"">
                    <h2>QuizHub Password Reset</h2>
                    <p>You requested a password reset. Here is your One-Time Password (OTP):</p>
                    <h1 style=""color: #5b5bff; letter-spacing: 2px;"">{otp}</h1>
                    <p>This OTP will expire in 10 minutes.</p>
                    <p>If you did not request this, please ignore this email.</p>
                </div>"
            };

            message.Body = bodyBuilder.ToMessageBody();

            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(_emailUser, _emailPass);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);

            return true;
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine($"Failed to send real email: {ex}");
            return false;
        }
    }
}