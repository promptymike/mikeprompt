import { supabase, hasSupabase } from "./supabase";

// REJESTRACJA
export const signUp = async (email: string, password: string, name?: string) => {
  if (!hasSupabase) return { data: null, error: new Error("Supabase not configured") };
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  return { data, error };
};

// LOGOWANIE
export const signIn = async (email: string, password: string) => {
  if (!hasSupabase) return { data: null, error: new Error("Supabase not configured") };
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

// RESET HASŁA
export const resetPassword = async (email: string) => {
  if (!hasSupabase) return { error: new Error("Supabase not configured") };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  return { error };
};

// WYLOGOWANIE
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
