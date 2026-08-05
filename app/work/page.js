'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Header from '../../components/Header';
import ContactFooter from '../../components/ContactFooter';
import { useSiteContent } from '../../lib/useSiteContent';

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
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      ) : (
        <img
          src={project.media_url || project.mediaUrl}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      )}

      {/* طبقة الظل والمعلومات عند الـ Hover */}
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

export default function AllWorkPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { settings, projects } = useSiteContent();

  // استخراج الأقسام (Categories) المتاحة من الأعمال بشكل تلقائي
  const categories = ['All', ...Array.from(new Set(projects?.map((p) => p.category || p.tag).filter(Boolean)))];

  // فلترة المشاريع بناءً على القسم المحدد
  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects?.filter((p) => (p.category || p.tag) === selectedCategory);

  return (
    <div className="bg-transparent text-black min-h-screen selection:bg-black selection:text-white font-sans">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      <main className="pt-32 pb-20 px-6 md:px-12">
        {/* زرار الرجوع للرئيسية + عنوان الصفحة */}
        <div className="mb-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 font-mono text-xs text-zinc-600 hover:text-black transition-colors uppercase tracking-wider mb-6"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-black">
            All Projects
          </h1>
          <p className="text-zinc-600 text-lg md:text-xl font-normal mt-2">
            A comprehensive showcase of motion graphics, video editing, and visual identity projects.
          </p>
        </div>

        {/* فلاتر التصفية (Category Filters) */}
        {categories.length > 1 && (
          <div className="flex items-center gap-3 flex-wrap mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all border ${
                  selectedCategory === category
                    ? 'bg-black text-white border-black shadow-md'
                    : 'bg-white/70 backdrop-blur-md text-zinc-700 border-black/15 hover:border-black/40'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* شبكة الأعمال (Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          {filteredProjects?.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects?.length === 0 && (
          <div className="text-center py-20 font-mono text-zinc-500 text-sm">
            No projects found in this category.
          </div>
        )}
      </main>

      <ContactFooter settings={settings} />
    </div>
  );
}