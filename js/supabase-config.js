// =========================================================
// PASTE YOUR SUPABASE KEYS HERE (from Project Settings → API)
// =========================================================
const SUPABASE_URL = "https://gziihuwgqfacphnxlhdt.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_V01SdZQFLtFFjoZGNZUv8A_un7x3-aH";

// Initializes the shared Supabase client used across every page.
// Loaded via CDN in each HTML file before this script runs.
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
