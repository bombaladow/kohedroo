'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useLoading } from '@/lib/LoadingContext';

export default function Preloader() {
  const { isDataLoaded } = useLoading();
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [forceHide, setForceHide] = useState(false); // دراع الأمان

  useEffect(() => {
    // الحد الأدنى لعرض الأنيميشن (1.5 ثانية عشان ميبقاش طويل)
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1500);

    // دراع الأمان: لو مرت 4 ثواني والموقع لسه محملش، هتقفل الشاشة غصب عنها
    const safetyTimer = setTimeout(() => {
      setForceHide(true);
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
    };
  }, []);

  // لو الوقت خلص أو الداتا جاهزة، أو دراع الأمان اشتغل، نخفي الشاشة
  const showPreloader = (!minTimePassed || !isDataLoaded) && !forceHide;

  return (
    <AnimatePresence>
      {showPreloader && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }}
          className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center overflow-hidden"
        >
          <motion.div
            animate={{ 
              y: [0, -25, 0],
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-64 md:w-96 h-24 md:h-32"
          >
            <Image
              src="/KOHEDROO.png"
              alt="Kohedroo Logo"
              fill
              className="object-contain brightness-0 invert opacity-20"
              priority
            />

            <motion.div
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)" }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src="/KOHEDROO.png"
                alt="Kohedroo Logo Fill"
                fill
                className="object-contain brightness-0 invert"
                priority
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="w-[1px] h-12 bg-gradient-to-b from-white/50 to-transparent" />
            <p className="text-white/40 font-mono text-[10px] md:text-xs tracking-[0.4em] uppercase">
              Loading Experience
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}