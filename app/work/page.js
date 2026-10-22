'use client';

import { useState, useMemo } from 'react';
import Header from '@/components/Header';
import WorkGrid from '@/components/WorkGrid';
import ScrollProgress from '@/components/ScrollProgress';
import FloatingContact from '@/components/FloatingContact';
import { useSiteContent } from '@/lib/useSiteContent';
import { motion } from 'framer-motion';

export default function AllWorkPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { projects, settings } = useSiteContent();
  
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = useMemo(() => {
    if (!projects) return ['All'];
    const cats = projects.map(p => p.category).filter(Boolean);
    return ['All', ...new Set(cats)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    if (activeCategory === 'All') return projects;
    return projects.filter(p => p.category === activeCategory);
  }, [projects, activeCategory]);

  return (
    <div className="bg-transparent text-black min-h-screen selection:bg-black selection:text-white font-sans transition-colors duration-300">
      <div className="noise-bg"></div>
      <ScrollProgress />
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      <main className="pt-28 md:pt-32 pb-10">
        <div className="text-center mb-10 md:mb-12 px-6">
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter mb-4">All Projects</h1>
          <p className="text-zinc-500 font-mono text-xs md:text-sm uppercase tracking-widest">The Complete Archive</p>
        </div>

        {/* الفلاتر */}
        <div className="flex overflow-x-auto md:flex-wrap md:justify-center items-center gap-2 md:gap-4 px-6 mb-10 md:mb-12 no-scrollbar snap-x-mandatory">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`snap-center flex-shrink-0 px-5 py-2.5 rounded-full text-xs md:text-sm font-semibold tracking-wide transition-all duration-300 border ${
                activeCategory === cat ? 'bg-black text-white border-black shadow-md' : 'bg-transparent text-zinc-600 border-black/20 hover:border-black/50 hover:text-black'
              }`}
            >
              {cat === 'All' ? 'All Works' : cat}
            </button>
          ))}
        </div>

        <WorkGrid projects={filteredProjects} showViewAllButton={false} />
      </main>

      <FloatingContact settings={settings} />
    </div>
  );
}