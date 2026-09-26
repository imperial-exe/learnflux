-- Supabase Migration: 0001_schema.sql
-- Project: LearnFlux AI - Adaptive AI-Powered Personalized Learning Platform (Grade 1–12 Scope)

create extension if not exists "pgcrypto";

-- User Profiles linked to Supabase Auth with Grade & Age metadata
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_color text default '#8b5cf6',
  grade_level smallint not null check (grade_level between 1 and 12),
  age smallint not null,
  learning_goal text default 'Master Fundamentals',
  created_at timestamptz default now()
);

-- Global Subject Registry tagged with target grade bounds
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text,
  description text,
  min_grade smallint default 1,
  max_grade smallint default 12,
  created_at timestamptz default now()
);

-- Chapters / Topics within a Subject
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references subjects(id) on delete cascade,
  name text not null,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Granular, Mastery-Tracked Concepts (Knowledge Graph Nodes)
create table if not exists subtopics (
  id uuid primary key default gen_random_uuid(),
  topic_id uuid references topics(id) on delete cascade,
  name text not null,
  prerequisite_ids uuid[] default '{}',
  created_at timestamptz default now()
);

-- Per-Student Concept Mastery & Error DNA Profiling
create table if not exists student_subtopic_progress (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  subtopic_id uuid references subtopics(id) on delete cascade,
  mastery numeric default 0 check (mastery between 0 and 100),
  status text default 'weak', -- locked | weak | developing | mastered
  error_profile jsonb default '{"conceptual": 0, "calculation": 0, "careless": 0, "application": 0}'::jsonb,
  last_practiced_at timestamptz,
  unique(student_id, subtopic_id)
);

-- Multi-Modal Learning Resources (Notes, Mind Maps, Flashcards)
create table if not exists study_materials (
  id uuid primary key default gen_random_uuid(),
  subtopic_id uuid references subtopics(id) on delete cascade,
  material_type text not null check (material_type in ('note', 'mind_map', 'flashcard')),
  title text not null,
  content jsonb not null, -- Markdown for notes; JSON graph {nodes, edges} for mind maps; [{front, back}] for flashcards
  created_at timestamptz default now()
);

-- Quiz Bank tagged by difficulty and distractor taxonomy
create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  subtopic_id uuid references subtopics(id) on delete cascade,
  prompt text not null,
  options jsonb not null, -- [{ id, text, isCorrect, errorType }]
  difficulty smallint default 1 check (difficulty between 1 and 5),
  created_at timestamptz default now()
);

-- Log of Diagnostic & Adaptive Attempts
create table if not exists attempts (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  subtopic_id uuid references subtopics(id) on delete cascade,
  source text not null, -- diagnostic | pastPaper | adaptiveQuiz | flashcardPractice
  correct boolean not null,
  error_type text, -- conceptual | calculation | execution | application | careless
  difficulty smallint,
  created_at timestamptz default now()
);

-- Time-Series Analytics Snapshots (Powers Dashboard Charts)
create table if not exists mastery_snapshots (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references profiles(id) on delete cascade,
  subtopic_id uuid references subtopics(id) on delete cascade,
  mastery numeric not null,
  recorded_at timestamptz default now()
);

-- Performance Indexes
create index if not exists idx_attempts_student_subtopic on attempts (student_id, subtopic_id, created_at desc);
create index if not exists idx_snapshots_student_subtopic on mastery_snapshots (student_id, subtopic_id, recorded_at);
create index if not exists idx_study_materials_subtopic on study_materials (subtopic_id, material_type);
