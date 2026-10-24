'use client';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function About({ settings }) {
  const skillsString = settings?.about_skills || 'Art Direction, AI Commercial Videos, Brand Identity, Visual Storytelling, Social Media Campaigns';
  const skills = skillsString.split(',').map(s => s.trim());

  return (
    <section id="about" className="relative z-10 bg-zinc-50 pt-16 pb-20 md:py-28">
      
      {/* 📱 موبايل */}
      <div className="md:hidden px-4">
        <div className="text-center mb-8">
          <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold mb-2">Behind the Pixels</h2>
          <h3 className="text-3xl font-extrabold tracking-tighter">
            {settings?.about_title || "Crafting visual stories."}
          </h3>
        </div>

        <div className="relative w-full aspect-[4/5] rounded-[2rem] overflow-hidden bg-zinc-200 mb-6 shadow-xl">
          <Image
            src={settings?.about_image || '/about-image.jpg'}
            alt="Kohedroo"
            fill
            className="object-cover"
          />
        </div>

        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-black/5 -mt-12 relative z-10 mx-2">
          <p className="text-zinc-600 text-sm leading-relaxed mb-6">
            {settings?.about_bio || "I am an Art Director and AI Creative Lead with over 13 years of experience..."}
          </p>

          <div className="flex justify-between border-t border-black/10 pt-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-extrabold">{settings?.stat_years || '13+'}</p>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">Years Exp.</p>
            </div>
            <div className="w-[1px] bg-black/10" />
            <div className="text-center">
              <p className="text-3xl font-extrabold">{settings?.stat_projects || '100+'}</p>
              <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mt-1">Projects</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 mb-8">
            {skills.slice(0, 4).map((skill, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle2 size={16} className="text-black flex-shrink-0" />
                <span className="text-sm font-semibold text-zinc-800">{skill}</span>
              </div>
            ))}
          </div>

          <Link 
            href="/book-now"
            className="w-full flex items-center justify-center gap-2 bg-black text-white px-6 py-4 rounded-xl font-bold text-sm active:scale-95 transition-all"
          >
            Start a Project <ArrowRight size={18} />
          </Link>
        </div>
      </div>


      {/* 💻 ديسكتوب */}
      <div className="hidden md:block max-w-6xl mx-auto px-12">
        <div className="grid grid-cols-12 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative col-span-5 flex justify-center"
          >
            <div className="absolute inset-0 border-2 border-black translate-x-4 translate-y-4 rounded-3xl -z-10 max-w-sm mx-auto" />
            <div className="relative aspect-[4/5] w-full max-w-sm rounded-3xl overflow-hidden bg-zinc-100 shadow-lg">
              <Image
                src={settings?.about_image || '/about-image.jpg'}
                alt="Kohedroo - Art Director"
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="col-span-7"
          >
            <h2 className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold mb-4">Behind the Pixels</h2>
            <h3 className="text-5xl font-extrabold tracking-tighter mb-6 leading-tight">
              {settings?.about_title || "Crafting visual stories that resonate."}
            </h3>
            
            <p className="text-zinc-600 text-lg leading-relaxed mb-8">
              {settings?.about_bio || "I am an Art Director and AI Creative Lead with over 13 years of experience..."}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-10">
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

            <div className="flex gap-10 border-t border-black/10 pt-8 mb-8">
              <div>
                <p className="text-4xl font-extrabold">{settings?.stat_years || '13+'}</p>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Years Exp.</p>
              </div>
              <div>
                <p className="text-4xl font-extrabold">{settings?.stat_projects || '100+'}</p>
                <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider mt-1">Projects Done</p>
              </div>
            </div>

            <Link 
              href="/book-now"
              className="inline-flex items-center gap-3 bg-black text-white px-7 py-3.5 rounded-full font-bold text-sm hover:bg-zinc-800 transition-all group"
            >
              Start a Project <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>
    </section>
  );
}