using Google.Apis.Auth;

namespace dot_net_server.Services;

public class GoogleAuthService
{
    private readonly string _clientId;

    public GoogleAuthService(IConfiguration config)
    {
        _clientId = config["GOOGLE_CLIENT_ID"]
            ?? throw new InvalidOperationException("GOOGLE_CLIENT_ID not found.");
    }

    public async Task<GoogleJsonWebSignature.Payload> ValidateTokenAsync(string idToken)
    {
        var settings = new GoogleJsonWebSignature.ValidationSettings
        {
            Audience = new[] { _clientId }
        };

        var payload = await GoogleJsonWebSignature.ValidateAsync(idToken, settings);

        if (string.IsNullOrEmpty(payload.Email))
        {
            throw new InvalidOperationException("No email in Google account.");
        }

        return payload;
    }
}