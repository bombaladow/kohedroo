'use client';

import Image from 'next/image';
import { ArrowDown, MessageSquare } from 'lucide-react';

export default function Hero({ settings }) {
  const stats = [
    [settings?.stat1_value, settings?.stat1_label],
    [settings?.stat2_value, settings?.stat2_label],
    [settings?.stat3_value, settings?.stat3_label]
  ].filter(([v]) => v);

  return (
    <section className="pt-36 pb-16 px-6 md:px-12 flex flex-col justify-between items-center text-center min-h-[85vh]">
      
      {/* قسم التعريف الرئيسي */}
      <div className="max-w-4xl flex flex-col items-center">
        
        {/* صورة اللوجو الأساسية في منتصف الشاشة */}
        <div className="relative w-64 md:w-96 h-20 md:h-28 mb-6 flex items-center justify-center">
          <Image
            src="/KOHEDROO.png"
            alt={settings?.hero_title || 'KOHEDROO'}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* نبذة عن الخبرة والمهارات */}
        <p className="text-zinc-700 text-lg md:text-2xl font-normal leading-relaxed tracking-tight max-w-2xl mb-8">
          {settings?.hero_subtitle || 'Visual Designer & Motion Specialist crafting high-impact video content, brand identities, and motion graphics for brands & creators worldwide.'}
        </p>

        {/* أزرار اتخاذ الإجراء (Call to Actions) */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <a
            href="#work"
            className="group inline-flex items-center gap-3 bg-black text-white font-mono text-xs uppercase px-7 py-3.5 rounded-full font-semibold tracking-wider hover:bg-zinc-800 transition-all shadow-md hover:shadow-xl hover:scale-[1.02]"
          >
            <span>Explore Projects</span>
            <ArrowDown size={15} className="group-hover:translate-y-1 transition-transform" />
          </a>

          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-black/15 text-black font-mono text-xs uppercase px-7 py-3.5 rounded-full font-semibold tracking-wider hover:bg-white hover:border-black/40 transition-all shadow-sm"
          >
            <MessageSquare size={15} />
            <span>Let&apos;s Talk</span>
          </a>
        </div>
      </div>

      {/* الشريط السفلي: التخصصات والإحصائيات */}
      <div className="mt-16 w-full max-w-5xl border-t border-black/10 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8">
        
        {/* التخصصات ومجالات العمل */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest block mb-2 font-bold">
            Core Expertise
          </span>
          <div className="font-mono text-xs md:text-sm text-black font-bold uppercase tracking-wider leading-relaxed">
            {settings?.hero_tagline?.split('•').map((part, i, arr) => (
              <span key={i}>
                {part.trim()}{i < arr.length - 1 ? ' • ' : ''}
              </span>
            )) || 'Motion Graphics • Video Editing • Branding'}
          </div>
        </div>

        {/* الإحصائيات (Stats) */}
        {stats.length > 0 && (
          <div className="flex justify-center gap-10 md:gap-16 flex-wrap">
            {stats.map(([value, label], i) => (
              <div key={i} className="flex flex-col items-center md:items-start">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tighter text-black font-sans leading-none">
                  {value}
                </span>
                <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest font-semibold mt-2">
                  {label}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}