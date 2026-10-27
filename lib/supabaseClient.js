import { createClient } from '@supabase/supabase-js';

// Set these in .env.local and in the Vercel project's Environment Variables:
//   NEXT_PUBLIC_SUPABASE_URL      = https://ruuowotwfnfibswwqepx.supabase.co
//   NEXT_PUBLIC_SUPABASE_ANON_KEY = sb_publishable_f168CiMvlJGvlijNTiFCrg_A6OVA8_7
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);