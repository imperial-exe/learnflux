-- ═══════════════════════════════════════════════════════════════════════════
-- LearnFlux AI — Supabase PostgreSQL Schema
-- Run this in your Supabase project: SQL Editor → New Query → Paste → Run
-- ═══════════════════════════════════════════════════════════════════════════

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────────────────────────────────────
-- 1. PROFILES  (linked to auth.users)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              TEXT PRIMARY KEY,               -- matches auth.users.id
  email           TEXT UNIQUE NOT NULL,
  display_name    TEXT,
  grade_level     INTEGER DEFAULT 10,
  age             TEXT DEFAULT '16',
  avatar_color    TEXT DEFAULT '#8b5cf6',
  learning_goal   TEXT DEFAULT 'Master Fundamentals',
  custom_subjects JSONB DEFAULT '[]',
  streak_days     INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 2. SUBJECTS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.subjects (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  icon        TEXT,
  description TEXT,
  min_grade   INTEGER DEFAULT 1,
  max_grade   INTEGER DEFAULT 12,
  topics      JSONB DEFAULT '[]',
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 3. STUDENT_PROGRESS  (mastery per subtopic per student)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.student_progress (
  id                 UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id         TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subtopic_id        TEXT NOT NULL,
  mastery            INTEGER DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  status             TEXT DEFAULT 'weak' CHECK (status IN ('weak','developing','mastered')),
  error_profile      JSONB DEFAULT '{"conceptual":0,"calculation":0,"careless":0,"application":0}',
  last_practiced_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, subtopic_id)
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 4. STUDY_SESSIONS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.study_sessions (
  id              UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id      TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subtopic_id     TEXT NOT NULL,
  duration_mins   INTEGER DEFAULT 0,
  mode            TEXT DEFAULT 'quiz',
  score           INTEGER,
  started_at      TIMESTAMPTZ DEFAULT NOW(),
  ended_at        TIMESTAMPTZ
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 5. ATTEMPTS  (individual question answers)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.attempts (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id    TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subtopic_id   TEXT NOT NULL,
  source        TEXT DEFAULT 'adaptiveQuiz',
  correct       BOOLEAN NOT NULL,
  error_type    TEXT CHECK (error_type IN ('conceptual','calculation','careless','application') OR error_type IS NULL),
  difficulty    INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 6. MASTERY_SNAPSHOTS  (time-series for progress charts)
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.mastery_snapshots (
  id            UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  student_id    TEXT NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  subtopic_id   TEXT NOT NULL,
  mastery       INTEGER DEFAULT 0 CHECK (mastery BETWEEN 0 AND 100),
  recorded_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- 7. FLASHCARD_DECKS
-- ─────────────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.flashcard_decks (
  id          UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  subtopic_id TEXT NOT NULL,
  front       TEXT NOT NULL,
  back        TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS) — zero-trust data isolation
-- ─────────────────────────────────────────────────────────────────────────────
ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mastery_snapshots ENABLE ROW LEVEL SECURITY;

-- Profiles: own row only
CREATE POLICY "profiles_own" ON public.profiles
  FOR ALL USING (id = auth.uid()::text);

-- Progress: own rows only
CREATE POLICY "progress_own" ON public.student_progress
  FOR ALL USING (student_id = auth.uid()::text);

-- Sessions: own rows only
CREATE POLICY "sessions_own" ON public.study_sessions
  FOR ALL USING (student_id = auth.uid()::text);

-- Attempts: own rows only
CREATE POLICY "attempts_own" ON public.attempts
  FOR ALL USING (student_id = auth.uid()::text);

-- Snapshots: own rows only
CREATE POLICY "snapshots_own" ON public.mastery_snapshots
  FOR ALL USING (student_id = auth.uid()::text);

-- Subjects: public read
CREATE POLICY "subjects_read" ON public.subjects
  FOR SELECT USING (TRUE);

-- Flashcards: public read
ALTER TABLE public.flashcard_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "flashcards_read" ON public.flashcard_decks
  FOR SELECT USING (TRUE);

-- ─────────────────────────────────────────────────────────────────────────────
-- INDEXES for performance
-- ─────────────────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_progress_student   ON public.student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student   ON public.attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_student  ON public.mastery_snapshots(student_id);
CREATE INDEX IF NOT EXISTS idx_sessions_student   ON public.study_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_snapshots_recorded ON public.mastery_snapshots(recorded_at DESC);

-- ─────────────────────────────────────────────────────────────────────────────
-- Auto-update updated_at trigger for profiles
-- ─────────────────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
