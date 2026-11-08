import { supabaseServer } from '@/lib/supabaseServer';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export default async function sitemap() {
  const [{ data: brands }, { data: projects }] = await Promise.all([
    supabaseServer.from('brands').select('id, created_at'),
    supabaseServer.from('projects').select('id, created_at'),
  ]);

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/work`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/book-now`, priority: 0.5 },
    ...(brands || []).map(b => ({ url: `${SITE_URL}/brand/${b.id}`, lastModified: b.created_at, priority: 0.7 })),
    ...(projects || []).map(p => ({ url: `${SITE_URL}/work/${p.id}`, lastModified: p.created_at, priority: 0.6 })),
  ];
}