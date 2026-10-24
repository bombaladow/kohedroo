'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowDown, MessageSquare } from 'lucide-react';
import MagneticButton from './MagneticButton';

export default function Hero({ settings }) {
  const stats = [
    ['13+', 'Years Experience'],
    ['100+', 'AI Commercial Videos'],
    ['UAE & EG', 'Key Markets'],
  ];

  return (
    <section className="pt-32 md:pt-40 pb-20 px-6 md:px-12 flex flex-col justify-center items-center text-center overflow-hidden min-h-[85vh]">
      <div className="max-w-4xl flex flex-col items-center">
        
        {/* اللوجو الرئيسي */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-64 sm:w-80 md:w-[28rem] h-24 sm:h-32 md:h-40 mb-8 flex items-center justify-center"
        >
          <Image
            src="/KOHEDROO.png"
            alt={settings?.hero_title || 'KOHEDROO'}
            fill
            className="object-contain"
            priority
          />
        </motion.div>

        {/* النبذة المختصرة */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="text-zinc-700 text-lg sm:text-xl md:text-2xl font-normal leading-relaxed tracking-tight max-w-3xl mb-10 px-2"
        >
          {settings?.hero_subtitle ||
            'Art Director & AI Creative Lead with 13+ years driving visual storytelling, AI production, and premium commercial branding across Dubai & Egypt.'}
        </motion.p>

        {/* الأزرار */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.6 } },
          }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20 w-full sm:w-auto px-4 sm:px-0"
        >
          <MagneticButton className="w-full sm:w-auto">
            <motion.a
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
              }}
              href="#about"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-black text-white font-mono text-xs uppercase px-8 py-4 rounded-full font-semibold tracking-wider hover:bg-zinc-800 transition-all shadow-md"
            >
              <span>Discover My Work</span>
              <ArrowDown size={15} className="group-hover:translate-y-1 transition-transform" />
            </motion.a>
          </MagneticButton>

          <motion.a
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            href="/book-now"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border border-black/15 text-black font-mono text-xs uppercase px-8 py-4 rounded-full font-semibold tracking-wider hover:bg-white hover:border-black/40 transition-all shadow-sm"
          >
            <MessageSquare size={15} />
            <span>Book a Call</span>
          </motion.a>
        </motion.div>
      </div>

      {/* الإحصائيات */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.15, delayChildren: 1 } } }}
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