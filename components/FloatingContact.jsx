'use client';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export default function FloatingContact({ settings }) {
  const cleanPhoneNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '971555780408';
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: [0, -6, 6, -6, 6, 0],
        transition: { scale: { delay: 1, type: 'spring' }, rotate: { delay: 3, duration: 0.5, repeat: Infinity, repeatDelay: 4 } } 
      }}
      whileHover={{ scale: 1.15, rotate: 0 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-50 bg-emerald-500 text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
      aria-label="Contact on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-40"></span>
      <MessageCircle size={30} className="relative z-10" />
      <span className="absolute right-full mr-4 bg-black text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-sans">
        Contact me now
      </span>
    </motion.a>
  );
}