'use client';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// الرابط ده صورة ولا فيديو؟
const isImageUrl = (u) => u && !/\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(u);

export default function BrandView({ brand, projects }) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="fixed top-6 left-6 md:top-12 md:left-12 z-50">
        <Link href="/" className="inline-flex items-center gap-2 bg-white border border-black/10 px-4 py-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all shadow-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="pt-32 pb-20 px-6 bg-white border-b border-black/5 text-center flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-32 md:w-48 h-20 md:h-28 relative mb-8"
        >
          <img src={brand.logo_url} alt={brand.name} className="absolute inset-0 w-full h-full object-contain" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4"
        >
          {brand.name}
        </motion.h1>

        {brand.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg mb-6"
          >
            {brand.description}
          </motion.p>
        )}

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 font-mono text-sm uppercase tracking-widest"
        >
          Selected Work — {projects.length} Projects
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => {
              const isVideo = Boolean(project.video_url) || !isImageUrl(project.media_url);
              const videoSrc = project.video_url || project.media_url;

              return (
                // animate بدل whileInView: الكارت يظهر دايماً حتى لو الـ IntersectionObserver مشتغلش على الموبايل
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06 }}
                  className="group relative"
                >
                  <Link href={`/work/${project.id}`} className="block">
                    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-200 mb-6">
                      {isImageUrl(project.media_url) ? (
                        // لو في صورة (أو غلاف فيديو) نعرضها بدل ما نحمّل الفيديو
                        <img
                          src={project.media_url}
                          alt={project.title}
                          loading="lazy"
                          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <video
                          src={`${videoSrc}#t=0.1`}
                          muted
                          playsInline
                          preload="metadata"
                          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700"
                        />
                      )}

                      {/* على الموبايل مفيش hover، فأيقونة التشغيل ظاهرة دايماً للفيديو */}
                      {isVideo && (
                        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center md:hidden">
                          <Play size={16} className="text-white ml-0.5" fill="white" />
                        </div>
                      )}

                      {/* الـ overlay بتاع الهوفر للديسكتوب بس */}
                      <div className="hidden md:flex absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                          {isVideo ? <Play size={24} className="text-white ml-1" fill="white" /> : <ArrowUpRight size={24} className="text-white" />}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight mb-1 group-hover:text-zinc-600 transition-colors">{project.title}</h3>
                        <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{project.category}</p>
                      </div>
                      <span className="text-sm font-mono text-zinc-400 border border-black/10 px-3 py-1 rounded-full">{project.year}</span>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 text-zinc-500 font-mono">
            No projects uploaded for this brand yet.
          </div>
        )}
      </div>
    </div>
  );
}