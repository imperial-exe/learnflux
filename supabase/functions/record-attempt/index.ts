// Supabase Edge Function: record-attempt
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { recomputeMastery } from "../_shared/masteryEngine.ts";

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

    const { subtopicId, source, correct, errorType, difficulty } = await req.json();

    // 1. Insert attempt
    const { error: insertError } = await supabase.from("attempts").insert({
      student_id: user.id,
      subtopic_id: subtopicId,
      source: source || "adaptiveQuiz",
      correct,
      error_type: errorType || null,
      difficulty: difficulty || 1,
    });

    if (insertError) {
      throw insertError;
    }

    // 2. Recompute mastery and mistake DNA
    const result = await recomputeMastery(supabase, user.id, subtopicId);

    // 3. Compute next-best-action based on weakest subtopic
    const { data: progressList } = await supabase
      .from("student_subtopic_progress")
      .select("subtopic_id, mastery, status, subtopics(name)")
      .eq("student_id", user.id)
      .order("mastery", { ascending: true })
      .limit(1);

    const nextAction = progressList && progressList.length > 0
      ? {
          subtopicId: progressList[0].subtopic_id,
          subtopicName: progressList[0].subtopics?.name || "Target Subtopic",
          reason: `Lowest mastery score (${progressList[0].mastery}%) - practice recommended`,
        }
      : null;

    return new Response(
      JSON.stringify({
        success: true,
        mastery: result.mastery,
        status: result.status,
        mistakeDNA: result.errorProfile,
        nextBestAction: nextAction,
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
