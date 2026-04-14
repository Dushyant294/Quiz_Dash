using dot_net_server.Helpers;
using dot_net_server.Hubs;
using dot_net_server.Middleware;
using dot_net_server.Services;

DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddSignalR();

// Custom services
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<JwtHelper>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddSingleton<GoogleAuthService>();

builder.Services.AddScoped<JwtAuthFilter>();
builder.Services.AddScoped<AdminOnlyFilter>();
builder.Services.AddScoped<InstructorOrAdminFilter>();
builder.Services.AddScoped<CsvHandler>();

// ✅ FIXED CORS (NO wildcard with credentials)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // your frontend
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// DB mapping
SnakeCaseMapping.Apply();

// Test DB
try
{
    var db = app.Services.GetRequiredService<DapperContext>();
    using var connection = db.CreateConnection();
    connection.Open();
    Console.WriteLine("Connected to PostgreSQL database successfully.");
}
catch (Exception ex)
{
    Console.Error.WriteLine("Database connection failed.");
    Console.Error.WriteLine(ex.Message);
}

// Pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// ✅ ORDER MATTERS
app.UseCors("AllowFrontend");

app.UseAuthentication();   // 🔥 ADDED
app.UseAuthorization();

app.MapControllers();

app.MapHub<BattleHub>("/hubs/battle");

app.MapGet("/api/health", () =>
    Results.Json(new { success = true, message = "API working" })
);

app.Run();