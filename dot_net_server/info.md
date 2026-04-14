# QuizDash .NET Server Documentation

## Overview

The QuizDash backend is a high-performance RESTful Web API built with .NET (C#) and ASP.NET Core. It connects to a PostgreSQL database using Dapper (a lightweight micro-ORM). It handles all data persistence, user authentication (JWT), real-time game matchmaking via SignalR, and admin controls.

---

## Directory Structure & Key Files

### Root
- **`Program.cs`**: The entry point of the server application. It loads environment variables (`DotNetEnv`), registers Dependency Injection (DI) services (like Dapper, JwtHelper, EmailService), configures CORS (allowing credentials for SignalR usage), and maps Controllers and SignalR Hubs (`/hubs/battle`).
- **`appsettings.json`**: Application-wide configurations including Database connection strings and JWT signing secrets.

### `Controllers/` (API Endpoints)
- **`AuthController.cs`**: Handles `/api/auth/*`. Contains endpoints for classical Registration, Login, Google OAuth login (via payload validation), and Password Reset (OTP via email).
- **`BattleController.cs`**: Handles fallback HTTP matchmaking and Solo quiz session creation.
- **`QuizController.cs`**: Handles `/api/quiz/*`. Contains logic for fetching quiz questions, validating answers, finishing a quiz session, and updating user points.
- **`AdminController.cs`**: Restricted endpoints validating the user JWT has an "admin" role. Used to fetch bulk data or mutate system states.
- **`CategoryController.cs` & `LeaderboardController.cs` & `NewsController.cs`**: Basic CRUD controllers exposing endpoints sequentially mapping to database tables.

### `Services/` & `Helpers/`
- **`DapperContext.cs`**: Factory class that reads the `DefaultConnection` and generates raw `NpgsqlConnection` objects for Dapper to use. 
- **`JwtHelper.cs`**: Generates and signs JSON Web Tokens for authentication.
- **`PasswordHelper.cs`**: Wraps BCrypt for hashing and validating user passwords.
- **`EmailService.cs`**: Wraps MailKit/MimeKit to dispatch physical emails via SMTP (like the Forgot Password OTP).
- **`GoogleAuthService.cs`**: Wraps Google Apis to validate inbound Google OAuth Tokens securely server-side.
- **`CsvHandler.cs` & `CsvParserService.cs`**: Responsible for parsing uploaded `.csv` files (from Instructors or Admins) and bulk-inserting questions into the database.
- **`SnakeCaseMapping.cs`**: A crucial configuration helper. Since PostgreSQL tables conventionally use `snake_case` (e.g., `user_id`) but C# models use `PascalCase` (e.g., `UserId`), this helper applies a global naming policy to Dapper so columns are automatically mapped to object properties without explicitly declaring aliases in SQL queries.

### `Hubs/` (Real-time functionality)
- **`BattleHub.cs`**: A SignalR Hub that completely mirrors the Node.js `socket.io` implementation. It intercepts websocket connections, authenticates them using token query parameters, and uses a `ConcurrentDictionary` to represent a matchmaking queue (`MatchQueue`). 

### `Middleware/` (Request Pipelines & Security)
- **`JwtAuthMiddleware.cs` (Attributes like `JwtAuthFilter`)**: Action filters applied to controller endpoints (e.g., `[ServiceFilter(typeof(JwtAuthFilter))]`) to intercept API requests, ensure an `Authorization: Bearer <token>` header exists, decode the JWT, and bind the user ID/Role onto the `HttpContext`.
- **`AdminOnlyFilter`**: Specific filter to reject non-admin users.

### `Models/` & `DTOs/` (Data Typing)
- **`Models/`**: Plain Old CLR Objects (POCOs) that represent physical database tables (`User.cs`, `Question.cs`, `QuizSession.cs`).
- **`DTOs/`**: Data Transfer Objects used strictly for request/response payloads (`LoginRequest.cs`, `AuthResponse.cs`, etc.). It keeps internal database models separated from what is sent down the wire.

---

## Technical Flow Example: Application Startup and Auth

1. **Startup (`Program.cs`)**:
   - `DotNetEnv.Env.Load()` brings secrets from `.env`.
   - `builder.Services.AddSingleton<DapperContext>()` makes the DB connection factory globally available.
   - CORS is configured explicitly allowing `http://localhost:5173` with `.AllowCredentials()` (required for SignalR).
   - Maps API Controllers and the `BattleHub`.

2. **Authentication Flow (`AuthController.cs`)**:
   - Incoming POST request to `/api/auth/login`.
   - Dapper runs `SELECT * FROM users WHERE email = @Email`.
   - `PasswordHelper.VerifyPassword` compares the BCrypt hash.
   - `JwtHelper` packages the `UserId` and `Role` into an encrypted JWT.
   - Token is returned to the Frontend React client to store into `localStorage`.

3. **Secure Resource Access (`JwtAuthMiddleware.cs`)**:
   - The Frontend later wants to fetch user details. It fires an authenticated request to `[HttpGet("profile")]` with an attached filter.
   - The filter intercepts it, parses the JWT header, attaches `Context.Items["userId"]`, and lets the Controller proceed.

---

## Technical Flow Example: Real-time Matchmaking

1. **Connection (`BattleHub.cs` - `OnConnectedAsync`)**:
   - The client websocket connection arrives. The SignalR Hub intercepts the `?token=` parameter, validates the JWT, and extracts the `UserId`.

2. **Finding Match (`BattleHub.cs` - `FindMatch`)**:
   - Client emits intent to play in category `X` and subject `Y`.
   - The Hub builds a queue key (e.g., `"1:4"` for Category 1, Subject 4).
   - It checks the thread-safe `ConcurrentDictionary` (`MatchQueue`).
   - If an opponent is found in the queue:
     - It pulls both users out of the queue.
     - Spawns raw SQL via Dapper: `INSERT INTO quiz_sessions` setting `quiz_type = '1v1'` and locking both user IDs.
     - Polls `LIMIT X` random questions from the DB and inserts them into `quiz_session_questions`.
     - Emits `BattleMatched` down the websocket back to both specific `ConnectionId`s.
   - If no opponent is found:
     - The user is placed into the `MatchQueue`.
     - A Task timeout of 5 minutes (`TimeoutTokens`) is initialized to eventually boot the user back out if no one joins.

---

## Summary of the Full Project (Client + Server)

**QuizDash** is an end-to-end fullstack platform tailored for realtime quiz battling and education tracking. 
The system operates seamlessly across two distinct layers:
1. **The .NET 9 Backend API**: Prioritizes raw throughput (Dapper / SQL), safe and rapid state synchronization (SignalR WebSockets), and high security (JWTs, Role Attributes). It is responsible strictly for keeping data valid, matching players efficiently in memory, and parsing heavy file uploads.
2. **The React/Vite Frontend**: Focuses purely on State Management, fast local rendering without page reloads (SPA), and a beautiful customizable User Interface (Tailwind CSS Dark/Light mode).

When a user logs in, the React SPA caches their JWT. When they navigate to play a "Battle", React opens a websocket to the .NET SignalR Hub. The .NET server securely verifies their identity and logically pairs them with another network connection. Once heavily coupled logic (like matchmaking and random SQL question fetching) is computed by the heavy backend, the simple instruction is passed to the frontend to simply "Navigate into game board session #123", where the React frontend then builds the beautiful UI representation of the incoming timed data.
