'use client';

import Image from 'next/image';
import { ArrowDown, MessageSquare } from 'lucide-react';

export default function Hero({ settings }) {
  const stats = [
    ['13+', 'Years Experience'],
    ['100+', 'AI Commercial Videos'],
    ['UAE & EG', 'Key Markets']
  ];

  // 🔹 قائمة اللوجوهات الرئيسية
  const brands = [
    { name: 'Dubai Duty Free', logo: '/brands/dubai-duty-free.png' },
    { name: 'Joyalukkas', logo: '/brands/joyalukkas.png' },
    { name: 'Giordano', logo: '/brands/giordano.png' },
    { name: 'Rasasi Perfumes', logo: '/brands/rasasi.png' },
    { name: 'Al Ain Water', logo: '/brands/al-ain-water.png' },
    { name: 'OnPlan Group', logo: '/brands/onplan.png' },
    { name: 'nakai', logo: '/brands/nakai.png' },
  ];

  return (
    <section className="pt-32 pb-16 px-6 md:px-12 flex flex-col justify-between items-center text-center overflow-hidden">
      
      {/* 1. قسم اللوجو والبايو والأزرار */}
      <div className="max-w-4xl flex flex-col items-center">
        
        {/* اللوجو الرئيسي */}
        <div className="relative w-72 md:w-96 h-24 md:h-32 mb-6 flex items-center justify-center">
          <Image
            src="/KOHEDROO.png"
            alt={settings?.hero_title || 'KOHEDROO'}
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* النبذة المختصرة */}
        <p className="text-zinc-700 text-lg md:text-2xl font-normal leading-relaxed tracking-tight max-w-3xl mb-8">
          {settings?.hero_subtitle || 'Art Director & AI Creative Lead with 13+ years driving visual storytelling, AI production, and premium commercial branding across Dubai & Egypt.'}
        </p>

        {/* الأزرار */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a
            href="#work"
            className="group inline-flex items-center gap-3 bg-black text-white font-mono text-xs uppercase px-7 py-3.5 rounded-full font-semibold tracking-wider hover:bg-zinc-800 transition-all shadow-md"
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

      {/* 2. قسم اللوجوهات الموزونة واضحة الحجم */}
      <div className="w-full max-w-6xl border-t border-black/10 pt-10 mb-16">
        <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest block mb-10 font-semibold">
          Brands & Clients Worked With
        </span>
        
        {/* شبكة لوجوهات بحجم بارز ومريح للعين */}
        <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 py-2">
          {brands.map((brand, i) => (
            <div 
              key={i} 
              /* 🔹 تكبير الارتفاع والعرض ليكون متناسقاً جداً مع السكشن */
              className="relative h-14 md:h-20 w-40 md:w-56 flex items-center justify-center transition-transform duration-300 hover:scale-105"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 3. الإحصائيات والأرقام */}
      <div className="w-full max-w-4xl border-t border-black/10 pt-10 flex justify-center gap-12 md:gap-24 flex-wrap">
        {stats.map(([value, label], i) => (
          <div key={i} className="flex flex-col items-center">
            <span className="text-3xl md:text-5xl font-extrabold tracking-tighter text-black font-sans leading-none">
              {value}
            </span>
            <span className="text-zinc-500 text-xs font-mono uppercase tracking-widest font-semibold mt-2">
              {label}
            </span>
          </div>
        ))}
      </div>

    </section>
  );
}