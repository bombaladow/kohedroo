'use client';

import { Play } from 'lucide-react';

export default function Hero({ settings }) {
  const stats = [
    [settings?.stat1_value, settings?.stat1_label],
    [settings?.stat2_value, settings?.stat2_label],
    [settings?.stat3_value, settings?.stat3_label]
  ].filter(([v]) => v);

  return (
    <section className="pt-32 pb-16 px-6 md:px-12 min-h-screen flex flex-col justify-between">
      {/* كارت الفيديو الرئيسي - تم تحويل الحدود للأسود الخفيف مع عدم وجود خلفية سوداء صريحة مغطية */}
      <div className="relative w-full h-[55vh] md:h-[65vh] bg-transparent rounded-2xl overflow-hidden group border border-black/15 shadow-sm cursor-pointer">
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all flex items-center justify-center z-10 backdrop-blur-[2px]">
          <div className="flex items-center gap-3 bg-black text-white font-mono text-xs uppercase px-6 py-3.5 rounded-full font-semibold tracking-wider group-hover:scale-105 transition-transform shadow-lg">
            <Play size={14} fill="white" /> Play Showreel
          </div>
        </div>

        <img
          src={settings?.showreel_thumbnail}
          alt="Showreel Thumbnail"
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
      </div>

      {/* الجزء السفلي من الـ Hero - تم تعديل النصوص والحدود لتكون سوداء وواضحة */}
      <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-black/10 pt-8">
        <div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter text-black">
            {settings?.hero_title}
          </h1>
          <p className="text-zinc-700 text-lg md:text-xl font-normal mt-2">
            {settings?.hero_subtitle}
          </p>
        </div>
        <div className="font-mono text-xs text-zinc-600 font-semibold uppercase tracking-widest leading-relaxed">
          {settings?.hero_tagline?.split('•').map((part, i, arr) => (
            <span key={i}>
              {part.trim()}{i < arr.length - 1 ? ' • ' : ''}
            </span>
          ))}
          <br />
          Available for Freelance & Remote Work
        </div>
      </div>

      {/* الـ Stats - نصوص داكنة وحدود شفافة أنيقة */}
      {stats.length > 0 && (
        <div className="flex gap-10 md:gap-16 flex-wrap mt-10 border-t border-black/10 pt-8">
          {stats.map(([value, label], i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tighter text-black">{value}</div>
              <div className="text-zinc-600 text-xs font-mono uppercase tracking-widest font-semibold mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}