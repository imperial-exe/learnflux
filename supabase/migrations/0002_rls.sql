-- Supabase Migration: 0002_rls.sql
-- Row-Level Security Policies for LearnFlux AI

-- Profiles
alter table profiles enable row level security;
drop policy if exists "Users read write own profile" on profiles;
create policy "Users read write own profile" on profiles for all using (id = auth.uid());

-- Subjects
alter table subjects enable row level security;
drop policy if exists "Authenticated users read global subjects" on subjects;
create policy "Authenticated users read global subjects" on subjects for select using (auth.role() = 'authenticated');

-- Topics
alter table topics enable row level security;
drop policy if exists "Authenticated users read topics" on topics;
create policy "Authenticated users read topics" on topics for select using (auth.role() = 'authenticated');

-- Subtopics
alter table subtopics enable row level security;
drop policy if exists "Authenticated users read subtopics" on subtopics;
create policy "Authenticated users read subtopics" on subtopics for select using (auth.role() = 'authenticated');

-- Student Progress
alter table student_subtopic_progress enable row level security;
drop policy if exists "Users manage own progress" on student_subtopic_progress;
create policy "Users manage own progress" on student_subtopic_progress for all using (student_id = auth.uid());

-- Study Materials
alter table study_materials enable row level security;
drop policy if exists "Authenticated users read study materials" on study_materials;
create policy "Authenticated users read study materials" on study_materials for select using (auth.role() = 'authenticated');

-- Questions
alter table questions enable row level security;
drop policy if exists "Authenticated users read question bank" on questions;
create policy "Authenticated users read question bank" on questions for select using (auth.role() = 'authenticated');

-- Attempts
alter table attempts enable row level security;
drop policy if exists "Users manage own attempts" on attempts;
create policy "Users manage own attempts" on attempts for all using (student_id = auth.uid());

-- Mastery Snapshots
alter table mastery_snapshots enable row level security;
drop policy if exists "Users manage own snapshots" on mastery_snapshots;
create policy "Users manage own snapshots" on mastery_snapshots for all using (student_id = auth.uid());
