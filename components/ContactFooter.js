'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, MapPin, ArrowUpRight, ArrowUp } from 'lucide-react';
import { useLenis } from 'lenis/react';

export default function ContactFooter({ settings }) {
  const cleanPhoneNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '971555780408';
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;
  const emailAddress = settings?.email || 'hello@kohedroo.com';
  
  const lenis = useLenis(); // عشان نستخدمه في زرار الـ Scroll to top

  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/kohedroo/', icon: '/socials/instagram.png' },
    { name: 'LinkedIn', href: 'https://ae.linkedin.com/in/kohedroo', icon: '/socials/linkedin.png' },
    { name: 'Behance', href: 'https://www.behance.net/hoossoo88', icon: '/socials/behance.png' },
  ];

  const quickLinks = [
    { name: 'Work', href: '#work' },
    { name: 'Book Now', href: '/book-now' },
    { name: 'All Projects', href: '/work' },
  ];

  const scrollToTop = () => {
    lenis?.scrollTo(0, { duration: 1.5 });
  };

  return (
    <footer
      id="contact"
      className="pt-20 md:pt-32 pb-10 px-6 md:px-12 border-t border-black/10 bg-white relative z-10 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* ================= 1. الجزء العلوي: CTA عملاق ================= */}
        <div className="flex flex-col items-start md:items-center md:text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono uppercase tracking-widest font-bold text-zinc-500">
              Available for freelance work
            </span>
          </motion.div>

          {/* عنوان ضخم جداً (Giant Typography) */}
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] font-black tracking-tighter leading-[0.85] text-black mb-10 md:mb-16"
          >
            Let&apos;s <br className="md:hidden" /> Talk.
          </motion.h2>

          {/* زرار الواتساب الكبير */}
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative inline-flex items-center justify-center gap-3 bg-black text-white font-mono text-sm md:text-base uppercase px-8 md:px-12 py-4 md:py-6 rounded-full font-bold tracking-widest overflow-hidden"
          >
            <span className="absolute inset-0 bg-emerald-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out" />
            <MessageSquare size={20} className="relative z-10" />
            <span className="relative z-10">Start a Project</span>
          </motion.a>
        </div>

        {/* ================= 2. الشريط المتحرك (Infinite Marquee) ================= */}
        <div className="w-full overflow-hidden border-y border-black/10 py-4 md:py-6 mb-16 md:mb-24 flex whitespace-nowrap">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 15, repeat: Infinity }}
            className="flex items-center gap-8 md:gap-16 text-xs md:text-sm font-mono uppercase tracking-widest text-zinc-400"
          >
            {/* بنكرر النص مرتين عشان الحركة تبقى لا نهائية */}
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 md:gap-16">
                <span>Art Direction</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                <span>AI Video Production</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                <span>Brand Identity</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
                <span>Based in Dubai & Egypt</span>
                <span className="w-1.5 h-1.5 rounded-full bg-black/20" />
              </div>
            ))}
          </motion.div>
        </div>

        {/* ================= 3. شبكة المعلومات (Asymmetric Grid) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16 md:mb-24">
          
          {/* العمود الأول: اللوجو والوصف (بياخد 5 أعمدة) */}
          <div className="md:col-span-5 flex flex-col items-start">
            <Link href="/" className="relative w-36 h-12 block mb-6">
              <Image
                src="/KOHEDROO.png"
                alt="Kohedroo Logo"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="text-zinc-500 text-sm md:text-base leading-relaxed max-w-sm mb-8">
              Crafting premium visual experiences, brand identities, and AI-driven commercial content for forward-thinking brands.
            </p>
            
            {/* أيقونات السوشيال ميديا بشكل تفاعلي */}
            <div className="flex items-center gap-4">
              {socials.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.name}
                  whileHover={{ scale: 1.1, y: -3 }}
                  className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-black transition-colors group"
                >
                  <Image 
                    src={social.icon} 
                    alt={social.name} 
                    width={16} 
                    height={16} 
                    className="w-4 h-4 object-contain grayscale group-hover:invert transition-all" 
                  />
                </motion.a>
              ))}
            </div>
          </div>

          {/* مسافة فاضية في النص (عشان التقسيم الفني) */}
          <div className="hidden md:block md:col-span-2"></div>

          {/* العمود الثاني: لينكات سريعة (بياخد 2 أعمدة) */}
          <div className="md:col-span-2 flex flex-col items-start gap-4">
            <h4 className="text-black font-bold uppercase tracking-widest text-xs mb-2">Sitemap</h4>
            {quickLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="group flex items-center gap-2 text-zinc-600 hover:text-black transition-colors"
              >
                <span className="text-sm font-medium">{link.name}</span>
                <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </div>

          {/* العمود الثالث: التواصل (بياخد 3 أعمدة) */}
          <div className="md:col-span-3 flex flex-col items-start gap-4">
            <h4 className="text-black font-bold uppercase tracking-widest text-xs mb-2">Contact</h4>
            
            <a href={`mailto:${emailAddress}`} className="group flex items-center gap-3 text-zinc-600 hover:text-black transition-colors">
              <Mail size={16} className="text-zinc-400 group-hover:text-black transition-colors" />
              <span className="text-sm font-medium">{emailAddress}</span>
            </a>

            <div className="flex items-center gap-3 text-zinc-600">
              <MapPin size={16} className="text-zinc-400" />
              <span className="text-sm font-medium">Dubai, UAE & Cairo, EG</span>
            </div>
            
            <div className="mt-4 flex flex-col gap-1 text-sm text-zinc-500">
              <span className="font-mono text-xs uppercase tracking-widest">Local Time</span>
              <span className="font-mono text-black font-semibold">{new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' })} GST</span>
            </div>
          </div>
        </div>

        {/* ================= 4. الحقوق وزرار العودة للأعلى ================= */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-black/10">
          <p className="font-mono text-[10px] md:text-xs text-zinc-400 uppercase tracking-widest text-center md:text-left">
            © {new Date().getFullYear()} Kohedroo. All rights reserved.
          </p>
          
          <button 
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-xs font-mono font-bold text-zinc-500 hover:text-black transition-colors uppercase tracking-widest"
          >
            Back to top
            <div className="w-8 h-8 rounded-full border border-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
              <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
            </div>
          </button>
        </div>

      </div>
    </footer>
  );
}