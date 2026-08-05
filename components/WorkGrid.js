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
      // الكارت الأساسي أصبح يحتوي على كل العناصر + الحدود الدائرية والـ hover
      className="group relative cursor-pointer aspect-[16/10] w-full rounded-2xl overflow-hidden border border-black/10 shadow-sm transition-all duration-500 hover:border-black/30 hover:shadow-2xl"
      style={{ backgroundColor: project.bg_color || project.bgColor || '#1a1917' }}
      onMouseEnter={() => hasVideo && videoRef.current?.play().catch(() => {})}
      onMouseLeave={() => {
        if (hasVideo && videoRef.current) {
          videoRef.current.pause();
          videoRef.current.currentTime = 0;
        }
      }}
    >
      {/* الوسائط (فيديو / صورة) */}
      {hasVideo ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={project.media_url || project.mediaUrl}
          src={project.video_url}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={project.media_url || project.mediaUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}

      {/* طبقة الظل والمعلومات الداخلية (Hover Overlay) */}
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent 
                   backdrop-blur-[3px] p-6 md:p-8 flex flex-col justify-end
                   opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 
                   transition-all duration-500 ease-out z-10"
      >
        <div className="flex justify-between items-end gap-4">
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 tracking-tighter">
              {project.title}
              <ArrowUpRight size={22} className="text-white/80 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </h3>
            <p className="text-zinc-300 text-sm mt-1 font-normal">
              {project.category || project.tag}
            </p>
          </div>

          <span className="font-mono text-xs text-zinc-300 border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full">
            {project.year}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function WorkGrid({ projects }) {
  return (
    <section id="work" className="py-20 px-6 md:px-12 border-t border-black/10 bg-transparent">
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-xs font-mono uppercase text-zinc-600 tracking-widest font-bold">
          Selected Works ({projects?.length || 0})
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
        {projects?.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}