'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useRef } from 'react';
import Link from 'next/link';

function ProjectCard({ project }) {
  const videoRef = useRef(null);
  const hasVideo = Boolean(project.video_url);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
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
      {hasVideo ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={project.media_url || project.mediaUrl}
          src={project.video_url}
          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={project.media_url || project.mediaUrl}
          alt={project.title}
          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}

      {/* 
        طبقة المعاينة والبيانات:
        - للموبايل: بتظهر بسلاسة مع حركة السكرول أول ما الكارت يظهر في الشاشة (whileInView)
        - للكمبيوتر (md:): بتفضل مستنية حركة الـ Hover زي ما هي بالضبط
      */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ amount: 0.5 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent 
                   backdrop-blur-[3px] p-6 md:p-8 flex flex-col justify-end z-10
                   md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 
                   md:transition-all md:duration-500 md:ease-out"
      >
        <div className="flex justify-between items-end gap-4">
          <div>
            <motion.h3 
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 tracking-tighter"
            >
              {project.title}
              <ArrowUpRight size={22} className="text-white/80 md:group-hover:translate-x-1 md:group-hover:-translate-y-1 transition-transform" />
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.25 }}
              className="text-zinc-300 text-sm mt-1 font-normal"
            >
              {project.category || project.tag}
            </motion.p>
          </div>

          <motion.span 
            initial={{ scale: 0.85, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.35 }}
            className="font-mono text-xs text-zinc-300 border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full"
          >
            {project.year}
          </motion.span>
        </div>
      </motion.div>
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

      {/* الزرار الخاص بمشاهدة جميع الأعمال */}
      <div className="mt-16 flex justify-center">
        <Link
          href="/work"
          className="group inline-flex items-center gap-3 bg-black text-white font-mono text-xs uppercase px-8 py-4 rounded-full font-semibold tracking-wider hover:bg-zinc-800 transition-all shadow-md hover:shadow-xl hover:scale-[1.02]"
        >
          <span>View All Projects</span>
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </section>
  );
}