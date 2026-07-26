import { supabase } from "./supabase";

// Sign up with email and password
export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Sign in with email and password
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error: error?.message || null };
}

// Get current user
export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    return { user: null, error: error.message };
  }

  return { user, error: null };
}

// Get session
export async function getSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    return { session: null, error: error.message };
  }

  return { session, error: null };
}

// On auth state change listener
export function onAuthStateChange(callback) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((event, session) => {
    callback(session);
  });

  return subscription;
}
