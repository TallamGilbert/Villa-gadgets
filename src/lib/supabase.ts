import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// If keys are missing, we'll provide a warning but still export the client
// This prevents the app from crashing on initial load if user hasn't set secrets yet.
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your secrets.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
