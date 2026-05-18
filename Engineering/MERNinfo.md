# QuizDash Architecture & Codebase Documentation

This document provides a comprehensive overview of the **QuizDash** application architecture, detailing how the MERN (specifically PERN - PostgreSQL, Express, React, Node.js) stack components interact, what each part is responsible for, and how the core workflows operate.

---

## 1. Project Overview

QuizDash is a real-time, competitive quiz platform that supports:
- **Solo Quizzes:** Practice mode for different exam categories.
- **1v1 Battles:** Real-time multiplayer matchmaking where users compete head-to-head.
- **Tournaments:** Scheduled events with leaderboards and participant tracking.
- **User Progression:** Activity feeds, streaks, win-rates, and global ranking.
- **Content Management:** Instructors/Admins can upload quizzes via CSV.
- **Admin Panel:** Management of users, content, tournaments, and bug reports.

### Tech Stack
- **Frontend Client:** React 19, Vite, Tailwind CSS, React Router v7, Socket.io-client.
- **Backend Server:** Node.js, Express.js, Socket.io (for real-time matchmaking).
- **Database:** PostgreSQL (using `pg` driver).
- **Authentication:** JWT (JSON Web Tokens), Google OAuth integration.

---

## 2. Server Architecture (`Node_server/`)

The backend follows an MVC-like pattern (Model-Controller-Route) structured cleanly for scalability.

### Directory Structure & Responsibilities

- **`server.js`**: The main entry point. It sets up the Express app, configures CORS, initializes the HTTP server, attaches Socket.io for real-time features, mounts all API routes, and connects to the database.
- **`config/`**:
  - `db.js`: Initializes and exports the PostgreSQL connection pool.
  - `env.js`: Centralizes environment variable loading (dotenv).
  - `uploadConfig.js`: Configures `multer` for handling CSV file uploads.
- **`routes/`**: Defines the API endpoints and maps them to specific controllers. Also applies middleware (like `authMiddleware` for protection).
- **`controllers/`**: Contains the core business logic for handling HTTP requests and sending responses.
  - `authController.js`: Registration, login, Google OAuth, and OTP-based password resets.
  - `battleController.js`: Handles HTTP fallback for matchmaking, creating sessions, and submitting answers.
  - `quizController.js`: Fetching quizzes, handling CSV uploads.
  - `adminController.js`: Admin dashboard stats, user management, content moderation.
  - *Other controllers manage categories, leaderboards, news, and bug reports.*
- **`models/`**: The Data Access Layer. Maps JavaScript methods to raw PostgreSQL queries.
  - `userModel.js`, `quizModel.js`, `questionModel.js`, `sessionModel.js`, `tournamentModel.js`, etc.
  - Each model encapsulates the SQL queries required to interact with its respective table.
- **`middleware/`**:
  - `authMiddleware.js`: Verifies JWT tokens (`protect`), and checks user roles (`adminOnly`, `instructorOrAdmin`).
- **`sockets/`**:
  - `battleSocket.js`: The heart of the real-time 1v1 matchmaking. It authenticates sockets using JWT, places users in an in-memory waiting queue based on their selected category/subject, pairs them when a match is found, and creates a `quiz_sessions` database entry.
- **`services/` & `handlers/`**:
  - `csvParserService.js`: Reads and parses uploaded CSV files containing questions.
  - `csvHandler.js`: Orchestrates the bulk insertion of parsed questions into the database, handling fuzzy matching for categories/subjects and creating new hierarchy nodes if they don't exist.
- **`utils/`**:
  - `generateToken.js`: JWT signing and verification.
  - `hashPassword.js`: bcrypt wrappers for password hashing.
  - `apiResponse.js`: Standardized success/error JSON response formatters.

---

## 3. Client Architecture (`client/`)

The frontend is a React Single Page Application (SPA) built with Vite and styled with Tailwind CSS.

### Directory Structure & Responsibilities

- **`src/main.jsx` & `App.jsx`**: The root of the application. `App.jsx` handles routing using `react-router-dom`, defining protected routes, admin routes, and public routes inside different Layout wrappers.
- **`src/layouts/`**:
  - `MainLayout.jsx`: The primary layout containing the `Sidebar` and `Topbar`, with an `Outlet` for the main scrollable content area.
  - `AuthLayout.jsx`: A centered, minimalist layout used for Login and Registration screens.
- **`src/pages/`**: The main views of the application.
  - `Home.jsx`, `Dashboard.jsx`, `Profile.jsx`, `Leaderboard.jsx`, `Explore.jsx`: Standard informational and dashboard pages.
  - `QuizBattle.jsx`: The setup screen for playing quizzes (both Solo and 1v1). Allows users to select categories, subjects, and difficulty.
  - `QuizPlayView.jsx`: The actual active game screen. Fetches questions, displays a timer, captures user option selections, and submits them to the backend.
  - `admin/`: Sub-folder containing admin-specific pages (`AdminDashboard.jsx`, `ManageContent.jsx`, etc.).
- **`src/components/`**: Reusable UI elements.
  - `Sidebar.jsx`, `Topbar.jsx`, `QuizCard.jsx`, `TournamentDetailsModal.jsx`.
- **`src/context/`**: React Context providers for global state.
  - `ThemeContext.jsx`: Manages Dark/Light mode toggling.
  - `SearchContext.jsx`: Manages global search state with debouncing.
- **`src/hooks/`**: Custom React hooks.
  - `useGoogleAuth.js`: Handles the loading of the Google Identity Services SDK and the OAuth flow.
- **`src/config/api.js`**: Centralized `fetch` wrappers (`authFetch`, `apiFetch`) that automatically attach the base URL and JWT Bearer tokens from localStorage.

---

## 4. Key Workflows & Data Flow

### 4.1. User Registration & Authentication
1. User submits details on `Register.jsx` or `Login.jsx`.
2. Request hits `/api/auth/register` or `/api/auth/login`.
3. `authController` hashes the password (on register) or verifies it via `bcrypt` (on login) using `UserModel`.
4. A JWT is generated and returned to the client.
5. The client saves the JWT in `localStorage` and includes it in the `Authorization` header for all subsequent protected requests via `api.js`.

### 4.2. Quiz Creation (CSV Upload)
1. Instructor/Admin goes to `CreateQuiz.jsx` and uploads a CSV file.
2. Request hits `/api/quizzes/upload` via `multer` (saving to `Node_server/uploads/`).
3. `quizController.uploadQuiz` calls `csvParserService.parseCSV` to validate and extract rows.
4. The parsed data is passed to `csvHandler.handleCSVUpload`, which iterates through questions. It looks up Category/Subject IDs and auto-creates them if they are new.
5. `QuestionModel.bulkCreate` inserts the questions into the database.

### 4.3. 1v1 Battle Matchmaking
1. User configures a battle in `QuizBattle.jsx` and clicks "Find Match".
2. The client emits a `battle:find-match` event via Socket.io.
3. `battleSocket.js` authenticates the socket using the JWT.
4. It checks the `matchQueue` memory structure for an opponent with the same `category_id` and `subject_id`.
5. **If no opponent:** The user is added to the queue and waits (with a 5-minute timeout).
6. **If opponent found:**
   - Both users are removed from the queue.
   - Random questions are fetched from the DB using `QuestionModel.getRandomByFilters`.
   - A new `quiz_sessions` record is created.
   - The server emits `battle:matched` to both clients with the `session_id`.
7. Clients navigate to `/play/:sessionId` (`QuizPlayView.jsx`) to start playing.

### 4.4. Playing a Quiz & Scoring
1. In `QuizPlayView.jsx`, the client fetches questions via `GET /api/battle/:sessionId/questions`.
2. As the user selects answers, they are sent to `POST /api/battle/:sessionId/answer`.
3. `SessionModel.submitAnswer` verifies the answer, records the time taken, and saves the result in `quiz_session_questions`.
4. Once all questions are answered, the client calls `POST /api/battle/:sessionId/complete`.
5. `battleController.completeSession` checks if both users are finished (if 1v1). Once both are done, it calculates scores, assigns a winner, updates global points, and logs the activity in `user_activity`.

---

## 5. Database Schema High-Level Mapping
- **`users`**: Core user data, stats, and global rank.
- **`categories`, `subjects`, `topics`, `micro_topics`**: Hierarchical classification for questions.
- **`questions`**: The central question bank with rich metadata (difficulty, hints, correct answers).
- **`question_files`**: Tracks the CSV uploads that act as grouped "quizzes".
- **`quiz_sessions`**: Active or completed game instances (both solo and 1v1 multiplayer).
- **`quiz_session_questions`**: Tracks the exact answers given by users in a specific session.
- **`quiz_attempts`**: General log of completed quizzes for user history.
- **`tournaments`, `tournament_participants`, `tournament_attempts`**: Competitive events infrastructure.
- **`user_activity`**: Feed data for the user profile timeline.
- **`bug_reports`, `news_updates`**: App health and announcement tracking.

---

## 6. Summary

The QuizDash platform is a tightly integrated system where the **React Client** acts as a stateless presentation layer and the **Node.js Server** handles all heavy lifting, including relational data integrity via **PostgreSQL** and real-time state via **Socket.io**.

The architecture effectively isolates concerns:
- **Controllers** handle HTTP protocols.
- **Models** handle SQL queries.
- **Sockets** handle real-time concurrency.
- **React Pages** map 1-to-1 with user features.
- **React Components & Contexts** share logic and UI.
