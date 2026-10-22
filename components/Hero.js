'use client';

import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowDown, MessageSquare } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import MagneticButton from './MagneticButton';

export default function Hero({ settings }) {
  const containerRef = useRef(null);
  const [brands, setBrands] = useState([]);

  // جلب اللوجوهات من الداتابيز
  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase.from('brands').select('*').order('sort_order', { ascending: true });
      if (data && data.length > 0) {
        setBrands(data.map(b => ({ name: b.name, logo: b.logo_url, size: b.size })));
      } else {
        setBrands([
          { name: 'Dubai Duty Free', logo: '/brands/dubai-duty-free.png', size: 1.15 },
          { name: 'Joyalukkas', logo: '/brands/joyalukkas.png', size: 1.2 },
          { name: 'el-gharir', logo: '/brands/el-gharir.png', size: 1 },
        ]);
      }
    };
    fetchBrands();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const logoOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0.2]);

  const stats = [
    ['13+', 'Years Experience'],
    ['100+', 'AI Commercial Videos'],
    ['UAE & EG', 'Key Markets'],
  ];

  const BASE_HEIGHT_MOBILE = 48;
  const BASE_HEIGHT_DESKTOP = 72;

  return (
    <section
      ref={containerRef}
      className="pt-28 md:pt-32 pb-16 px-6 md:px-12 flex flex-col justify-between items-center text-center overflow-hidden"
    >
      <div className="max-w-4xl flex flex-col items-center">
        <motion.div
          style={{ y: logoY, opacity: logoOpacity }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-56 sm:w-72 md:w-96 h-20 sm:h-24 md:h-32 mb-6 flex items-center justify-center"
        >
          <Image
            src="/KOHEDROO.png"
            alt={settings?.hero_title || 'KOHEDROO'}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-zinc-700 text-base sm:text-lg md:text-2xl font-normal leading-relaxed tracking-tight max-w-3xl mb-8 px-2"
        >
          {settings?.hero_subtitle ||
            'Art Director & AI Creative Lead with 13+ years driving visual storytelling, AI production, and premium commercial branding across Dubai & Egypt.'}
        </motion.p>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } },
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 md:mb-16 w-full sm:w-auto px-4 sm:px-0"
        >
          <MagneticButton className="w-full sm:w-auto">
            <motion.a
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              href="#work"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white font-mono text-xs uppercase px-7 py-3.5 rounded-full font-semibold tracking-wider hover:bg-zinc-800 transition-all shadow-md"
            >
              <span>Explore Projects</span>
              <ArrowDown size={15} className="group-hover:translate-y-1 transition-transform" />
            </motion.a>
          </MagneticButton>

          <motion.a
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border border-black/15 text-black font-mono text-xs uppercase px-7 py-3.5 rounded-full font-semibold tracking-wider hover:bg-white hover:border-black/40 transition-all shadow-sm"
          >
            <MessageSquare size={15} />
            <span>Let&apos;s Talk</span>
          </motion.a>
        </motion.div>
      </div>

      {/* Brands Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="w-full max-w-6xl border-t border-black/10 pt-10 mb-14 md:mb-16"
      >
        <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest block mb-8 md:mb-10 font-semibold">
          Brands & Clients Worked With
        </span>

        {/* 📱 موبايل: Horizontal Snap Scroll مع data-lenis-prevent عشان نمنع تعليق السكرول */}
        <div 
          data-lenis-prevent
          className="md:hidden -mx-6 px-6 w-[calc(100%+3rem)] overflow-x-auto snap-x-mandatory no-scrollbar flex flex-nowrap gap-8 py-4"
        >
          {brands.map((brand, i) => {
            const scale = brand.size || 1;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
                className="snap-center flex-shrink-0 flex items-center justify-center h-16 px-2"
                style={{ minWidth: '100px' }}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    height: `${BASE_HEIGHT_MOBILE * scale}px`,
                    maxWidth: `${150 * scale}px`,
                  }}
                  className="w-auto object-contain"
                />
              </motion.div>
            );
          })}
        </div>

        {/* 💻 ديسكتوب: Flex Wrap */}
        <div className="hidden md:flex flex-wrap items-center justify-center gap-x-20 gap-y-10 py-4">
          {brands.map((brand, i) => {
            const scale = brand.size || 1;
            return (
              <motion.img
                key={i}
                src={brand.logo}
                alt={brand.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: (i % 10) * 0.03 }}
                style={{
                  height: `${BASE_HEIGHT_DESKTOP * scale}px`,
                  maxWidth: `${190 * scale}px`,
                }}
                className="w-auto object-contain transition-transform duration-300 hover:scale-110 cursor-pointer"
              />
            );
          })}
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.4 }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
        className="w-full max-w-4xl border-t border-black/10 pt-10 flex justify-center gap-8 sm:gap-12 md:gap-24 flex-wrap"
      >
        {stats.map(([value, label], i) => (
          <motion.div
            key={i}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className="flex flex-col items-center"
          >
            <span className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black font-sans leading-none">
              {value}
            </span>
            <span className="text-zinc-500 text-[10px] md:text-xs font-mono uppercase tracking-widest font-semibold mt-2">
              {label}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}