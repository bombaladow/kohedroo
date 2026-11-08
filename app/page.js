import Header from '@/components/Header';
import Hero from '@/components/Hero';
import About from '@/components/About';
import BrandsShowcase from '@/components/BrandsShowcase';
import ContactFooter from '@/components/ContactFooter';
import FloatingContact from '@/components/FloatingContact';
import ScrollProgress from '@/components/ScrollProgress';
import PageReady from '@/components/PageReady';
import ScrollReset from '@/components/ScrollReset';
import { supabaseServer } from '@/lib/supabaseServer';
import { SITE_URL } from '@/lib/site';

export const revalidate = 60;

const MAX_SHOTS = 6;
const isVideoUrl = (url) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url || '');

async function getHomeData() {
  const [content, brands, projects] = await Promise.all([
    supabaseServer.from('site_content').select('*'),
    supabaseServer.from('brands').select('*').order('sort_order', { ascending: true }),
    supabaseServer
      .from('projects')
      .select('id, brand_id, media_url, video_url, type, sort_order')
      .not('brand_id', 'is', null)
      .order('sort_order', { ascending: true }),
  ]);

  const settings = {};
  content.data?.forEach((item) => {
    settings[item.key] = item.value;
  });

  const shotsByBrand = {};
  (projects.data || []).forEach((p) => {
    const url = p.media_url || p.video_url;
    if (!url) return;
    const list = (shotsByBrand[p.brand_id] ||= []);
    if (list.length >= MAX_SHOTS) return;
    list.push({
      key: p.id,
      url,
      isVideo: isVideoUrl(url),
    });
  });

  return { settings, brands: brands.data || [], shotsByBrand };
}

export async function generateMetadata() {
  const { settings } = await getHomeData();
  return {
    alternates: { canonical: '/' },
    description: settings.about_bio?.slice(0, 160) || undefined,
  };
}

export default async function Home() {
  const { settings, brands, shotsByBrand } = await getHomeData();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Kohedroo',
    jobTitle: 'Art Director & AI Creative Lead',
    url: SITE_URL,
    sameAs: [
      'https://www.instagram.com/kohedroo/',
      'https://ae.linkedin.com/in/kohedroo',
      'https://www.behance.net/hoossoo88',
    ],
  };

  return (
    <div className="bg-transparent text-black min-h-screen selection:bg-black selection:text-white font-sans transition-colors duration-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageReady />
      <ScrollReset />
      <div className="noise-bg"></div>
      <ScrollProgress />
      <Header />

      <Hero settings={settings} />
      <About settings={settings} />
      <BrandsShowcase brands={brands} shotsByBrand={shotsByBrand} />

      <ContactFooter settings={settings} />
      <FloatingContact settings={settings} />
    </div>
  );
}