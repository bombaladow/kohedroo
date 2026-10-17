'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { mobileMenuVariants, mobileLinkVariants } from '@/lib/animations';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
  }, [isMenuOpen]);

  // ⚠️ تم شيل الآراء من هنا
  const navLinks = [
    { name: 'Work', href: '#work' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-white/80 backdrop-blur-xl border-b border-black/5 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
          
          <Link href="/" className="relative z-50 flex items-center" onClick={closeMenu}>
            <div className="relative w-32 md:w-40 h-8 md:h-10">
              <Image
                src="/KOHEDROO.png"
                alt="KOHEDROO Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-zinc-700 hover:text-black transition-colors relative group font-mono uppercase tracking-widest"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-black transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
            <Link
              href="#contact"
              className="bg-black text-white text-xs font-mono uppercase px-6 py-3 rounded-full font-bold tracking-wider hover:bg-zinc-800 transition-all hover:scale-105"
            >
              Let&apos;s Talk
            </Link>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden relative z-50 w-11 h-11 flex items-center justify-center rounded-full bg-black/5 active:bg-black/10 transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed inset-0 z-40 bg-white flex flex-col justify-center px-8 md:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  custom={i}
                  variants={mobileLinkVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <Link
                    href={link.href}
                    onClick={closeMenu}
                    className="block text-4xl font-extrabold tracking-tighter text-black py-3 active:text-zinc-500 transition-colors uppercase font-mono"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                custom={navLinks.length}
                variants={mobileLinkVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="mt-8"
              >
                <Link
                  href="#contact"
                  onClick={closeMenu}
                  className="inline-block bg-black text-white text-sm font-mono uppercase px-8 py-4 rounded-full font-semibold tracking-wider"
                >
                  Let&apos;s Talk
                </Link>
              </motion.div>
            </nav>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.5 } }}
              exit={{ opacity: 0 }}
              className="absolute bottom-10 left-8 right-8 flex justify-between text-xs font-mono uppercase text-zinc-400 tracking-widest"
            >
              <span>Dubai — Egypt</span>
              <span>© 2026</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}