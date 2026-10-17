'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';

export default function ContactFooter({ settings }) {
  const cleanPhoneNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '971555780408';
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;

  const headingWords = "Let's work together.".split(' ');

  const socials = [
    { name: 'Instagram', href: 'https://www.instagram.com/kohedroo/', icon: '/socials/instagram.png' },
    { name: 'LinkedIn', href: 'https://ae.linkedin.com/in/kohedroo', icon: '/socials/linkedin.png' },
    { name: 'Behance', href: 'https://www.behance.net/hoossoo88', icon: '/socials/behance.png' },
  ];

  return (
    <footer
      id="contact"
      className="py-20 md:py-24 px-6 md:px-12 border-t border-black/10 bg-transparent text-center relative z-10"
    >
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold block mb-3"
        >
          Have a project in mind?
        </motion.span>

        {/* العنوان الرئيسي — كلمة كلمة من ستارة */}
        <motion.h2
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
          className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black mb-8 flex flex-wrap justify-center gap-x-2 md:gap-x-3"
        >
          {headingWords.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block pb-2">
              <motion.span
                variants={{
                  hidden: { y: "100%", opacity: 0 },
                  visible: {
                    y: 0,
                    opacity: 1,
                    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
                  },
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h2>

        {/* زرار الواتساب مع Pulse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="my-6 relative"
        >
          <span className="absolute inset-0 rounded-full bg-emerald-500 opacity-30 blur-xl animate-pulse" />
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-mono text-xs sm:text-sm uppercase px-6 sm:px-8 py-3.5 sm:py-4 rounded-full font-bold tracking-wider hover:bg-emerald-700 active:scale-95 transition-all shadow-lg hover:shadow-xl"
          >
            <MessageSquare size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </motion.div>

        {/* أيقونات السوشيال */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } } }}
          className="flex items-center justify-center gap-8 md:gap-10 mt-10"
        >
          {socials.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              variants={{
                hidden: { opacity: 0, y: 15, scale: 0.8 },
                visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
              }}
              whileHover={{ scale: 1.15, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={social.icon}
                alt={social.name}
                width={32}
                height={32}
                className="w-7 h-7 md:w-8 md:h-8 object-contain"
              />
            </motion.a>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="font-mono text-[10px] md:text-xs text-zinc-400 mt-14 md:mt-16 pt-8 border-t border-black/10 w-full text-center"
        >
          © {new Date().getFullYear()} {settings?.hero_title || 'KOHEDROO'}. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
}