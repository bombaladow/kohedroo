'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageCircle, Mail, ArrowUpRight, ArrowUp, MapPin } from 'lucide-react';
import { useLenis } from 'lenis/react';

export default function ContactFooter({ settings }) {
  const cleanPhoneNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '971555780408';
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;
  const emailAddress = settings?.email || 'hello@kohedroo.com';
  
  const lenis = useLenis();

  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/kohedroo/', icon: '/socials/instagram.png' },
    { name: 'LinkedIn', href: 'https://ae.linkedin.com/in/kohedroo', icon: '/socials/linkedin.png' },
    { name: 'Behance', href: 'https://www.behance.net/hoossoo88', icon: '/socials/behance.png' },
  ];

  const links = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Book Now', href: '/book-now' },
    { name: 'All Projects', href: '/work' },
  ];

  const scrollToTop = () => {
    lenis?.scrollTo(0, { duration: 1.5 });
  };

  // إعدادات الأنيميشن للأيقونات
  const socialContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      }
    }
  };

  const socialItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.8 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  };

  return (
    <footer
      id="contact"
      className="relative bg-[#0a0a0a] text-white pt-16 md:pt-24 mt-12 md:mt-20 rounded-t-[2rem] md:rounded-t-[3.5rem] overflow-hidden z-20"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* === 1. Status Badge === */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-8 md:mb-12"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] md:text-xs uppercase tracking-[0.25em] text-white/60 font-mono font-semibold">
            Available for new projects
          </span>
        </motion.div>

        {/* === 2. HUGE Headline === */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-[2.6rem] sm:text-[4rem] md:text-[7rem] lg:text-[8.5rem] font-black tracking-tighter leading-[0.9] mb-10 md:mb-16"
        >
          Have a vision?
          <br />
          <span className="text-white/30">Let&apos;s build it.</span>
        </motion.h2>

        {/* === 3. Contact Cards === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-12 md:mb-20">
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="group flex items-center justify-between p-5 md:p-6 rounded-2xl border border-white/15 hover:bg-white hover:text-black transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                <MessageCircle size={20} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 group-hover:text-black/50 font-mono mb-0.5">WhatsApp</p>
                <p className="text-sm md:text-base font-bold">Message me directly</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-300" />
          </motion.a>

          <motion.a
            href={`mailto:${emailAddress}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="group flex items-center justify-between p-5 md:p-6 rounded-2xl border border-white/15 hover:bg-white hover:text-black transition-all duration-300 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 group-hover:bg-black/10 flex items-center justify-center transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] md:text-xs uppercase tracking-widest text-white/50 group-hover:text-black/50 font-mono mb-0.5">Email</p>
                <p className="text-sm md:text-base font-bold truncate max-w-[180px] md:max-w-none">{emailAddress}</p>
              </div>
            </div>
            <ArrowUpRight size={20} className="group-hover:rotate-45 transition-transform duration-300 flex-shrink-0" />
          </motion.a>
        </div>

        {/* === 4. Links & Socials === */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-12 pb-10 md:pb-16 border-b border-white/10">
          
          <nav className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group flex items-center justify-between md:justify-start gap-3 py-3 md:py-0 border-b border-white/5 md:border-none text-base md:text-lg font-semibold text-white/70 hover:text-white transition-colors"
              >
                <span>{link.name}</span>
                <ArrowUpRight size={16} className="md:opacity-0 md:-translate-x-2 md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all" />
              </Link>
            ))}
          </nav>

          {/* 🔥 أيقونات السوشيال ميديا الجديدة 🔥 */}
          <motion.div 
            variants={socialContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex items-center gap-3 md:gap-4"
          >
            {socials.map((social) => (
              <motion.a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.name}
                variants={socialItemVariants}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group overflow-hidden transition-colors hover:bg-white/10"
              >
                {/* تأثير لمعان خلفي عند الهوفر */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <Image
                  src={social.icon}
                  alt={social.name}
                  width={22}
                  height={22}
                  className="w-5 h-5 md:w-6 md:h-6 object-contain invert group-hover:invert-0 transition-all duration-300 relative z-10"
                />
              </motion.a>
            ))}
          </motion.div>
        </div>

        {/* === 5. Location + Time Bar === */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4 py-6 md:py-8 border-b border-white/10 text-[10px] md:text-xs font-mono uppercase tracking-[0.2em] text-white/40">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span>Dubai, UAE — Cairo, EG</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Local Time: {new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit' })} GST</span>
          </div>
        </div>
      </div>

      {/* === 6. Giant Watermark === */}
      <div className="relative w-full overflow-hidden select-none -mb-4 md:-mb-8">
        <motion.h1
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="text-center font-black tracking-tighter leading-[0.8] text-white/[0.07] whitespace-nowrap px-2"
          style={{ fontSize: 'clamp(4rem, 22vw, 22rem)' }}
        >
          KOHEDROO
        </motion.h1>
      </div>

      {/* === 7. Bottom Bar === */}
      <div className="relative border-t border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-5 md:py-6 flex items-center justify-between gap-4">
          <p className="text-[9px] md:text-xs font-mono text-white/40 uppercase tracking-widest">
            © {new Date().getFullYear()} Kohedroo — All Rights Reserved
          </p>
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 text-[10px] md:text-xs font-mono text-white/60 hover:text-white uppercase tracking-widest transition-colors"
          >
            <span className="hidden md:inline">Back to Top</span>
            <div className="w-9 h-9 rounded-full border border-white/20 group-hover:bg-white group-hover:text-black flex items-center justify-center transition-all duration-300">
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}