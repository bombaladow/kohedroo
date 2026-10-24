'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function BrandPage() {
  const { id } = useParams();
  const router = useRouter();
  const [brand, setBrand] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBrandData = async () => {
      const { data: brandData, error: brandError } = await supabase.from('brands').select('*').eq('id', id).single();
      if (brandError || !brandData) {
        router.push('/');
        return;
      }
      setBrand(brandData);

      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_id', id)
        .order('created_at', { ascending: false });
      
      setProjects(projectsData || []);
      setLoading(false);
    };
    fetchBrandData();
  }, [id, router]);

  if (loading || !brand) return <div className="min-h-screen flex items-center justify-center font-mono">Loading...</div>;

  return (
    <div className="min-h-screen bg-zinc-50">
      <div className="fixed top-6 left-6 md:top-12 md:left-12 z-50">
        <Link href="/" className="inline-flex items-center gap-2 bg-white border border-black/10 px-4 py-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all shadow-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="pt-32 pb-20 px-6 bg-white border-b border-black/5 text-center flex flex-col items-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-32 md:w-48 h-20 md:h-28 relative mb-8"
        >
          <Image src={brand.logo_url} alt={brand.name} fill className="object-contain" />
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4"
        >
          {brand.name}
        </motion.h1>
        
        {brand.description && (
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-600 max-w-2xl mx-auto text-lg mb-6"
          >
            {brand.description}
          </motion.p>
        )}

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-400 font-mono text-sm uppercase tracking-widest"
        >
          Selected Work — {projects.length} Projects
        </motion.p>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-20">
        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <Link href={`/work/${project.id}`} className="block">
                  <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-zinc-200 mb-6">
                    {project.video_url ? (
                      <video src={project.video_url} muted loop playsInline className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    ) : (
                      <img src={project.media_url} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        {project.video_url ? <Play size={24} className="text-white ml-1" fill="white" /> : <ArrowUpRight size={24} className="text-white" />}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold tracking-tight mb-1 group-hover:text-zinc-600 transition-colors">{project.title}</h3>
                      <p className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{project.category}</p>
                    </div>
                    <span className="text-sm font-mono text-zinc-400 border border-black/10 px-3 py-1 rounded-full">{project.year}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-zinc-500 font-mono">
            No projects uploaded for this brand yet.
          </div>
        )}
      </div>
    </div>
  );
}