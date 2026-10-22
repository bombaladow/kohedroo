'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, Mail, MapPin, ArrowUpRight } from 'lucide-react';

export default function ContactFooter({ settings }) {
  const cleanPhoneNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '971555780408';
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;
  const emailAddress = settings?.email || 'hello@kohedroo.com';

  const headingWords = "Let's work together.".split(' ');

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

  return (
    <footer
      id="contact"
      className="pt-16 md:pt-32 pb-10 px-6 md:px-12 border-t border-black/10 bg-transparent relative z-10"
    >
      <div className="max-w-6xl mx-auto">
        
        <div className="flex flex-col items-center text-center mb-16 md:mb-24">
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold block mb-3">
            Have a project in mind?
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-black mb-8 flex flex-wrap justify-center gap-x-2 md:gap-x-3">
            {headingWords.map((word, i) => (
              <span key={i} className="overflow-hidden inline-block pb-2">
                <motion.span
                  initial={{ y: "100%", opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            ))}
          </h2>

          <div className="my-4 relative">
            <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 blur-xl animate-pulse" />
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-mono text-xs sm:text-sm uppercase px-8 py-4 rounded-full font-bold tracking-wider hover:bg-emerald-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
            >
              <MessageSquare size={18} />
              <span>Chat on WhatsApp</span>
            </a>
          </div>
        </div>

        {/* شبكة المعلومات */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8 border-t border-black/10 pt-12 md:pt-16 mb-12 md:mb-16 text-center md:text-left">
          
          <div className="flex flex-col items-center md:items-start gap-6">
            <Link href="/" className="relative w-32 h-10 block">
              <Image src="/KOHEDROO.png" alt="Kohedroo Logo" fill className="object-contain" />
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Art Director & AI Creative Lead based in UAE & Egypt. Crafting premium visual experiences.
            </p>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-700 text-xs font-semibold tracking-wide uppercase">Available for work</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start">
            <h4 className="text-black font-bold uppercase tracking-widest text-sm mb-2">Quick Links</h4>
            {quickLinks.map((link) => (
              <Link key={link.name} href={link.href} className="group flex items-center gap-2 text-zinc-500 hover:text-black transition-colors">
                <span className="text-sm">{link.name}</span>
                <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all hidden md:block" />
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 items-center md:items-start">
            <h4 className="text-black font-bold uppercase tracking-widest text-sm mb-2">Get in Touch</h4>
            <a href={`mailto:${emailAddress}`} className="group flex items-center gap-3 text-zinc-500 hover:text-black transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <Mail size={14} />
              </div>
              <span className="text-sm">{emailAddress}</span>
            </a>
            <div className="flex items-center gap-3 text-zinc-500">
              <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center">
                <MapPin size={14} />
              </div>
              <span className="text-sm">Dubai, UAE & Cairo, EG</span>
            </div>

            <div className="flex items-center gap-4 mt-2 md:mt-4">
              {socials.map((social) => (
                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                  <Image src={social.icon} alt={social.name} width={24} height={24} className="w-6 h-6 object-contain" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-t border-black/10 pt-8 text-xs font-mono text-zinc-400">
          <p>© {new Date().getFullYear()} Kohedroo. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <span className="text-red-500 animate-pulse">♥</span> in Dubai
          </p>
        </div>

      </div>
    </footer>
  );
}