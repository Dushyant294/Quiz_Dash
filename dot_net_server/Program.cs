using dot_net_server.Helpers;

// Load .env file so secrets stay out of appsettings.json
DotNetEnv.Env.Load();

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Register custom services
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddSingleton<JwtHelper>();

// CORS - allow all origins (matches Node server's cors())
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// Register Dapper snake_case → PascalCase column mapping
SnakeCaseMapping.Apply();

// Test database connection on startup
try
{
    var db = app.Services.GetRequiredService<DapperContext>();
    using var connection = db.CreateConnection();
    connection.Open();
    Console.WriteLine("Connected to PostgreSQL database successfully.");
}
catch (Exception ex)
{
    Console.Error.WriteLine("Error connecting to PostgreSQL. Check your credentials and make sure PostgreSQL is running.");
    Console.Error.WriteLine(ex.Message);
}

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();

app.UseAuthorization();

app.MapControllers();

// Health check endpoint (matches Node server's /api/health)
app.MapGet("/api/health", () => Results.Json(new { success = true, message = "API and Database are connected!" }));

app.Run();