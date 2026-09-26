// src/services/backendApi.js
// Universal Backend Service for LearnFlux AI
// Supports direct Supabase Client & Local In-Memory / LocalStorage Engine with RLS & Edge Function logic

import { supabase, isSupabaseConnected } from "./supabaseClient.js";

const LOCAL_STORAGE_KEY = "learnflux_supabase_db_v2";

import { seedDatabase as defaultDatabase } from "../data/seedDatabase.js";

function getLocalDB() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultDatabase));
      return defaultDatabase;
    }
    return JSON.parse(raw);
  } catch (e) {
    return defaultDatabase;
  }
}

function saveLocalDB(db) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(db));
  } catch (e) {
    console.error("Failed to save local DB:", e);
  }
}

// ---------------------------------------------------------------------------------
// Core Backend API Methods (Mirrors Supabase Edge Functions & REST Contracts)
// ---------------------------------------------------------------------------------

export const backendApi = {
  // 1. Sign Up & Onboard with Grade Level & Age
  async signUpAndOnboard({ email, password, name, gradeLevel, age, learningGoal, customSubjects = [] }) {
    const avatarColors = ["#8b5cf6", "#22d3ee", "#34d399", "#f59e0b", "#ec4899"];
    const gradeLevelNum = Number(gradeLevel) || (age === "18+" ? 12 : Math.min(12, Math.max(1, Number(age) - 5)));

    // ── REAL SUPABASE PATH ──────────────────────────────────────────────────
    if (isSupabaseConnected) {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { display_name: name, grade_level: gradeLevelNum, age: String(age || "16") } },
      });
      if (authError) throw authError;
      const userId = authData.user?.id || `student-${Date.now()}`;
      const newProfile = {
        id: userId,
        email,
        display_name: name || email.split("@")[0],
        grade_level: gradeLevelNum,
        age: String(age || "16"),
        avatar_color: avatarColors[gradeLevelNum % 5],
        learning_goal: learningGoal || "Master Fundamentals",
        custom_subjects: customSubjects || [],
        streak_days: 1,
      };
      const { error: profileError } = await supabase
        .from("profiles")
        .upsert(newProfile, { onConflict: "id" });
      if (profileError) console.warn("Profile upsert error:", profileError);
      return { profile: { ...newProfile, name: newProfile.display_name }, session: authData.session };
    }

    // ── LOCALSTORAGE FALLBACK PATH ──────────────────────────────────────────
    const db = getLocalDB();
    const existing = db.profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
    const studentId = existing ? existing.id : `student-${Date.now()}`;
    const newProfile = {
      id: studentId,
      email,
      name: name || email.split("@")[0],
      display_name: name || email.split("@")[0],
      grade_level: gradeLevelNum,
      age: String(age || "16"),
      avatar_color: avatarColors[gradeLevelNum % 5],
      learning_goal: learningGoal || "Master Fundamentals",
      custom_subjects: customSubjects || [],
      streak_days: existing ? existing.streak_days : 1,
      created_at: existing ? existing.created_at : new Date().toISOString(),
    };
    if (existing) {
      db.profiles = db.profiles.map((p) => (p.id === existing.id ? newProfile : p));
    } else {
      db.profiles.push(newProfile);
    }
    saveLocalDB(db);
    return { profile: newProfile, session: { token: `jwt-mock-${studentId}` } };
  },

  // 2. Hydrate Full Dashboard for Student
  async getFullProfile(studentId) {
    const db = getLocalDB();
    const profile = db.profiles.find((p) => p.id === studentId) || db.profiles[0];

    // Filter subjects where min_grade <= grade_level <= max_grade
    const gradeLevel = profile.grade_level || 10;
    const subjects = db.subjects.filter(
      (s) => s.min_grade <= gradeLevel && s.max_grade >= gradeLevel
    );

    // Fetch student's progress entries
    const progress = db.student_progress.filter((p) => p.student_id === profile.id);

    // Compute Mistake DNA
    const mistakeDNA = { conceptual: 0, calculation: 0, careless: 0, application: 0 };
    let totalMastery = 0;
    let masteredCount = 0;

    progress.forEach((p) => {
      totalMastery += p.mastery || 0;
      if (p.status === "mastered") masteredCount += 1;
      if (p.error_profile) {
        mistakeDNA.conceptual += p.error_profile.conceptual || 0;
        mistakeDNA.calculation += p.error_profile.calculation || 0;
        mistakeDNA.careless += p.error_profile.careless || 0;
        mistakeDNA.application += p.error_profile.application || 0;
      }
    });

    const avgMastery = progress.length > 0 ? Math.round(totalMastery / progress.length) : 78;

    // Identify Next-Best-Action (Weakest Subtopic)
    const sorted = progress.slice().sort((a, b) => a.mastery - b.mastery);
    let nextBestAction = null;

    if (sorted.length > 0) {
      // Find subtopic details
      let foundSubtopicName = "Target Focus Area";
      for (const subj of db.subjects) {
        for (const top of subj.topics || []) {
          for (const st of top.subtopics || []) {
            if (st.id === sorted[0].subtopic_id) {
              foundSubtopicName = st.name;
              break;
            }
          }
        }
      }

      nextBestAction = {
        subtopicId: sorted[0].subtopic_id,
        subtopicName: foundSubtopicName,
        currentMastery: sorted[0].mastery,
        status: sorted[0].status,
        reason: `Knowledge gap detected (${sorted[0].mastery}% mastery) • Needs practice`,
      };
    } else {
      nextBestAction = {
        subtopicId: "sub-cs-complexity",
        subtopicName: "Time Complexity & Big-O Notation",
        currentMastery: 48,
        status: "weak",
        reason: "Initial diagnostic recommended focus",
      };
    }

    return {
      profile,
      dashboardData: {
        avgMastery,
        masteredCount,
        totalSubtopics: progress.length || 6,
        subjects,
        progress,
      },
      mistakeDNA,
      nextBestAction,
    };
  },

  // 3. Multi-Modal Study Materials (Notes, Mind Maps, Flashcards)
  async getStudyMaterials(subtopicId) {
    const db = getLocalDB();
    const materials = db.study_materials.filter((m) => m.subtopic_id === subtopicId);

    // Fallback if none exist for this specific subtopic
    if (materials.length === 0) {
      return db.study_materials.filter(
        (m) => m.subtopic_id === "sub-cs-complexity" || m.subtopic_id === "sub-math-mult"
      );
    }
    return materials;
  },

  // 4. Record Quiz / Practice Attempt & Recompute Mastery Engine
  async recordAttempt({ studentId, subtopicId, source, correct, errorType, difficulty }) {
    const db = getLocalDB();

    // 1. Insert attempt
    const attempt = {
      id: `att-${Date.now()}`,
      student_id: studentId,
      subtopic_id: subtopicId,
      source: source || "adaptiveQuiz",
      correct,
      error_type: errorType || null,
      difficulty: difficulty || 1,
      created_at: new Date().toISOString(),
    };
    db.attempts.push(attempt);

    // 2. Fetch last 10 attempts for this student & subtopic
    const recent = db.attempts
      .filter((a) => a.student_id === studentId && a.subtopic_id === subtopicId)
      .slice(-10);

    const total = recent.length;
    const correctCount = recent.filter((a) => a.correct).length;
    const accuracy = correctCount / total;
    const avgDiff = recent.reduce((sum, a) => sum + (a.difficulty || 1), 0) / total;

    // Accuracy-weighted mastery score
    const mastery = Math.round(
      Math.min(100, Math.max(0, accuracy * 100 * (0.7 + 0.3 * (avgDiff / 5))))
    );
    const status = mastery >= 80 ? "mastered" : mastery >= 50 ? "developing" : "weak";

    // Mistake DNA calculation
    const errorProfile = { conceptual: 0, calculation: 0, careless: 0, application: 0 };
    recent.forEach((a) => {
      if (!a.correct && a.error_type && a.error_type in errorProfile) {
        errorProfile[a.error_type] += 1;
      }
    });

    // 3. Upsert student progress
    const pIndex = db.student_progress.findIndex(
      (p) => p.student_id === studentId && p.subtopic_id === subtopicId
    );

    const progressEntry = {
      student_id: studentId,
      subtopic_id: subtopicId,
      mastery,
      status,
      error_profile: errorProfile,
      last_practiced_at: new Date().toISOString(),
    };

    if (pIndex >= 0) {
      db.student_progress[pIndex] = progressEntry;
    } else {
      db.student_progress.push(progressEntry);
    }

    // 4. Record time-series snapshot
    db.mastery_snapshots.push({
      student_id: studentId,
      subtopic_id: subtopicId,
      mastery,
      recorded_at: new Date().toISOString(),
    });

    saveLocalDB(db);

    return {
      success: true,
      mastery,
      status,
      mistakeDNA: errorProfile,
    };
  },

  // 5. Time-Series Progress Snapshots Over Time
  async getProgressOverTime(studentId) {
    const db = getLocalDB();
    const snapshots = db.mastery_snapshots
      .filter((s) => s.student_id === studentId)
      .sort((a, b) => new Date(a.recorded_at) - new Date(b.recorded_at));

    return {
      success: true,
      series: snapshots.length > 0 ? snapshots : [
        { recorded_at: new Date(Date.now() - 5 * 86400000).toISOString(), mastery: 65 },
        { recorded_at: new Date(Date.now() - 3 * 86400000).toISOString(), mastery: 72 },
        { recorded_at: new Date(Date.now() - 1 * 86400000).toISOString(), mastery: 78 },
      ],
    };
  },

  // 6. Fetch Question Bank
  async getQuestions(subtopicId) {
    const db = getLocalDB();
    const qs = db.questions.filter((q) => q.subtopic_id === subtopicId);
    return qs.length > 0 ? qs : db.questions;
  },

  // 7. Get ALL data — used by DataViewer page
  async getAllData() {
    if (isSupabaseConnected) {
      const [profiles, progress, sessions, attempts, snapshots, subjects] = await Promise.all([
        supabase.from("profiles").select("*"),
        supabase.from("student_progress").select("*"),
        supabase.from("study_sessions").select("*"),
        supabase.from("attempts").select("*"),
        supabase.from("mastery_snapshots").select("*"),
        supabase.from("subjects").select("id, name, description, min_grade, max_grade"),
      ]);
      return {
        profiles: profiles.data || [],
        student_progress: progress.data || [],
        study_sessions: sessions.data || [],
        attempts: attempts.data || [],
        mastery_snapshots: snapshots.data || [],
        subjects: subjects.data || [],
        source: "supabase",
      };
    }
    const db = getLocalDB();
    return { ...db, source: "localStorage" };
  },

  // 8. Clear all localStorage data (reset)
  clearLocalData() {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    return { success: true };
  },

  // Connection status
  isSupabaseConnected,
};

export { isSupabaseConnected };

