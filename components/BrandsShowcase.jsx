'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, MoveRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

export default function BrandsShowcase() {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      const { data } = await supabase.from('brands').select('*').order('sort_order', { ascending: true });
      if (data) setBrands(data);
    };
    fetchBrands();
  }, []);

  if (brands.length === 0) return null;

  return (
    <section id="brands" className="py-20 md:py-32 bg-zinc-50 relative z-10 border-t border-black/5 overflow-hidden">
      
      <div className="px-6 md:px-12 max-w-7xl mx-auto mb-10 md:mb-16 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest font-bold block mb-2 md:mb-3">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
            Brands I&apos;ve Worked With
          </h2>
        </div>
        <span className="md:hidden text-[10px] font-mono uppercase tracking-widest text-zinc-400 animate-pulse flex items-center justify-center gap-2">
          Swipe to explore <MoveRight size={14} />
        </span>
      </div>

      {/* 📱 موبايل: Swipe أفقي */}
      <div 
        data-lenis-prevent
        className="md:hidden flex overflow-x-auto snap-x-mandatory no-scrollbar gap-4 px-6 pb-8"
      >
        {brands.map((brand, index) => (
          <Link 
            key={brand.id}
            href={`/brand/${brand.id}`}
            className="snap-center flex-shrink-0 w-[85vw] relative rounded-[2rem] overflow-hidden bg-zinc-900 shadow-xl group"
          >
            {brand.cover_url ? (
              <img src={brand.cover_url} alt={brand.name} className="absolute inset-0 w-full h-full object-cover opacity-60" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black" />
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

            <div className="relative z-10 h-[70vh] flex flex-col justify-between p-8">
              <div className="w-24 h-16 flex items-center justify-start">
                <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-2">{brand.name}</h3>
                <p className="text-white/60 text-sm line-clamp-2 mb-6">{brand.description || 'A complete visual identity and commercial campaign.'}</p>
                <div className="inline-flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider">
                  Go to Work <ArrowRight size={14} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 💻 ديسكتوب: 4 كروت في الصف */}
      <div className="hidden md:grid grid-cols-4 gap-6 px-12 max-w-[1600px] mx-auto">
        {brands.map((brand, index) => (
          <motion.div
            key={brand.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
          >
            <Link 
              href={`/brand/${brand.id}`}
              className="group relative block aspect-[3/4] rounded-[2rem] overflow-hidden bg-zinc-900 border border-black/5 hover:border-black/20 shadow-sm hover:shadow-2xl transition-all duration-500"
            >
              {brand.cover_url ? (
                <img src={brand.cover_url} alt={brand.name} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700" />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black group-hover:scale-105 transition-transform duration-700" />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-90" />

              <div className="relative z-10 h-full flex flex-col justify-between p-6">
                <div className="w-20 h-12 flex items-center justify-start">
                  <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain drop-shadow-lg" />
                </div>
                
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{brand.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-white/60 text-xs font-mono uppercase tracking-widest">Case Study</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors duration-300">
                      <ArrowRight size={14} className="group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}