// Supabase Edge Function: apply-past-paper-results
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

    const { results } = await req.json(); // array of { subtopicId, correct, errorType, difficulty }
    if (!Array.isArray(results) || results.length === 0) {
      return new Response(JSON.stringify({ error: "Invalid results array" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const updatedSubtopics: Record<string, any> = {};

    for (const res of results) {
      await supabase.from("attempts").insert({
        student_id: user.id,
        subtopic_id: res.subtopicId,
        source: "pastPaper",
        correct: res.correct,
        error_type: res.errorType || null,
        difficulty: res.difficulty || 2,
      });

      const updated = await recomputeMastery(supabase, user.id, res.subtopicId);
      updatedSubtopics[res.subtopicId] = updated;
    }

    return new Response(
      JSON.stringify({
        success: true,
        updatedCount: results.length,
        updatedSubtopics,
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
