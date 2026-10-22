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
  const { projects, settings } = useSiteContent(); // شيلنا loading
  
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
      
      <main className="pt-32 pb-10">
        {/* ... (نفس الكود القديم) ... */}
        <div className="text-center mb-12 px-6">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4">
            All Projects
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-zinc-500 font-mono text-sm uppercase tracking-widest">
            The Complete Archive
          </motion.p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-wrap items-center justify-center gap-3 md:gap-4 px-6 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 border ${
                activeCategory === cat ? 'bg-black text-white border-black shadow-md' : 'bg-transparent text-zinc-600 border-black/20 hover:border-black/50 hover:text-black'
              }`}
            >
              {cat === 'All' ? 'All Works' : cat}
            </button>
          ))}
        </motion.div>

        <WorkGrid projects={filteredProjects} showViewAllButton={false} />
      </main>

      <FloatingContact settings={settings} />
    </div>
  );
}