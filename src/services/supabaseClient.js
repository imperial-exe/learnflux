// src/services/supabaseClient.js
// Real Supabase Client for LearnFlux AI
// Replace SUPABASE_URL and SUPABASE_ANON_KEY with your actual project credentials

import { createClient } from "@supabase/supabase-js";

// ─────────────────────────────────────────────────────────────────────────────
// 🔧 CONFIGURATION — Paste your Supabase project details here
// ─────────────────────────────────────────────────────────────────────────────
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Will be null if env vars are not configured — app falls back to localStorage
export const supabase =
  SUPABASE_URL && SUPABASE_ANON_KEY
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      })
    : null;

export const isSupabaseConnected = Boolean(supabase);
