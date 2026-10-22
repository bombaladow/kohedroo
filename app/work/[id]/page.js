'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useLoading } from '@/lib/LoadingContext'; // ضفنا ده
import { motion } from 'framer-motion';
import { ArrowLeft, MessageCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import MagneticButton from '@/components/MagneticButton';

export default function ProjectDetails() {
  const { id } = useParams();
  const router = useRouter();
  const { setIsDataLoaded } = useLoading(); // بنستخدم الـ Context
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  
  useEffect(() => {
    const fetchProject = async () => {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error || !data) {
        setIsDataLoaded(true);
        router.push('/');
        return;
      }
      setProject(data);

      const { data: related } = await supabase
        .from('projects')
        .select('*')
        .eq('category', data.category)
        .neq('id', id)
        .limit(2);
      
      setRelatedProjects(related || []);
      setIsDataLoaded(true); // نقول للـ Preloader إن الداتا جاهزة
    };
    fetchProject();
  }, [id, router, setIsDataLoaded]);

  if (!project) return null; // مش محتاجين Loading هنا عشان الـ Preloader مغطي

  // ... (باقي الكود زي ما هو بالظبط من هنا لتحت)
  const cleanPhoneNumber = '971555780408'; 
  const whatsappMessage = encodeURIComponent(`Hello Kohedroo, I saw the "${project.title}" project in your portfolio and loved it. I'd like a similar design.`);
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${whatsappMessage}`;

  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/kohedroo/', icon: '/socials/instagram.png' },
    { name: 'LinkedIn', href: 'https://ae.linkedin.com/in/kohedroo', icon: '/socials/linkedin.png' },
    { name: 'Behance', href: 'https://www.behance.net/hoossoo88', icon: '/socials/behance.png' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="fixed top-24 left-6 md:left-12 z-40">
        <Link href="/" className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-black/10 px-4 py-2 rounded-full text-sm font-semibold hover:bg-black hover:text-white transition-all shadow-sm">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>

      <div className="pt-32 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="lg:col-span-8 flex flex-col gap-6">
            <div className="w-full rounded-3xl overflow-hidden border border-black/10 bg-zinc-100 shadow-sm">
              {project.video_url ? (
                <video src={project.video_url} controls autoPlay muted loop className="w-full h-auto object-cover" />
              ) : (
                <img src={project.media_url} alt={project.title} className="w-full h-auto object-cover" />
              )}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="lg:col-span-4 relative">
            <div className="sticky top-32">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-mono uppercase tracking-widest font-bold border border-black/20 px-3 py-1 rounded-full bg-zinc-50">
                  {project.category || 'Project'}
                </span>
                <span className="text-xs font-mono uppercase tracking-widest font-bold text-zinc-500">{project.year}</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter mb-6 leading-tight">{project.title}</h1>
              
              <p className="text-zinc-600 text-lg leading-relaxed mb-10 whitespace-pre-wrap">
                {project.description || "No description provided for this project."}
              </p>

              <div className="w-full h-[1px] bg-black/10 mb-10"></div>

              <MagneticButton className="w-full">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-3 bg-black text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-zinc-800 transition-all shadow-xl hover:shadow-2xl">
                  <MessageCircle size={22} /> Request Similar Design
                </a>
              </MagneticButton>
              
              <p className="text-center text-xs text-zinc-400 mt-4 font-mono mb-8">* We will contact you shortly.</p>

              <div className="flex flex-col items-center border-t border-black/5 pt-8">
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest mb-5">Or Follow My Work</span>
                <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} className="flex items-center justify-center gap-6">
                  {socials.map((social) => (
                    <motion.a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.name} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }} className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                      <Image src={social.icon} alt={social.name} width={28} height={28} className="w-7 h-7 object-contain" />
                    </motion.a>
                  ))}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {relatedProjects.length > 0 && (
          <div className="mt-32 border-t border-black/10 pt-16">
            <h2 className="text-2xl font-bold tracking-tighter mb-8 flex items-center gap-3">Related Projects <ArrowRight size={20} /></h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProjects.map((rp) => (
                <Link key={rp.id} href={`/work/${rp.id}`} className="group block">
                  <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-100 mb-4 border border-black/5">
                    <img src={rp.media_url} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <h3 className="text-xl font-bold group-hover:text-zinc-600 transition-colors">{rp.title}</h3>
                  <p className="text-sm text-zinc-500 font-mono mt-1">{rp.category}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}