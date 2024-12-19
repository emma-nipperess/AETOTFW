import { supabase } from './supabaseClient';

/**
 * Signs up a new user using Supabase Auth.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{user, error}>} - The user object or an error message.
 */
export const signUpUser = async (email, password) => {
  const { user, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error('Sign-up error:', error.message);
  }
  return { user, error };
};

/**
 * Logs in a user using Supabase Auth.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @returns {Promise<{session, error}>} - The session object or an error message.
 */
export const loginUser = async (email, password) => {
  const { session, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login error:', error.message);
  }
  return { session, error };
};

/**
 * Logs out the current user using Supabase Auth.
 * @returns {Promise<{error}>} - An error message, if any.
 */
export const logoutUser = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout error:', error.message);
  }
  return { error };
};

/**
 * Gets the currently authenticated user.
 * @returns {Promise<{user, error}>} - The current user object or an error message.
 */
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching current user:', error.message);
  }
  return { user, error };
};
