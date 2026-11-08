'use client';
import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLoading } from '@/lib/LoadingContext';
import { useParams, useRouter } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { ArrowLeft, Play, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const EASE = [0.22, 1, 0.36, 1];

function ProjectCard({ project, index }) {
  const cardRef = useRef(null);
  const videoRef = useRef(null);
  const isInView = useInView(cardRef, { amount: 0.6 });
  const hasVideo = Boolean(project.video_url);

  const isTouch = () => typeof window !== 'undefined' && window.innerWidth < 768;

  // موبايل: الفيديو يشتغل لوحده لما الكارت يبقى في نص الشاشة
  useEffect(() => {
    if (!hasVideo || !videoRef.current || !isTouch()) return;
    if (isInView) videoRef.current.play().catch(() => {});
    else videoRef.current.pause();
  }, [isInView, hasVideo]);

  const handleEnter = () => {
    if (hasVideo && videoRef.current && !isTouch()) videoRef.current.play().catch(() => {});
  };
  const handleLeave = () => {
    if (hasVideo && videoRef.current && !isTouch()) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.12, ease: EASE }}
      className="break-inside-avoid mb-6 md:mb-8"
    >
      <Link
        href={`/work/${project.id}`}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        className="group block"
      >
        {/* الميديا: كشف بالـ clip-path + زووم هادي */}
        <motion.div
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 1.1, delay: (index % 3) * 0.12, ease: EASE }}
          className="relative overflow-hidden rounded-2xl bg-zinc-200 border border-black/5 shadow-sm transition-shadow duration-500 group-hover:shadow-2xl"
          style={{ aspectRatio: hasVideo ? '4 / 5' : undefined }}
        >
          <motion.div
            initial={{ scale: 1.25 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.4, delay: (index % 3) * 0.12, ease: EASE }}
            className={hasVideo ? 'absolute inset-0' : ''}
          >
            {/* الصورة (أو البوستر للفيديو) */}
            <img
              src={project.media_url}
              alt={project.title || 'Project'}
              loading="lazy"
              className={`w-full ${hasVideo ? 'h-full object-cover' : 'h-auto'} transition-transform duration-700 ease-out md:group-hover:scale-105`}
            />
            {hasVideo && (
              <video
                ref={videoRef}
                src={project.video_url}
                muted
                loop
                playsInline
                preload="none"
                className="absolute inset-0 w-full h-full object-cover opacity-0 md:group-hover:opacity-100 transition-all duration-500 md:group-hover:scale-105"
                style={isInView ? { opacity: 1 } : undefined}
              />
            )}
          </motion.div>

          {/* تدرج + العنوان بيطلع من تحت */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-80 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 flex items-end justify-between gap-4 pointer-events-none md:translate-y-4 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="min-w-0">
              {project.category && (
                <p className="text-[10px] font-mono uppercase tracking-widest text-white/70 mb-1">{project.category}</p>
              )}
              <h3 className="text-white text-lg md:text-xl font-bold tracking-tight truncate">{project.title}</h3>
            </div>
            {project.year && (
              <span className="font-mono text-[10px] text-white/80 border border-white/25 px-2.5 py-1 rounded-full flex-shrink-0">
                {project.year}
              </span>
            )}
          </div>

          {/* رقم الكارت */}
          <span className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-white/90 mix-blend-difference">
            {String(index + 1).padStart(2, '0')}
          </span>

          {/* زرار التشغيل / السهم */}
          <div className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/90 text-black flex items-center justify-center scale-90 opacity-100 md:opacity-0 md:scale-50 md:group-hover:opacity-100 md:group-hover:scale-100 transition-all duration-500 ease-out">
            {hasVideo ? (
              <Play size={16} className="ml-0.5" fill="currentColor" />
            ) : (
              <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:rotate-12" />
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function BrandPage() {
  const { id } = useParams();
  const router = useRouter();
  const { setIsDataLoaded } = useLoading();
  const [brand, setBrand] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      const { data: brandData, error: brandError } = await supabase.from('brands').select('*').eq('id', id).single();
      if (brandError || !brandData) {
        setIsDataLoaded(true);
        router.push('/');
        return;
      }
      setBrand(brandData);

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_id', id)
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);
      setLoading(false);
      setIsDataLoaded(true);
    };
    fetchBrandData();
  }, [id, router, setIsDataLoaded]);

  if (loading || !brand) return null;

  // 🎛️ التحكم في حجم اللوجو: من لوحة التحكم > Brands > Size Multiplier
  // 1 = الحجم الطبيعي، 0.5 = نص الحجم، 2 = ضعف الحجم
  const size = Math.min(Math.max(parseFloat(brand.size) || 1, 0.4), 2.5);
  const logoStyle = {
    width: `clamp(${(7 * size).toFixed(2)}rem, ${(26 * size).toFixed(2)}vw, ${(13 * size).toFixed(2)}rem)`,
    height: `clamp(${(4 * size).toFixed(2)}rem, ${(15 * size).toFixed(2)}vw, ${(7.5 * size).toFixed(2)}rem)`,
    maxWidth: '85vw',
  };

  return (
    <div className="min-h-screen bg-zinc-50">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed top-6 left-6 md:top-12 md:left-12 z-50"
      >
        <Link href="/" className="inline-flex items-center gap-2 bg-white border border-black/10 px-4 py-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all shadow-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </motion.div>

      {/* الهيدر */}
      <div className="relative pt-32 pb-20 px-6 bg-white border-b border-black/5 text-center flex flex-col items-center overflow-hidden">
        {/* حلقات خلفية بتدور بهدوء */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[640px] h-[640px] border border-black/[0.05] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          className="absolute w-[440px] h-[440px] border border-black/[0.05] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] pointer-events-none"
        />

        {/* اللوجو */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE }}
          className="relative z-10 mb-8 flex items-center justify-center"
          style={logoStyle}
        >
          <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain" />
        </motion.div>

        {/* الاسم: بيطلع من ورا قناع */}
        <div className="relative z-10 overflow-hidden mb-4">
          <motion.h1
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
            className="text-4xl md:text-6xl font-extrabold tracking-tighter"
          >
            {brand.name}
          </motion.h1>
        </div>

        {brand.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
            className="relative z-10 text-zinc-600 max-w-2xl mx-auto text-lg mb-6"
          >
            {brand.description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="relative z-10 flex flex-col items-center gap-4"
        >
          <p className="text-zinc-400 font-mono text-sm uppercase tracking-widest">
            Selected Work — {projects.length} {projects.length === 1 ? 'Project' : 'Projects'}
          </p>
          <motion.div
            animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-black origin-top"
          />
        </motion.div>
      </div>

      {/* الشغل */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-20">
        {projects.length > 0 ? (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
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