'use client';

import { Play } from 'lucide-react';

export default function Hero({ settings }) {
  const stats = [
    [settings.stat1_value, settings.stat1_label],
    [settings.stat2_value, settings.stat2_label],
    [settings.stat3_value, settings.stat3_label]
  ].filter(([v]) => v);

  return (
    <section className="pt-32 pb-16 px-6 md:px-12 min-h-screen flex flex-col justify-between">
      <div className="relative w-full h-[55vh] md:h-[65vh] bg-zinc-900 rounded-xl overflow-hidden group border border-zinc-800 cursor-pointer">
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all flex items-center justify-center z-10">
          <div className="flex items-center gap-3 bg-white text-black font-mono text-xs uppercase px-5 py-3 rounded-full font-semibold tracking-wider group-hover:scale-105 transition-transform">
            <Play size={14} fill="black" /> Play Showreel
          </div>
        </div>

        <img
          src={settings.showreel_thumbnail}
          alt="Showreel Thumbnail"
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
        />
      </div>

      <div className="mt-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-t border-zinc-900 pt-8">
        <div>
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tighter">
            {settings.hero_title}
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl font-light mt-2">
            {settings.hero_subtitle}
          </p>
        </div>
        <div className="font-mono text-xs text-zinc-500 uppercase tracking-widest leading-relaxed">
          {settings.hero_tagline?.split('•').map((part, i, arr) => (
            <span key={i}>
              {part.trim()}{i < arr.length - 1 ? ' • ' : ''}
            </span>
          ))}
          <br />
          Available for Freelance & Remote Work
        </div>
      </div>

      {stats.length > 0 && (
        <div className="flex gap-10 md:gap-16 flex-wrap mt-10 border-t border-zinc-900 pt-8">
          {stats.map(([value, label], i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-extrabold tracking-tighter">{value}</div>
              <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
