import { createClient } from '@supabase/supabase-js';

// لازم تحط القيم دول في .env.local (شوف README-SUPABASE-SETUP.md)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ruuowotwfnfibswwqepx.supabase.co/rest/v1/';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_f168CiMvlJGvlijNTiFCrg_A6OVA8_7';  
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
