'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import ImageLightbox from './ImageLightbox';

export default function GraphicDesigns({ projects }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const imageProjects = projects?.filter(p => p.type === 'image') || [];

  if (imageProjects.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-white border-t border-black/5 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold block mb-2">
              Graphic Design
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
              Selected Designs
            </h2>
          </div>
          {/* Swipe Hint - Mobile Only */}
          <span className="md:hidden text-[10px] font-mono uppercase tracking-widest text-zinc-400 animate-pulse">
            Swipe →
          </span>
        </div>

        {/* 📱 موبايل: سكرول أفقي (كروت كبيرة) */}
        <div 
          data-lenis-prevent
          className="md:hidden -mx-6 px-6 flex overflow-x-auto snap-x-mandatory no-scrollbar gap-4 pb-4"
        >
          {imageProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="snap-center flex-shrink-0 w-[85vw] relative rounded-3xl overflow-hidden cursor-pointer bg-zinc-100 shadow-sm active:scale-[0.98] transition-transform"
              onClick={() => setSelectedImage(project.media_url)}
            >
              <img
                src={project.media_url}
                alt={project.title}
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-5">
                <h3 className="text-white font-bold text-lg mb-1">{project.title}</h3>
                <p className="text-white/70 text-xs font-mono uppercase tracking-widest">
                  {project.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 💻 ديسكتوب: Masonry 3 أعمدة */}
        <div className="hidden md:block columns-3 gap-6 space-y-6">
          {imageProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="break-inside-avoid relative rounded-2xl overflow-hidden group cursor-pointer border border-black/5 bg-zinc-50"
              onClick={() => setSelectedImage(project.media_url)}
            >
              <img
                src={project.media_url}
                alt={project.title}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-white font-bold text-xl translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {project.title}
                </h3>
                <p className="text-white/70 text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  {project.category}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <ImageLightbox 
        isOpen={!!selectedImage} 
        onClose={() => setSelectedImage(null)} 
        imageUrl={selectedImage} 
      />
    </section>
  );
}