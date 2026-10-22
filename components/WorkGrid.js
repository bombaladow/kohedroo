'use client';

import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { useRef, useEffect } from 'react';
import Link from 'next/link';

function ProjectCard({ project, index }) {
  const videoRef = useRef(null);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.5 });
  const hasVideo = Boolean(project.video_url);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseEnter = () => {
    if (hasVideo && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    if (hasVideo && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (!hasVideo || !videoRef.current) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      if (isInView) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isInView, hasVideo]);

  return (
    <Link href={`/work/${project.id}`} className="block w-full">
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
        style={{ 
          backgroundColor: project.bg_color || '#1a1917',
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
        // صغرنا الـ aspect ratio شوية لـ 4/3 عشان الكارت ميبقاش طويل أوي
        className="group relative cursor-pointer aspect-[4/3] w-full rounded-2xl overflow-hidden border border-black/10 shadow-sm transition-shadow duration-500 hover:border-black/30 hover:shadow-2xl active:scale-[0.98] md:active:scale-100"
      >
        <motion.div 
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
          className="absolute inset-0 w-full h-full"
        >
          {hasVideo ? (
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster={project.media_url}
              src={project.video_url}
              className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          ) : (
            <img
              src={project.media_url}
              alt={project.title || 'Project'}
              className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-700 ease-out"
            />
          )}
        </motion.div>

        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ amount: 0.5 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent 
                     backdrop-blur-[3px] p-5 flex flex-col justify-end z-10
                     md:opacity-0 md:translate-y-3 md:group-hover:opacity-100 md:group-hover:translate-y-0 
                     md:transition-all md:duration-500 md:ease-out"
          style={{ transform: "translateZ(30px)" }}
        >
          <div className="flex justify-between items-end gap-4">
            <div className="min-w-0">
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="text-lg md:text-xl font-extrabold text-white flex items-center gap-2 tracking-tighter"
              >
                <span className="truncate">{project.title}</span>
                <ArrowUpRight
                  size={18}
                  className="text-white/80 md:group-hover:translate-x-1 md:group-hover:-translate-y-1 transition-transform flex-shrink-0"
                />
              </motion.h3>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="text-zinc-300 text-xs mt-1 font-normal"
              >
                {project.category}
              </motion.p>
            </div>
            {project.year && (
              <motion.span
                initial={{ scale: 0.85, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.35 }}
                className="font-mono text-[10px] text-zinc-300 border border-white/20 bg-white/10 backdrop-blur-md px-2 py-1 rounded-full flex-shrink-0"
              >
                {project.year}
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </Link>
  );
}

export default function WorkGrid({ projects, showViewAllButton = true }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  return (
    <section
      id="work"
      className="py-16 md:py-24 px-6 md:px-12 border-t border-black/10 bg-transparent relative z-10"
    >
      <div className="flex justify-between items-end mb-10">
        <motion.h2
          ref={containerRef}
          initial={{ opacity: 0, x: -20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-xs font-mono uppercase text-zinc-600 tracking-widest font-bold"
        >
          Selected Works ({projects?.length || 0})
        </motion.h2>
      </div>

      {projects && projects.length > 0 ? (
        // هنا غيرنا الشبكة لـ 3 أعمدة في الشاشات الكبيرة (lg:grid-cols-3) وقللنا المسافات
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-zinc-400 text-sm font-mono"
        >
          No projects found in this category.
        </motion.div>
      )}

      {showViewAllButton && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mt-12 flex justify-center"
        >
          <Link
            href="/work"
            className="group inline-flex items-center gap-3 bg-black text-white font-mono text-xs uppercase px-8 py-4 rounded-full font-semibold tracking-wider hover:bg-zinc-800 active:scale-95 transition-all shadow-md hover:shadow-xl"
          >
            <span>View All Projects</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      )}
    </section>
  );
}