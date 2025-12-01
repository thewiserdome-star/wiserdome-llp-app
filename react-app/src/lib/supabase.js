/**
 * Supabase Configuration
 * 
 * This module initializes the Supabase client for the Wiserdome application.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a Supabase project at https://supabase.com
 * 2. Get your project URL and anon key from Settings > API
 * 3. Replace the placeholder values below with your actual credentials
 */

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Replace these placeholders with your actual Supabase project credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://tvijjwcetyxmosfleggl.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWpqd2NldHl4bW9zZmxlZ2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTM3NjYsImV4cCI6MjA4MDEyOTc2Nn0.MnqtE2ZLJiedvcNB1FkZI6COKw-e10HvD1LeUkb02Ek';

// Check if Supabase credentials are configured
export function isSupabaseConfigured() {
  return SUPABASE_URL !== 'https://tvijjwcetyxmosfleggl.supabase.co' && 
         SUPABASE_ANON_KEY !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2aWpqd2NldHl4bW9zZmxlZ2dsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NTM3NjYsImV4cCI6MjA4MDEyOTc2Nn0.MnqtE2ZLJiedvcNB1FkZI6COKw-e10HvD1LeUkb02Ek';
}

// Create Supabase client
let supabaseClient = null;

export function getSupabaseClient() {
  if (!supabaseClient && isSupabaseConfigured()) {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

export const supabase = isSupabaseConfigured() 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
