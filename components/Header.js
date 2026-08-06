'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // بيظهر اللوجو في الهيدر لما تنزل 100 بكسل تحت (بعد اللوجو الكبير)
      if (window.scrollY > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 p-4 md:p-6 pointer-events-none transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* ================= DESKTOP HEADER ================= */}
          <div className="hidden md:flex items-center pointer-events-auto mx-auto">
            <div 
              className={`flex items-center bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-full transition-all duration-500 ease-in-out shadow-2xl ${
                scrolled ? 'px-6 py-2.5 gap-6' : 'px-8 py-3.5 gap-8'
              }`}
            >
              {/* اللوجو - بيظهر بسلاسة لما تسكرول لتحت */}
              <a 
                href="#" 
                className={`relative h-6 transition-all duration-500 overflow-hidden flex items-center ${
                  scrolled ? 'w-28 opacity-100' : 'w-0 opacity-0 pointer-events-none'
                }`}
              >
                <Image
                  src="/KOHEDROO.png"
                  alt="KOHEDROO"
                  fill
                  className="object-contain filter invert"
                  priority
                />
              </a>

              {/* القائمة الرئيسية (بدون Services) */}
              <nav className="flex items-center gap-8 font-mono text-xs uppercase tracking-widest text-zinc-400">
                <a href="#work" className="hover:text-white transition-colors whitespace-nowrap">Work</a>
                <a href="#about" className="hover:text-white transition-colors whitespace-nowrap">About</a>
                <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap">Contact</a>
              </nav>
            </div>
          </div>

          {/* ================= MOBILE HEADER ================= */}
          <div className="flex md:hidden items-center justify-between w-full pointer-events-auto">
            <div 
              className={`flex items-center justify-between w-full bg-black/80 backdrop-blur-md border border-zinc-800 rounded-full transition-all duration-300 shadow-2xl ${
                scrolled ? 'px-4 py-2' : 'px-5 py-3'
              }`}
            >
              {/* اللوجو على الموبايل بيظهر مع السكرول */}
              <a 
                href="#" 
                className={`relative transition-all duration-300 flex items-center ${
                  scrolled ? 'h-5 w-20 opacity-100' : 'h-5 w-0 opacity-0'
                }`}
              >
                <Image
                  src="/KOHEDROO.png"
                  alt="KOHEDROO"
                  fill
                  className="object-contain filter invert"
                  priority
                />
              </a>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-zinc-300 hover:text-white transition-colors ml-auto"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ================= MOBILE DRAWER MENU ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center items-center space-y-8 text-2xl font-mono uppercase font-bold text-zinc-300 pointer-events-auto">
          <a href="#work" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Work</a>
          <a href="#about" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#contact" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      )}
    </>
  );
}