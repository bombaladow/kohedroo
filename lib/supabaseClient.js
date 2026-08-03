import { createClient } from '@supabase/supabase-js';

// لازم تحط القيم دول في .env.local (شوف README-SUPABASE-SETUP.md)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
