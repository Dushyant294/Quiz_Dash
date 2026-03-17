# NuGet Packages - dot_net_server

All package install commands for the .NET server:

```bash
# PostgreSQL driver
dotnet add package Npgsql --version 9.0.3

# Lightweight ORM (raw SQL queries, like Node's pg)
dotnet add package Dapper --version 2.1.35

# Password hashing (compatible with Node's bcryptjs)
dotnet add package BCrypt.Net-Next --version 4.0.3

# JWT Authentication
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

# JWT Token generation
dotnet add package System.IdentityModel.Tokens.Jwt
```

## One-liner (PowerShell)

```powershell
dotnet add package Npgsql --version 9.0.3; dotnet add package Dapper --version 2.1.35; dotnet add package BCrypt.Net-Next --version 4.0.3; dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer; dotnet add package System.IdentityModel.Tokens.Jwt
```