import { createClient } from '@supabase/supabase-js';

// Διαβάζουμε τις μεταβλητές περιβάλλοντος (π.χ. από .env.local)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key';

export const isSupabaseConfigured = () => {
  return (
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
    !import.meta.env.VITE_SUPABASE_URL.includes('demo-placeholder')
  );
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
