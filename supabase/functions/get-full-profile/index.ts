// Supabase Edge Function: get-full-profile
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const authHeader = req.headers.get("Authorization")!;

    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Fetch user profile
    const { data: profile, error: profError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profError) throw profError;

    // 2. Fetch grade-appropriate subjects
    const { data: subjects, error: subjError } = await supabase
      .from("subjects")
      .select("*, topics(*, subtopics(*))")
      .lte("min_grade", profile.grade_level)
      .gte("max_grade", profile.grade_level);

    if (subjError) throw subjError;

    // 3. Fetch student subtopic progress
    const { data: progress } = await supabase
      .from("student_subtopic_progress")
      .select("*, subtopics(name, topic_id)")
      .eq("student_id", user.id);

    // 4. Compute overall Mistake DNA across all subtopics
    const mistakeDNA = { conceptual: 0, calculation: 0, careless: 0, application: 0 };
    let totalMasterySum = 0;
    let masteredCount = 0;

    if (progress && progress.length > 0) {
      progress.forEach((p: any) => {
        totalMasterySum += Number(p.mastery || 0);
        if (p.status === "mastered") masteredCount += 1;
        if (p.error_profile) {
          mistakeDNA.conceptual += p.error_profile.conceptual || 0;
          mistakeDNA.calculation += p.error_profile.calculation || 0;
          mistakeDNA.careless += p.error_profile.careless || 0;
          mistakeDNA.application += p.error_profile.application || 0;
        }
      });
    }

    const avgMastery = progress && progress.length > 0
      ? Math.round(totalMasterySum / progress.length)
      : 0;

    // 5. Determine Next-Best-Action (weakest subtopic)
    const sortedWeakest = (progress || []).slice().sort((a: any, b: any) => a.mastery - b.mastery);
    const nextBestAction = sortedWeakest.length > 0
      ? {
          subtopicId: sortedWeakest[0].subtopic_id,
          subtopicName: sortedWeakest[0].subtopics?.name || "Fundamental Concepts",
          currentMastery: sortedWeakest[0].mastery,
          status: sortedWeakest[0].status,
          reason: "Identified as primary knowledge bottleneck",
        }
      : null;

    return new Response(
      JSON.stringify({
        success: true,
        profile,
        dashboardData: {
          avgMastery,
          masteredCount,
          totalSubtopics: progress?.length || 0,
          subjects,
          progress,
        },
        mistakeDNA,
        nextBestAction,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});
