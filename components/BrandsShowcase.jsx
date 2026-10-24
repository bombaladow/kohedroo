'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
    <section id="brands" className="py-20 md:py-32 px-6 md:px-12 bg-zinc-50 relative z-10 border-t border-black/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 md:mb-20 text-center">
          <span className="text-xs font-mono uppercase text-zinc-400 tracking-widest font-bold block mb-3">
            Case Studies
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
            Brands I&apos;ve Worked With
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (index % 2) * 0.1 }}
            >
              <Link 
                href={`/brand/${brand.id}`}
                className="group relative flex flex-col md:flex-row items-center bg-white rounded-[2rem] p-6 md:p-8 border border-black/5 hover:border-black/20 hover:shadow-2xl transition-all duration-500 overflow-hidden h-full"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-zinc-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 w-full md:w-[45%] aspect-[4/3] bg-zinc-50 rounded-2xl flex items-center justify-center p-6 mb-6 md:mb-0 md:mr-8 group-hover:scale-105 transition-transform duration-500 border border-black/5">
                  <img 
                    src={brand.logo_url} 
                    alt={brand.name} 
                    className="max-h-full max-w-full object-contain grayscale group-hover:grayscale-0 transition-all duration-500" 
                  />
                </div>

                <div className="relative z-10 flex-1 text-center md:text-left flex flex-col justify-center">
                  <h3 className="text-2xl font-bold tracking-tight mb-2 group-hover:text-black transition-colors">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-zinc-500 leading-relaxed mb-6 line-clamp-3">
                    {brand.description || `A complete visual identity and commercial campaign crafted for ${brand.name}.`}
                  </p>
                  
                  <div className="mt-auto inline-flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-black uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                    <span>View Work</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}