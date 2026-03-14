import { supabase, hasSupabase } from "./supabase";

export const signInWithEmail = async (email: string) => {
  if (!hasSupabase) return { error: new Error("Supabase not configured") };
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { error };
};

export const signOut = async () => {
  if (!hasSupabase) return { error: null };
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  if (!hasSupabase) return null;
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
