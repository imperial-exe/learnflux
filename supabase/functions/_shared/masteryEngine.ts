// Supabase Edge Functions Shared Engine: masteryEngine.ts
// Calculates accuracy-weighted mastery scores and Mistake DNA metrics

export interface ErrorProfile {
  conceptual: number;
  calculation: number;
  careless: number;
  application: number;
}

export interface RecomputeResult {
  mastery: number;
  status: "locked" | "weak" | "developing" | "mastered";
  errorProfile: ErrorProfile;
  nextBestAction?: {
    subtopicId: string;
    subtopicName: string;
    reason: string;
  };
}

export async function recomputeMastery(
  supabase: any,
  studentId: string,
  subtopicId: string
): Promise<RecomputeResult> {
  // Fetch up to 10 most recent attempts for this subtopic
  const { data: recent, error: attemptsError } = await supabase
    .from("attempts")
    .select("correct, difficulty, error_type")
    .eq("student_id", studentId)
    .eq("subtopic_id", subtopicId)
    .order("created_at", { ascending: false })
    .limit(10);

  if (attemptsError) {
    console.error("Error fetching attempts:", attemptsError);
  }

  if (!recent || recent.length === 0) {
    return {
      mastery: 0,
      status: "weak",
      errorProfile: { conceptual: 0, calculation: 0, careless: 0, application: 0 },
    };
  }

  const total = recent.length;
  const correctCount = recent.filter((a: any) => a.correct).length;
  const accuracy = correctCount / total;
  const avgDiff =
    recent.reduce((sum: number, a: any) => sum + (a.difficulty || 1), 0) / total;

  // Weighted mastery formula: accuracy scaled by difficulty factor (0.7 to 1.0)
  const mastery = Math.round(
    Math.min(100, Math.max(0, accuracy * 100 * (0.7 + 0.3 * (avgDiff / 5))))
  );

  const status: "locked" | "weak" | "developing" | "mastered" =
    mastery >= 80 ? "mastered" : mastery >= 50 ? "developing" : "weak";

  // Compute Mistake DNA
  const errorProfile: ErrorProfile = {
    conceptual: 0,
    calculation: 0,
    careless: 0,
    application: 0,
  };

  recent.forEach((a: any) => {
    if (!a.correct && a.error_type && a.error_type in errorProfile) {
      errorProfile[a.error_type as keyof ErrorProfile] += 1;
    }
  });

  // Upsert progress table
  await supabase.from("student_subtopic_progress").upsert({
    student_id: studentId,
    subtopic_id: subtopicId,
    mastery,
    status,
    error_profile: errorProfile,
    last_practiced_at: new Date().toISOString(),
  });

  // Record time-series snapshot for progress charts
  await supabase.from("mastery_snapshots").insert({
    student_id: studentId,
    subtopic_id: subtopicId,
    mastery,
    recorded_at: new Date().toISOString(),
  });

  return { mastery, status, errorProfile };
}
