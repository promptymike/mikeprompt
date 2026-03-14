import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Validate that URL is a real HTTP/HTTPS URL (not a publishable key or empty string)
const isValidUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export const hasSupabase = !!(supabaseUrl && supabaseAnonKey && isValidUrl(supabaseUrl));

// Client-side client (uses anon key) — null when Supabase is not configured
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase: ReturnType<typeof createClient> = hasSupabase
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);

// Server-side admin client (uses service role — only in API routes, never browser)
export const supabaseAdmin: ReturnType<typeof createClient> =
  hasSupabase && process.env.SUPABASE_SERVICE_ROLE_KEY
    ? createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY)
    : (null as unknown as ReturnType<typeof createClient>);
