# QuizHub — PostgreSQL Database Schema

> Complete database design based on the ER diagram analysis and cross-referencing with the frontend (`src/`) pages and components.

---

## 1. Database Overview

The QuizHub database is designed to support a **quiz platform** with the following key features:

| Module | Description |
|---|---|
| **Authentication** | User registration & login with roles (student, instructor, admin) |
| **Questions** | Rich question bank with exam metadata, difficulty, options, hints |
| **Quizzes (Question Files)** | Uploaded quiz sets by instructors, tracked as file uploads |
| **Quiz Play (Battles)** | 1v1 and solo quiz sessions with scoring |
| **Tournaments** | Admin-created competitive events with participants & leaderboards |
| **Leaderboard** | Global ranking based on points |
| **Bug Reports** | User-submitted issue reports with resolution tracking |
| **News & Updates** | Admin-published platform announcements |
| **User Activity** | Activity feed, streaks, stats for profiles and dashboards |
| **Categories** | Exam-based categories (NEET, JEE, NDA-NA, GATE, SSC CGL, Boards) |
| **Admin Panel** | User management, content moderation, tournament & report management |

---

## 2. Entity-Relationship Summary

```
users ──────────┬──── questions (created_by)
                ├──── question_files (uploaded by)
                ├──── quiz_sessions (player 1 / player 2)
                ├──── tournament_participants
                ├──── quiz_attempts (who took what quiz)
                ├──── user_activity (activity feed)
                ├──── bug_reports (reported by)
                └──── leaderboard (derived / materialized)

categories ─────┬──── questions (exam/category)
                └──── tournaments (category)

tournaments ────┬──── tournament_questions
                └──── tournament_participants

question_files ─┬──── (groups questions into quiz sets)
```

---

## 3. CREATE TABLE Queries

### 3.1 `users`

Stores all registered users (students, instructors, admins).

```sql
CREATE TABLE users (
    user_id         SERIAL PRIMARY KEY,
    full_name       VARCHAR(100) NOT NULL,
    email           VARCHAR(150) UNIQUE NOT NULL,
    username        VARCHAR(50) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    role            VARCHAR(20) NOT NULL DEFAULT 'student'
                    CHECK (role IN ('student', 'instructor', 'admin')),
    profile_picture VARCHAR(500),
    country         VARCHAR(50) DEFAULT 'INDIA',
    total_points    INTEGER DEFAULT 0,
    total_quizzes   INTEGER DEFAULT 0,
    global_rank     INTEGER,
    current_streak  INTEGER DEFAULT 0,
    highest_streak  INTEGER DEFAULT 0,
    average_score   DECIMAL(5,2) DEFAULT 0.00,
    win_rate        DECIMAL(5,2) DEFAULT 0.00,
    time_played_min INTEGER DEFAULT 0,
    completion_rate DECIMAL(5,2) DEFAULT 0.00,
    best_category   VARCHAR(50),
    fav_category    VARCHAR(50),
    weakest_category VARCHAR(50),
    is_active       BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Frontend references**: `Register.jsx` (full_name, email, username, password, role), `Profile.jsx` (stats, streaks, categories, country, username), `Dashboard.jsx` (total_quizzes, global_rank, total_points), `Leaderboard.jsx` (points, quizzes), `ManageUsers.jsx` (role upgrades/downgrades, is_active).

---

### 3.2 `categories`

Predefined exam categories displayed across the platform.

```sql
CREATE TABLE categories (
    category_id     SERIAL PRIMARY KEY,
    name            VARCHAR(50) UNIQUE NOT NULL,
    description     TEXT,
    gradient_from   VARCHAR(20),
    gradient_to     VARCHAR(20),
    border_color    VARCHAR(20),
    is_active       BOOLEAN DEFAULT TRUE,
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Frontend references**: `Categories.jsx` (NEET, JEE, NDA-NA, SSC CGL, GATE, Boards), `Home.jsx` (quiz categories), `Explore.jsx` (Technology, NEET, NDA-NA), `QuizBattle.jsx` (exam dropdown), `Tournaments.jsx` (filter tabs).

---

### 3.3 `subjects`

Subjects within a category (e.g., Physics, Chemistry under JEE).

```sql
CREATE TABLE subjects (
    subject_id      SERIAL PRIMARY KEY,
    category_id     INTEGER REFERENCES categories(category_id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (category_id, name)
);
```

> **Frontend references**: `QuizBattle.jsx` (Subject dropdown: Botany, Zoology, Physics, Chemistry), `CreateQuiz.jsx` (Subject field), `Dashboard.jsx` (quiz activity by subject).

---

### 3.4 `topics`

Topics within a subject (e.g., Plant Physiology under Botany).

```sql
CREATE TABLE topics (
    topic_id        SERIAL PRIMARY KEY,
    subject_id      INTEGER REFERENCES subjects(subject_id) ON DELETE CASCADE,
    name            VARCHAR(150) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (subject_id, name)
);
```

---

### 3.5 `micro_topics`

Fine-grained micro-topics within a topic.

```sql
CREATE TABLE micro_topics (
    micro_topic_id  SERIAL PRIMARY KEY,
    topic_id        INTEGER REFERENCES topics(topic_id) ON DELETE CASCADE,
    name            VARCHAR(200) NOT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (topic_id, name)
);
```

> **Frontend references**: `QuizBattle.jsx` (Micro-topic dropdown), `CreateQuiz.jsx` (Micro-Topic field).

---

### 3.6 `questions`

Central question bank — most critical table.

```sql
CREATE TABLE questions (
    question_id             SERIAL PRIMARY KEY,
    created_by              INTEGER REFERENCES users(user_id) ON DELETE SET NULL,
    file_id                 INTEGER REFERENCES question_files(file_id) ON DELETE SET NULL,

    -- Classification
    category_id             INTEGER REFERENCES categories(category_id),
    subject_id              INTEGER REFERENCES subjects(subject_id),
    topic_id                INTEGER REFERENCES topics(topic_id),
    micro_topic_id          INTEGER REFERENCES micro_topics(micro_topic_id),

    -- Exam metadata
    exam                    VARCHAR(50),
    year                    INTEGER,
    shift                   VARCHAR(20),
    language                VARCHAR(20) DEFAULT 'English',
    source_type             VARCHAR(50),
    source_organization     VARCHAR(100),

    -- Question content
    question_type           VARCHAR(30) DEFAULT 'MCQ'
                            CHECK (question_type IN ('MCQ', 'MSQ', 'Numerical', 'Text', 'Ordered_Pair')),
    full_question_text      TEXT NOT NULL,
    option_a                TEXT,
    option_b                TEXT,
    option_c                TEXT,
    option_d                TEXT,
    correct_answer          VARCHAR(10) NOT NULL,
    explanation             TEXT,
    hint                    TEXT,
    answer_format           VARCHAR(30) DEFAULT 'Single_Option',
    answer_range            VARCHAR(50),

    -- Diagram
    contains_diagram        BOOLEAN DEFAULT FALSE,
    diagram_file_url        VARCHAR(500),
    question_image_url      VARCHAR(500),

    -- Difficulty ratings (1-5)
    concept_difficulty      SMALLINT CHECK (concept_difficulty BETWEEN 1 AND 5),
    calculation_intensity   SMALLINT CHECK (calculation_intensity BETWEEN 1 AND 5),
    logical_complexity      SMALLINT CHECK (logical_complexity BETWEEN 1 AND 5),
    visual_complexity       SMALLINT CHECK (visual_complexity BETWEEN 1 AND 5),
    overall_difficulty      SMALLINT CHECK (overall_difficulty BETWEEN 1 AND 5),
    difficulty_label        VARCHAR(10) DEFAULT 'Medium'
                            CHECK (difficulty_label IN ('Easy', 'Medium', 'Hard')),

    -- Concept tagging
    primary_concept         VARCHAR(200),
    secondary_concepts      TEXT,
    multi_concept_flag      BOOLEAN DEFAULT FALSE,
    interdisciplinary_flag  BOOLEAN DEFAULT FALSE,

    -- Meta
    version_number          INTEGER DEFAULT 1,
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at              TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_questions_category ON questions(category_id);
CREATE INDEX idx_questions_subject ON questions(subject_id);
CREATE INDEX idx_questions_difficulty ON questions(difficulty_label);
CREATE INDEX idx_questions_created_by ON questions(created_by);
```

> **Frontend references**: `QuizPlayView.jsx` (question text, 4 options A-D, image), `ManageContent.jsx` (question text, options A-D, correct answer, hint), `Explore.jsx` (questions count per quiz), `QuizBattle.jsx` (difficulty, topic, micro-topic selectors).

---

### 3.7 `question_files`

Tracks uploaded CSV files by instructors (each file = a quiz set).

```sql
CREATE TABLE question_files (
    file_id         SERIAL PRIMARY KEY,
    uploaded_by     INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
    file_name       VARCHAR(255) NOT NULL,
    file_url        VARCHAR(500),
    subject         VARCHAR(100),
    topic           VARCHAR(150),
    micro_topic     VARCHAR(200),
    question_count  INTEGER DEFAULT 0,
    status          VARCHAR(20) DEFAULT 'Draft'
                    CHECK (status IN ('Draft', 'Published', 'Archived')),
    uploaded_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Frontend references**: `CreateQuiz.jsx` (Subject, Topic, Micro-Topic, Question Count, CSV upload), `MyQuizzes.jsx` (quiz list with title, category, questions, score, date, status Active/Completed), `ManageContent.jsx` (quiz list with title, category, questions, status Published/Draft).

---

### 3.8 `quiz_sessions`

Records each quiz play session (1v1 battles or solo practice).

```sql
CREATE TABLE quiz_sessions (
    session_id      SERIAL PRIMARY KEY,
    quiz_type       VARCHAR(10) NOT NULL
                    CHECK (quiz_type IN ('1v1', 'solo')),
    category_id     INTEGER REFERENCES categories(category_id),
    subject_id      INTEGER REFERENCES subjects(subject_id),
    topic_id        INTEGER REFERENCES topics(topic_id),
    micro_topic_id  INTEGER REFERENCES micro_topics(micro_topic_id),
    difficulty      VARCHAR(10) DEFAULT 'Medium'
                    CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    question_count  INTEGER NOT NULL,
    time_per_question INTEGER DEFAULT 10,

    -- Players
    user1_id        INTEGER NOT NULL REFERENCES users(user_id),
    user2_id        INTEGER REFERENCES users(user_id),
    user1_score     INTEGER DEFAULT 0,
    user2_score     INTEGER DEFAULT 0,
    winner_id       INTEGER REFERENCES users(user_id),

    started_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP,
    status          VARCHAR(20) DEFAULT 'in_progress'
                    CHECK (status IN ('in_progress', 'completed', 'cancelled'))
);

CREATE INDEX idx_quiz_sessions_user1 ON quiz_sessions(user1_id);
CREATE INDEX idx_quiz_sessions_user2 ON quiz_sessions(user2_id);
```

> **Frontend references**: `QuizBattle.jsx` (1v1 / Solo tabs, Exam, Subject, Topic, Micro-topic, num questions, time per Q, difficulty), `Dashboard.jsx` (quiz data table with user scores, contests).

---

### 3.9 `quiz_session_questions`

Links questions to a specific quiz session — tracks per-question answers.

```sql
CREATE TABLE quiz_session_questions (
    id              SERIAL PRIMARY KEY,
    session_id      INTEGER NOT NULL REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
    question_id     INTEGER NOT NULL REFERENCES questions(question_id),
    question_order  INTEGER NOT NULL,
    user1_answer    VARCHAR(10),
    user2_answer    VARCHAR(10),
    user1_correct   BOOLEAN,
    user2_correct   BOOLEAN,
    answered_at     TIMESTAMP
);
```

> **Frontend references**: `QuizPlayView.jsx` (selecting option A-D per question, navigating through questions, submitting).

---

### 3.10 `quiz_attempts`

Records when a user takes any quiz/question file — for "My Quizzes" and profile activity.

```sql
CREATE TABLE quiz_attempts (
    attempt_id      SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    file_id         INTEGER REFERENCES question_files(file_id) ON DELETE SET NULL,
    session_id      INTEGER REFERENCES quiz_sessions(session_id) ON DELETE SET NULL,
    score_percent   DECIMAL(5,2),
    total_questions  INTEGER,
    correct_answers  INTEGER,
    time_taken_sec  INTEGER,
    status          VARCHAR(20) DEFAULT 'Completed'
                    CHECK (status IN ('Active', 'Completed', 'Abandoned')),
    attempted_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
```

> **Frontend references**: `MyQuizzes.jsx` (quiz title, category, questions, score %, date, status Active/Completed), `Profile.jsx` (activity feed — "Completed X with score Y%", quizzes taken count).

---

### 3.11 `tournaments`

Admin-created competitive tournaments.

```sql
CREATE TABLE tournaments (
    tournament_id   SERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    category_id     INTEGER REFERENCES categories(category_id),
    subject         VARCHAR(100),
    thumbnail_url   VARCHAR(500),
    start_date      DATE NOT NULL,
    end_date        DATE NOT NULL,
    registration_deadline DATE,
    rounds          INTEGER DEFAULT 1,
    total_questions INTEGER DEFAULT 50,
    status          VARCHAR(20) DEFAULT 'upcoming'
                    CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
    created_by      INTEGER REFERENCES users(user_id),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Frontend references**: `Tournaments.jsx` (name, description, date range, participants count, category badge, registration status), `ManageTournaments.jsx` (name, subject, participants, END/UPDATE actions), `CreateTournament.jsx` (subject, topic, micro-topic, question count, CSV upload).

---

### 3.12 `tournament_questions`

Questions specifically assigned to a tournament.

```sql
CREATE TABLE tournament_questions (
    id              SERIAL PRIMARY KEY,
    tournament_id   INTEGER NOT NULL REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    question_id     INTEGER NOT NULL REFERENCES questions(question_id) ON DELETE CASCADE,
    question_score  INTEGER DEFAULT 1,
    question_order  INTEGER,
    round_number    INTEGER DEFAULT 1,
    UNIQUE (tournament_id, question_id)
);
```

---

### 3.13 `tournament_participants`

Tracks user participation and scores in tournaments.

```sql
CREATE TABLE tournament_participants (
    id              SERIAL PRIMARY KEY,
    tournament_id   INTEGER NOT NULL REFERENCES tournaments(tournament_id) ON DELETE CASCADE,
    user_id         INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    score           INTEGER DEFAULT 0,
    rank            INTEGER,
    joined_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at    TIMESTAMP,
    UNIQUE (tournament_id, user_id)
);

CREATE INDEX idx_tp_tournament ON tournament_participants(tournament_id);
CREATE INDEX idx_tp_user ON tournament_participants(user_id);
```

> **Frontend references**: `Tournaments.jsx` (participants count, Join Now button), `Dashboard.jsx` (contest score highlight cards — name, score, rank).

---

### 3.14 `bug_reports`

User-submitted bug/issue reports.

```sql
CREATE TABLE bug_reports (
    report_id       SERIAL PRIMARY KEY,
    reported_by     INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title           VARCHAR(200) NOT NULL,
    description     TEXT,
    specific_issue  VARCHAR(50),
    type            VARCHAR(30)
                    CHECK (type IN ('bug', 'feature', 'improvement', 'crash')),
    priority        VARCHAR(20)
                    CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status          VARCHAR(20) DEFAULT 'unresolved'
                    CHECK (status IN ('unresolved', 'resolved', 'closed')),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    resolved_at     TIMESTAMP
);

CREATE INDEX idx_bug_reports_status ON bug_reports(status);
```

> **Frontend references**: `ReportBug.jsx` (title, description, specific_issue dropdown, type dropdown, priority dropdown), `BugReports.jsx` (reported_by, email, msg, unresolved/resolved buttons), `AdminDashboard.jsx` (pending bug reports count).

---

### 3.15 `news_updates`

Admin-published platform announcements.

```sql
CREATE TABLE news_updates (
    news_id         SERIAL PRIMARY KEY,
    title           VARCHAR(200) NOT NULL,
    description     TEXT NOT NULL,
    tag             VARCHAR(30) DEFAULT 'NEW FEATURE'
                    CHECK (tag IN ('NEW FEATURE', 'UI IMPROVEMENT', 'PERFORMANCE', 'BUG FIX', 'ANNOUNCEMENT')),
    published_by    INTEGER REFERENCES users(user_id),
    published_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> **Frontend references**: `News.jsx` (date, tag badge, title, description; filter tabs: All Updates, NEW FEATURE, PERFORMANCE, UI UPDATE).

---

### 3.16 `user_activity`

Activity feed entries for user profiles.

```sql
CREATE TABLE user_activity (
    activity_id     SERIAL PRIMARY KEY,
    user_id         INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_type   VARCHAR(30) NOT NULL
                    CHECK (activity_type IN ('quiz_completed', 'tournament_joined', 'battle_won', 'badge_earned', 'quiz_created')),
    title           VARCHAR(300) NOT NULL,
    score           VARCHAR(20),
    metadata        JSONB,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_activity_user ON user_activity(user_id);
CREATE INDEX idx_user_activity_created ON user_activity(created_at DESC);
```

> **Frontend references**: `Profile.jsx` (Activity tab — "Completed X with score Y%", date), `AdminDashboard.jsx` (recent activity — "John Doe created a quiz in Physics").

---

## 4. Relationships Summary

| Parent Table | Child Table | Relationship | FK Column |
|---|---|---|---|
| `users` | `questions` | One-to-Many | `questions.created_by` |
| `users` | `question_files` | One-to-Many | `question_files.uploaded_by` |
| `users` | `quiz_sessions` | One-to-Many | `quiz_sessions.user1_id`, `user2_id` |
| `users` | `quiz_attempts` | One-to-Many | `quiz_attempts.user_id` |
| `users` | `tournament_participants` | One-to-Many | `tournament_participants.user_id` |
| `users` | `bug_reports` | One-to-Many | `bug_reports.reported_by` |
| `users` | `user_activity` | One-to-Many | `user_activity.user_id` |
| `users` | `news_updates` | One-to-Many | `news_updates.published_by` |
| `categories` | `subjects` | One-to-Many | `subjects.category_id` |
| `categories` | `questions` | One-to-Many | `questions.category_id` |
| `categories` | `tournaments` | One-to-Many | `tournaments.category_id` |
| `subjects` | `topics` | One-to-Many | `topics.subject_id` |
| `subjects` | `questions` | One-to-Many | `questions.subject_id` |
| `topics` | `micro_topics` | One-to-Many | `micro_topics.topic_id` |
| `topics` | `questions` | One-to-Many | `questions.topic_id` |
| `micro_topics` | `questions` | One-to-Many | `questions.micro_topic_id` |
| `question_files` | `questions` | One-to-Many | `questions.file_id` |
| `quiz_sessions` | `quiz_session_questions` | One-to-Many | `quiz_session_questions.session_id` |
| `questions` | `quiz_session_questions` | One-to-Many | `quiz_session_questions.question_id` |
| `tournaments` | `tournament_questions` | One-to-Many | `tournament_questions.tournament_id` |
| `tournaments` | `tournament_participants` | One-to-Many | `tournament_participants.tournament_id` |

---

## 5. Additional Constraints

- **Unique email & username** on `users` table ensures no duplicate registrations.
- **CHECK constraints** enforce valid enum values for `role`, `quiz_type`, `difficulty`, `status`, `priority`, `type`, `tag`, etc.
- **ON DELETE CASCADE** on junction tables ensures cleanup when parent records are deleted.
- **ON DELETE SET NULL** on `questions.created_by` preserves questions even if the creator account is removed.
- **Indexes** on frequently queried columns (user_id, category_id, status, created_at) for performance.

---

## 6. Improvements Over the Original ER Diagram

After cross-checking the ER diagram with the frontend pages, the following **gaps and improvements** were identified:

### 6.1 Missing Entities (Added)

| Entity | Reason |
|---|---|
| `categories` table | The ER diagram had no explicit categories table, but the frontend (`Categories.jsx`, `Explore.jsx`, `QuizBattle.jsx`, `Tournaments.jsx`) relies heavily on exam-based categories (NEET, JEE, NDA-NA, GATE, SSC CGL, Boards). |
| `subjects` table | The ER has subject as a plain text field. Frontend `QuizBattle.jsx` uses dynamic subject dropdowns (Botany, Zoology, Physics, Chemistry) which require a normalized table. |
| `topics` / `micro_topics` tables | Both `CreateQuiz.jsx` and `QuizBattle.jsx` use Topic and Micro-Topic as separate hierarchical fields, requiring their own tables. |
| `quiz_attempts` table | The ER diagram's `quiz_data_table` only supports 1v1 tracking. Frontend `MyQuizzes.jsx` shows per-user quiz history with individual scores, dates, and status — requiring a dedicated attempts table. |
| `quiz_session_questions` table | No per-question answer tracking existed. The `QuizPlayView.jsx` needs to record which option was selected per question. |
| `user_activity` table | The ER diagram had no activity log. `Profile.jsx` shows an activity feed ("Completed X with score Y%") that needs its own table. |

### 6.2 Missing Columns (Added)

| Table | Column(s) | Reason |
|---|---|---|
| `users` | `current_streak`, `highest_streak`, `average_score`, `win_rate`, `time_played_min`, `completion_rate`, `best_category`, `fav_category`, `weakest_category`, `country` | `Profile.jsx` displays all these stats. The ER only had basic user fields. |
| `users` | `is_active` | `ManageUsers.jsx` has "Inactive user" action. |
| `users` | `global_rank` | `Dashboard.jsx` shows "Global Rank : #14" and `Leaderboard.jsx` shows "Your Rank : #47". |
| `tournaments` | `description`, `registration_deadline`, `rounds`, `total_questions`, `thumbnail_url` | `Tournaments.jsx` displays description, countdown to registration close, rounds count, questions count, and card images. |
| `bug_reports` | `title`, `specific_issue`, `type`, `priority` | `ReportBug.jsx` has all these form fields, but the ER only had subject + message. |
| `news_updates` | `tag` | `News.jsx` shows tag badges (NEW FEATURE, UI IMPROVEMENT) with filter options — the ER had no tag field. |
| `question_files` | `status`, `file_url` | `ManageContent.jsx` shows Published/Draft status; files need a URL for retrieval. |
| `quiz_sessions` | `difficulty`, `time_per_question`, `winner_id`, `status` | `QuizBattle.jsx` has difficulty and time-per-question selectors; sessions need completion tracking. |

### 6.3 Structural Improvements

| Improvement | Details |
|---|---|
| **Normalized category hierarchy** | Instead of flat text columns for exam/subject/topic/micro-topic, we use proper FK relationships (`categories` → `subjects` → `topics` → `micro_topics`) for consistency and querying. |
| **Password hashing** | Changed `password` to `password_hash` to reflect that plain-text passwords should never be stored. |
| **Separate quiz attempts from sessions** | A quiz session tracks the game (1v1/solo), while quiz attempts track individual user completions — needed because `MyQuizzes.jsx` shows user-specific results. |
| **Soft delete for users** | Added `is_active` flag instead of hard-deleting users (admin can deactivate). |
| **Timestamps everywhere** | Added `created_at` / `updated_at` on all relevant tables for audit trails. |
| **JSONB metadata on activity** | `user_activity.metadata` stores flexible extra info (quiz ID, tournament name, etc.) without schema changes. |

---

## 7. Seed Data Categories

The following categories should be seeded on initial setup:

```sql
INSERT INTO categories (name, description, sort_order) VALUES
('NEET', 'Medical Entrance Prep & Biology Specialist Quizzes', 1),
('JEE', 'Engineering Entrance focused on Physics, Chemistry & Maths', 2),
('NDA-NA', 'Defence Academy Prep: General Ability & Mathematics Mocks', 3),
('SSC CGL', 'Government Tier 1 & 2 Competitive Patterns', 4),
('GATE', 'Advanced Engineering & PSU Entrance Mock Tests', 5),
('Boards', 'CBSE, ICSE & State Board Mock Exams', 6),
('Technology', 'Programming, Web Dev, and Computer Science', 7);
```
