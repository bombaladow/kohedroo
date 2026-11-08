import { cache } from 'react';
import { notFound } from 'next/navigation';
import { supabaseServer } from '@/lib/supabaseServer';
import ProjectView from '@/components/ProjectView';
import PageReady from '@/components/PageReady';
import { SITE_URL } from '@/lib/site';

export const revalidate = 60;

const getProject = cache(async (id) => {
  const { data: project } = await supabaseServer
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();
  if (!project) return null;

  const { data: related } = await supabaseServer
    .from('projects')
    .select('*')
    .eq('category', project.category)
    .neq('id', id)
    .limit(2);

  return { project, related: related || [] };
});

export async function generateMetadata({ params }) {
  const { id } = await params;
  const data = await getProject(id);
  if (!data) return {};
  const { project } = data;
  return {
    title: project.title,
    description:
      project.description?.slice(0, 160) ||
      `${project.title} — ${project.category || 'project'} by Kohedroo.`,
    alternates: { canonical: `/work/${id}` },
    openGraph: { images: project.media_url ? [project.media_url] : [] },
  };
}

export default async function ProjectPage({ params }) {
  const { id } = await params;
  const data = await getProject(id);
  if (!data) notFound();
  const { project, related } = data;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    description: project.description,
    image: project.media_url,
    dateCreated: project.year,
    author: { '@type': 'Person', name: 'Kohedroo', url: SITE_URL },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageReady />
      <ProjectView project={project} relatedProjects={related} />
    </>
  );
}