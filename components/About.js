'use client';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function About({ settings }) {
  const skillsString = settings?.about_skills || 'Art Direction, AI Commercial Videos, Brand Identity, Visual Storytelling, Social Media Campaigns, Motion Graphics';
  const skills = skillsString.split(',').map(s => s.trim());

  return (
    <section id="about" className="py-20 md:py-28 px-6 md:px-12 bg-white relative z-10 border-t border-black/5">
      <div className="max-w-6xl mx-auto">
        {/* استخدمنا 12 عمود عشان نظبط النسب (5 للصورة و 7 للكلام) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
          
          {/* الجزء الشمال: الصورة (5 أعمدة) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative md:col-span-5 flex justify-center"
          >
            {/* الإطار الخلفي */}
            <div className="absolute inset-0 border-2 border-black translate-x-3 translate-y-3 md:translate-x-4 md:translate-y-4 rounded-3xl -z-10 max-w-xs md:max-w-sm mx-auto" />
            
            {/* حاوية الصورة مع تحديد أقصى عرض */}
            <div className="relative aspect-[4/5] w-full max-w-xs md:max-w-sm rounded-3xl overflow-hidden bg-zinc-100 shadow-lg">
              <Image
                src={settings?.about_image || '/about-image.jpg'}
                alt="Kohedroo - Art Director"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>

          {/* الجزء اليمين: الكلام (7 أعمدة) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="md:col-span-7"
          >
            <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold mb-4">
              Behind the Pixels
            </h2>
            <h3 className="text-3xl md:text-5xl font-extrabold tracking-tighter mb-6 leading-tight">
              {settings?.about_title || "Crafting visual stories that resonate."}
            </h3>
            
            <p className="text-zinc-600 text-base md:text-lg leading-relaxed mb-8">
              {settings?.about_bio || "I am an Art Director and AI Creative Lead with over 13 years of experience. I specialize in turning complex ideas into premium visual experiences, blending traditional design with cutting-edge AI technology to deliver high-end commercial branding across Dubai and Egypt."}
            </p>

            {/* المهارات */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-10">
              {skills.map((skill, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 size={16} className="text-black flex-shrink-0" />
                  <span className="text-sm font-semibold text-zinc-800">{skill}</span>
                </motion.div>
              ))}
            </div>

            {/* الإحصائيات */}
            <div className="flex gap-10 border-t border-black/10 pt-8 mb-8">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold">{settings?.stat_years || '13+'}</p>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Years Exp.</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold">{settings?.stat_projects || '100+'}</p>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Projects Done</p>
              </div>
            </div>

            <Link 
              href="/book-now"
              className="inline-flex items-center gap-3 bg-black text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all group"
            >
              Start a Project
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}