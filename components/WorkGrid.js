'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { useRef } from 'react';

function ProjectCard({ project }) {
  const videoRef = useRef(null);
  const hasVideo = Boolean(project.video_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="group cursor-pointer"
      onMouseEnter={() => hasVideo && videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (hasVideo && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      <div
        className="relative aspect-[16/10] w-full rounded-lg overflow-hidden mb-4 border border-zinc-800/50"
        style={{ backgroundColor: project.bg_color || project.bgColor || '#1a1917' }}
      >
        {hasVideo ? (
          <video
            ref={videoRef}
            muted
            loop
            playsInline
            preload="metadata"
            poster={project.media_url || project.mediaUrl}
            src={project.video_url}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        ) : (
          <img
            src={project.media_url || project.mediaUrl}
            alt={project.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        )}
      </div>

      <div className="flex justify-between items-start pt-2 border-b border-zinc-900 pb-4">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2 group-hover:text-zinc-300 transition-colors">
            {project.title} <ArrowUpRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </h3>
          <p className="text-zinc-500 text-sm mt-1">{project.category || project.tag}</p>
        </div>
        <span className="font-mono text-xs text-zinc-600">{project.year}</span>
      </div>
    </motion.div>
  );
}

export default function WorkGrid({ projects }) {
  return (
    <section id="work" className="py-20 px-6 md:px-12 border-t border-zinc-900">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest">
          Selected Works ({projects.length})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
