
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';

import Header from '@/components/Header';
import PageReady from '@/components/PageReady';
import ScrollProgress from '@/components/ScrollProgress';
import FloatingContact from '@/components/FloatingContact';
import BrandExperience from '@/components/BrandExperience';

import { SITE_URL } from '@/lib/site';

export const revalidate = 60;


/* =========================================
   FETCH BRAND + PROJECTS
========================================= */

const getBrandData = cache(async (id) => {
  const { data: brand, error } = await supabaseServer
    .from('brands')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) {
    console.error('getBrand failed:', id, error);
    throw new Error(`Supabase error: ${error.message}`);
  }

  if (!brand) return null;

  const { data: projects, error: projectsError } =
    await supabaseServer
      .from('projects')
      .select('*')
      .eq('brand_id', id)
      .order('sort_order', { ascending: true });

  if (projectsError) {
    console.error('getBrand projects failed:', id, projectsError);
    throw new Error(`Supabase error: ${projectsError.message}`);
  }

  return {
    brand,
    projects: projects || [],
  };
});


/* =========================================
   SEO METADATA
========================================= */

export async function generateMetadata({ params }) {
  const { id } = await params;

  const data = await getBrandData(id);

  if (!data) return {};

  const { brand } = data;

  return {
    title: `${brand.name} — Kohedroo`,

    description:
      `${brand.name} creative projects and case studies by Kohedroo.`,

    alternates: {
      canonical: `/brand/${id}`,
    },

    openGraph: {
      images: brand.logo_url ? [brand.logo_url] : [],
    },
  };
}


/* =========================================
   BRAND PAGE
========================================= */

export default async function BrandPage({ params }) {
  const { id } = await params;

  const data = await getBrandData(id);

  if (!data) {
    notFound();
  }

  const { brand, projects } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    logo: brand.logo_url,
    url: `${SITE_URL}/brand/${id}`,
  };

  return (
    <div className="min-h-screen bg-[#f4f1eb] text-[#22211f]">

      {/* SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <PageReady />

      <ScrollProgress />

      {/* KEEP EXISTING NAVBAR */}
      <Header />

      <main>
        <BrandExperience
          brand={brand}
          projects={projects}
        />
      </main>

      <FloatingContact settings={{}} />

    </div>
  );
}
