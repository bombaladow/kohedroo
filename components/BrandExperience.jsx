
'use client';

import { useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { ArrowUpRight, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


/* =========================================
   INTERACTIVE BRAND LOGO
========================================= */

function InteractiveBrandLogo({ brand }) {
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  const smoothX = useSpring(pointerX, {
    stiffness: 100,
    damping: 18,
  });

  const smoothY = useSpring(pointerY, {
    stiffness: 100,
    damping: 18,
  });

  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-9, 9]);
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [9, -9]);

  const glowX = useTransform(smoothX, [-0.5, 0.5], [-35, 35]);
  const glowY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  const handleMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    pointerX.set(x);
    pointerY.set(y);
  };

  const resetPosition = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const handleTouch = () => {
    pointerX.set(0.15);
    pointerY.set(-0.15);
  };

  return (
    <section className="relative flex min-h-[78svh] items-center justify-center overflow-hidden px-6 md:min-h-[88vh]">

      {/* Ambient light */}
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-[#d8cbb4]/45 blur-[100px] md:h-[500px] md:w-[500px]"
      />

      {/* Outer animated ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 45,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="pointer-events-none absolute h-[280px] w-[280px] rounded-full border border-black/[0.07] md:h-[470px] md:w-[470px]"
      >
        <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 rounded-full bg-[#b49b73]" />
      </motion.div>

      {/* Inner animated ring */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="pointer-events-none absolute h-[220px] w-[220px] rounded-full border border-dashed border-black/[0.06] md:h-[380px] md:w-[380px]"
      />

      {/* Logo interaction area */}
      <div
        onMouseMove={handleMove}
        onMouseLeave={resetPosition}
        onTouchStart={handleTouch}
        onTouchEnd={resetPosition}
        className="relative z-10 flex h-[280px] w-[280px] items-center justify-center md:h-[470px] md:w-[470px]"
        style={{ perspective: 1000 }}
      >
        {brand.logo_url && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
              filter: 'blur(18px)',
            }}
            animate={{
              opacity: 1,
              scale: 1,
              filter: 'blur(0px)',
            }}
            transition={{
              duration: 1.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              rotateX,
              rotateY,
              transformStyle: 'preserve-3d',
            }}
            className="relative flex h-44 w-44 items-center justify-center md:h-64 md:w-64"
          >
            <motion.img
              src={brand.logo_url}
              alt={brand.name}
              draggable={false}
              whileHover={{ scale: 1.06 }}
              transition={{ duration: 0.5 }}
              className="relative z-10 max-h-full max-w-full select-none object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.08)]"
            />
          </motion.div>
        )}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-9 left-0 right-0 flex justify-center">
        <motion.div
          animate={{
            y: [0, 8, 0],
            opacity: [0.35, 0.8, 0.35],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="flex flex-col items-center gap-3"
        >
          <span className="font-mono text-[8px] uppercase tracking-[0.35em] text-black/40">
            Scroll to explore
          </span>

          <span className="h-8 w-px bg-black/30" />
        </motion.div>
      </div>

    </section>
  );
}


/* =========================================
   MOVING IMAGE MARQUEE
========================================= */

function ImageMarquee({ projects }) {
  const [isPaused, setIsPaused] = useState(false);

  if (!projects.length) return null;

  const imageSizes = [
    'w-[220px] md:w-[390px] aspect-[4/5]',
    'w-[280px] md:w-[500px] aspect-[5/4]',
    'w-[210px] md:w-[350px] aspect-[3/4]',
    'w-[270px] md:w-[470px] aspect-[4/3]',
    'w-[220px] md:w-[390px] aspect-[4/5]',
  ];

  const repeatedProjects = [...projects, ...projects];

  return (
    <section className="relative overflow-hidden py-14 md:py-24">

      <div
        className="brand-marquee overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="brand-marquee-track flex w-max items-center gap-3 md:gap-6"
          style={{
            animationPlayState: isPaused ? 'paused' : 'running',
          }}
        >
          {repeatedProjects.map((project, index) => {
            const originalIndex = index % projects.length;

            return (
              <Link
                key={`${project.id}-${index}`}
                href={`/work/${project.id}`}
                aria-label="View project"
                className={`group relative block shrink-0 overflow-hidden bg-[#e4dfd6] ${
                  imageSizes[originalIndex % imageSizes.length]
                }`}
              >
                <img
                  src={project.media_url}
                  alt=""
                  loading={index < projects.length ? 'eager' : 'lazy'}
                  draggable={false}
                  className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />

                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-[#f5f3ee] text-black opacity-0 transition-all duration-300 group-hover:opacity-100">
                  <ArrowUpRight size={17} />
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <style jsx global>{`
        @keyframes brand-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .brand-marquee-track {
          animation: brand-marquee 55s linear infinite;
          will-change: transform;
        }

        @media (max-width: 767px) {
          .brand-marquee-track {
            animation-duration: 42s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .brand-marquee-track {
            animation: none;
            transform: none;
          }
        }
      `}</style>

    </section>
  );
}


/* =========================================
   REELS VIDEO SHOWCASE
========================================= */

function VideoShowcase({ projects }) {
  if (!projects.length) return null;

  return (
    <section className="relative bg-[#e9e5dd] px-5 py-16 md:px-12 md:py-24">

      <div className="mx-auto max-w-[1200px]">

        <div className="flex flex-wrap items-start justify-center gap-6 md:gap-10">

          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.7,
                delay: (index % 3) * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-[min(72vw,240px)] sm:w-[220px] md:w-[230px] lg:w-[245px]"
            >

              <div className="group relative aspect-[9/16] overflow-hidden rounded-[3px] bg-[#d6d0c6] shadow-[0_15px_40px_rgba(0,0,0,0.07)]">

                <video
                  src={project.video_url}
                  poster={project.media_url || undefined}
                  controls
                  playsInline
                  preload="metadata"
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <Link
                  href={`/work/${project.id}`}
                  aria-label="View project"
                  className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3ee]/90 text-black opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
                >
                  <ArrowUpRight size={16} />
                </Link>

              </div>

            </motion.div>
          ))}

        </div>

      </div>

    </section>
  );
}


/* =========================================
   MAIN BRAND EXPERIENCE
========================================= */

export default function BrandExperience({ brand, projects = [] }) {
  const images = projects.filter(
    (project) => project.media_url && !project.video_url
  );

  const videos = projects.filter(
    (project) => project.video_url
  );

  return (
    <main className="overflow-hidden bg-[#f4f1eb] text-[#22211f]">

      {/* INTERACTIVE LOGO */}
      <InteractiveBrandLogo brand={brand} />

      {/* AUTOMATIC IMAGE STRIP */}
      <ImageMarquee projects={images} />

      {/* REELS VIDEOS */}
      <VideoShowcase projects={videos} />

      {/* FOOTER */}
      <footer className="px-6 py-20 md:px-12 md:py-28">

        <div className="mx-auto flex max-w-[1500px] flex-col justify-between gap-8 border-t border-black/15 pt-8 md:flex-row md:items-end">

          <h2 className="text-4xl font-semibold tracking-[-0.06em] md:text-6xl">
            Made to make an impact.
          </h2>

          <span className="font-mono text-[9px] tracking-[0.25em] text-black/40">
            KOHeDROO
          </span>

        </div>
      </footer>

      {/* BACK TO HOME - BOTTOM OF PAGE */}
      <div className="flex justify-center px-6 pb-12 md:pb-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-3 rounded-full border border-black/15 px-7 py-3.5 text-[10px] font-medium uppercase tracking-[0.2em] text-black/60 transition-all duration-300 hover:border-black hover:bg-black hover:text-white"
        >
          <ArrowLeft
            size={14}
            className="transition-transform duration-300 group-hover:-translate-x-1"
          />
          <span>Back to Home</span>
        </Link>
      </div>

    </main>
  );
}
