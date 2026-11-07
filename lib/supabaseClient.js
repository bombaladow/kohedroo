import { createClient } from '@supabase/supabase-js';

// ملحوظة: الرابط لازم يكون من غير /rest/v1/ في الآخر، وإلا الـ Storage مش هيشتغل.
// الأفضل تحط القيم دي في .env.local وعلى Vercel.
export const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ruuowotwfnfibswwqepx.supabase.co';
export const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_f168CiMvlJGvlijNTiFCrg_A6OVA8_7';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);