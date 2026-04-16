-- ============================================================
-- Schema fixes for quiz scoring bugs
-- Run this against your PostgreSQL database to ensure all
-- required columns exist.
-- ============================================================

-- 1. Widen answer columns from VARCHAR(10) to TEXT
-- (answers store full option text, not just letters)
ALTER TABLE quiz_session_questions 
  ALTER COLUMN user1_answer TYPE TEXT,
  ALTER COLUMN user2_answer TYPE TEXT;

-- 2. Add per-question time tracking columns if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_session_questions' AND column_name = 'user1_time_sec'
  ) THEN
    ALTER TABLE quiz_session_questions ADD COLUMN user1_time_sec INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_session_questions' AND column_name = 'user2_time_sec'
  ) THEN
    ALTER TABLE quiz_session_questions ADD COLUMN user2_time_sec INTEGER DEFAULT 0;
  END IF;
END $$;

-- 3. Add session-level time tracking if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_sessions' AND column_name = 'user1_total_time_sec'
  ) THEN
    ALTER TABLE quiz_sessions ADD COLUMN user1_total_time_sec INTEGER DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_sessions' AND column_name = 'user2_total_time_sec'
  ) THEN
    ALTER TABLE quiz_sessions ADD COLUMN user2_total_time_sec INTEGER DEFAULT 0;
  END IF;
END $$;

-- 4. Add player completion tracking for 1v1 sync if missing
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_sessions' AND column_name = 'user1_completed'
  ) THEN
    ALTER TABLE quiz_sessions ADD COLUMN user1_completed BOOLEAN DEFAULT FALSE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'quiz_sessions' AND column_name = 'user2_completed'
  ) THEN
    ALTER TABLE quiz_sessions ADD COLUMN user2_completed BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- 5. Add 'battle_lost' to user_activity activity_type CHECK constraint
-- (needed for 1v1 battle result logging)
ALTER TABLE user_activity DROP CONSTRAINT IF EXISTS user_activity_activity_type_check;
ALTER TABLE user_activity ADD CONSTRAINT user_activity_activity_type_check 
  CHECK (activity_type IN ('quiz_completed', 'tournament_joined', 'battle_won', 'battle_lost', 'badge_earned', 'quiz_created'));

-- 6. Add 'waiting' to quiz_sessions status CHECK constraint
ALTER TABLE quiz_sessions DROP CONSTRAINT IF EXISTS quiz_sessions_status_check;
ALTER TABLE quiz_sessions ADD CONSTRAINT quiz_sessions_status_check
  CHECK (status IN ('in_progress', 'completed', 'cancelled', 'waiting'));

-- Widen correct_answer to handle full option text storage
ALTER TABLE questions ALTER COLUMN correct_answer TYPE TEXT;
