'use client';
import { useState, useEffect, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const SLIDE_INTERVAL = 1000; // مدة كل لقطة (ms)
const MAX_SHOTS = 6;

const isVideoUrl = (url) => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(url || '');

function Shot({ shot }) {
  return (
    <motion.div
      key={shot.key}
      initial={{ opacity: 0, scale: 1.14 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0"
    >
      {shot.isVideo ? (
        <video
          src={`${shot.url}#t=0.1`}
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      ) : (
        <img src={shot.url} alt="" className="h-full w-full object-cover" />
      )}
    </motion.div>
  );
}

function BrandButton({ brand, shots, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);
  const [shotIndex, setShotIndex] = useState(0);
  const preloaded = useRef(false);

  // موضع الماوس (نسبة مئوية) للإضاءة الداخلية
  const mx = useMotionValue(50);
  const my = useMotionValue(50);

  // ميل ثلاثي الأبعاد ناعم
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 180, damping: 18 });
  const sy = useSpring(py, { stiffness: 180, damping: 18 });
  const rotateX = useTransform(sy, [-0.5, 0.5], [9, -9]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-9, 9]);
  const logoX = useTransform(sx, [-0.5, 0.5], [-10, 10]);
  const logoY = useTransform(sy, [-0.5, 0.5], [-8, 8]);

  const glare = useMotionTemplate`radial-gradient(240px circle at ${mx}% ${my}%, rgba(255,255,255,0.85), rgba(255,255,255,0) 65%)`;

  const hasShots = shots.length > 0;

  // تقليب اللقطات وقت الهوفر
  useEffect(() => {
    if (!hovered || shots.length < 2) return;
    const t = setInterval(() => {
      setShotIndex((i) => (i + 1) % shots.length);
    }, SLIDE_INTERVAL);
    return () => clearInterval(t);
  }, [hovered, shots.length]);

  const preload = () => {
    if (preloaded.current) return;
    preloaded.current = true;
    shots.forEach((s) => {
      if (!s.isVideo) {
        const img = new Image();
        img.src = s.url;
      }
    });
  };

  const handleEnter = (e) => {
    if (e.pointerType !== 'mouse') return;
    preload();
    setShotIndex(0);
    setHovered(true);
  };

  const handleMove = (e) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    mx.set(x * 100);
    my.set(y * 100);
    px.set(x - 0.5);
    py.set(y - 0.5);
  };

  const handleLeave = () => {
    setHovered(false);
    px.set(0);
    py.set(0);
    mx.set(50);
    my.set(50);
  };

  const scale = Math.min(Math.max(parseFloat(brand.size) || 1, 0.5), 1.6);
  const showShots = hovered && hasShots;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: (index % 5) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        ref={ref}
        onPointerEnter={handleEnter}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          href={`/brand/${brand.id}`}
          aria-label={brand.name}
          className="group relative flex items-center justify-center aspect-[4/3] w-full overflow-hidden rounded-3xl
                     border border-white/70 bg-white/35 backdrop-blur-2xl
                     shadow-[0_8px_32px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.9),inset_0_-1px_0_rgba(0,0,0,0.04)]
                     transition-[box-shadow,background-color,border-color] duration-500
                     hover:bg-white/55 hover:border-white
                     hover:shadow-[0_24px_60px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,1)]"
        >
          {/* لقطات الشغل اللي جوه الشركة */}
          {hasShots && (
            <motion.div
              aria-hidden
              initial={false}
              animate={{ opacity: showShots ? 1 : 0 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute inset-0"
            >
              <AnimatePresence initial={false}>
                {showShots && <Shot key={shots[shotIndex].key} shot={shots[shotIndex]} />}
              </AnimatePresence>
              {/* تعتيم خفيف عشان اللمعة والمؤشر يبانوا */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />

              {/* مؤشر اللقطات */}
              {shots.length > 1 && (
                <div className="absolute inset-x-5 bottom-4 flex gap-1.5">
                  {shots.map((s, i) => (
                    <span
                      key={s.key}
                      className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/30"
                    >
                      {i < shotIndex && (
                        <span className="absolute inset-0 bg-white" />
                      )}
                      {i === shotIndex && showShots && (
                        <motion.span
                          key={`bar-${shotIndex}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: SLIDE_INTERVAL / 1000, ease: 'linear' }}
                          className="absolute inset-0 origin-left bg-white"
                        />
                      )}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* إضاءة تتبع الماوس */}
          <motion.div
            aria-hidden
            style={{ background: glare }}
            className="pointer-events-none absolute inset-0 z-20 opacity-0 mix-blend-soft-light transition-opacity duration-500 group-hover:opacity-100"
          />

          {/* لمعة تعدي على الزرار */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/2 z-20 w-1/3 -skew-x-12
                       bg-gradient-to-r from-transparent via-white/80 to-transparent
                       -translate-x-full opacity-0
                       group-hover:translate-x-[420%] group-hover:opacity-100
                       transition-all duration-[1100ms] ease-out"
          />

          {/* اللوجو */}
          <motion.div
            style={{ x: logoX, y: logoY, translateZ: 40 }}
            animate={
              showShots
                ? { opacity: 0, scale: 0.7, filter: 'blur(6px)' }
                : { opacity: 1, scale: 1, filter: 'blur(0px)' }
            }
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 flex items-center justify-center w-3/5 h-3/5"
          >
            <img
              src={brand.logo_url}
              alt={brand.name}
              loading="lazy"
              style={{ transform: `scale(${scale})` }}
              className="max-w-full max-h-full object-contain opacity-80 drop-shadow-[0_6px_14px_rgba(0,0,0,0.18)]
                         transition-[opacity,filter] duration-500
                         group-hover:opacity-100 group-hover:drop-shadow-[0_12px_24px_rgba(0,0,0,0.28)]"
            />
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function BrandsShowcase() {
  const [brands, setBrands] = useState([]);
  const [shotsByBrand, setShotsByBrand] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const [{ data: brandsData }, { data: projectsData }] = await Promise.all([
        supabase.from('brands').select('*').order('sort_order', { ascending: true }),
        supabase
          .from('projects')
          .select('id, brand_id, media_url, video_url, type, sort_order')
          .not('brand_id', 'is', null)
          .order('sort_order', { ascending: true }),
      ]);

      if (brandsData) setBrands(brandsData);

      const grouped = {};
      (projectsData || []).forEach((p) => {
        const url = p.media_url || p.video_url;
        if (!url) return;
        const list = (grouped[p.brand_id] ||= []);
        if (list.length >= MAX_SHOTS) return;
        list.push({
          key: p.id,
          url,
          isVideo: Boolean(p.video_url) && isVideoUrl(url) ? true : isVideoUrl(url),
        });
      });
      setShotsByBrand(grouped);
    };
    fetchData();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section
      id="brands"
      className="relative z-10 overflow-hidden border-t border-black/5 bg-zinc-100 py-20 md:py-32"
    >
      {/* خلفية متحركة عشان تبان شفافية الزجاج */}
      <motion.div
        aria-hidden
        animate={{ x: [0, 80, -40, 0], y: [0, 40, -30, 0], scale: [1, 1.15, 0.95, 1] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-zinc-900/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, -90, 50, 0], y: [0, -50, 40, 0], scale: [1, 0.9, 1.2, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute -right-32 bottom-0 h-[32rem] w-[32rem] rounded-full bg-amber-700/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ x: [0, 60, -60, 0], y: [0, -30, 30, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
        className="pointer-events-none absolute left-1/3 top-1/2 h-72 w-72 rounded-full bg-zinc-500/25 blur-3xl"
      />

      <div className="relative mx-auto mb-10 max-w-7xl px-6 text-center md:mb-16 md:px-12 md:text-left">
        <span className="mb-2 block font-mono text-xs font-bold uppercase tracking-widest text-zinc-500 md:mb-3">
          Case Studies
        </span>
        <h2 className="text-3xl font-extrabold tracking-tighter md:text-5xl">
          Brands I&apos;ve Worked With
        </h2>
      </div>

      <div className="relative mx-auto grid max-w-[1400px] grid-cols-2 gap-4 px-6 sm:grid-cols-3 md:gap-6 md:px-12 lg:grid-cols-4 xl:grid-cols-5">
        {brands.map((brand, index) => (
          <BrandButton
            key={brand.id}
            brand={brand}
            shots={shotsByBrand[brand.id] || []}
            index={index}
          />
        ))}
      </div>
    </section>
  );
}