using Npgsql;
using System.Data;

namespace dot_net_server.Helpers;

/// <summary>
/// Provides NpgsqlConnection instances for Dapper queries.
/// Mirrors the Node server's db.query() pattern.
/// </summary>
public class DapperContext
{
    private readonly string _connectionString;

    public DapperContext(IConfiguration configuration)
    {
        // Prefer env var (loaded from .env), fall back to appsettings.json
        _connectionString = Environment.GetEnvironmentVariable("DATABASE_CONNECTION")
            ?? configuration.GetConnectionString("DefaultConnection")
            ?? throw new InvalidOperationException("Database connection string not found. Set DATABASE_CONNECTION in .env or ConnectionStrings:DefaultConnection in appsettings.json.");
    }

    public IDbConnection CreateConnection()
    {
        return new NpgsqlConnection(_connectionString);
    }
}
