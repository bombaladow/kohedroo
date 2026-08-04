'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // بيتفعل التأثير بعد سكرول 40 بكسل
      if (window.scrollY > 40) {
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

          {/* ================= DESKTOP HEADER (KOTO STYLE) ================= */}
          <div className="hidden md:flex items-center pointer-events-auto">
            <div 
              className={`flex items-center bg-black/80 backdrop-blur-md border border-zinc-800/80 rounded-full transition-all duration-500 ease-in-out shadow-2xl ${
                scrolled ? 'px-3 py-1.5 gap-2' : 'px-6 py-3 gap-8'
              }`}
            >
              {/* اللوجو */}
              <a href="#" className="relative h-6 w-28 flex items-center transition-all duration-300 hover:opacity-80">
                <Image
                  src="/KOHEDROO.png"
                  alt="KOHEDROO"
                  fill
                  className="object-contain filter invert"
                  priority
                />
              </a>

              {/* القائمة التي تطوى أفقياً عند السكرول */}
              <nav 
                className={`flex items-center transition-all duration-500 ease-in-out overflow-hidden font-mono text-xs uppercase tracking-widest text-zinc-400 ${
                  scrolled 
                    ? 'max-w-0 opacity-0 pointer-events-none gap-0' 
                    : 'max-w-md opacity-100 gap-8'
                }`}
              >
                <a href="#work" className="hover:text-white transition-colors whitespace-nowrap">Work</a>
                <a href="#about" className="hover:text-white transition-colors whitespace-nowrap">About</a>
                <a href="#services" className="hover:text-white transition-colors whitespace-nowrap">Services</a>
                <a href="#contact" className="hover:text-white transition-colors whitespace-nowrap">Contact</a>
              </nav>

              {/* زرار القائمة المصغر اللي بيظهر لما السكرول يشتغل */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`font-mono text-xs font-bold text-white uppercase tracking-widest transition-all duration-300 hover:text-zinc-300 ${
                  scrolled ? 'block px-2 py-1' : 'hidden'
                }`}
              >
                MENU +
              </button>
            </div>
          </div>

          {/* ================= MOBILE HEADER ================= */}
          <div className="flex md:hidden items-center justify-between w-full pointer-events-auto">
            <div 
              className={`flex items-center justify-between w-full bg-black/80 backdrop-blur-md border border-zinc-800 rounded-full transition-all duration-300 shadow-2xl ${
                scrolled ? 'px-4 py-2' : 'px-5 py-3'
              }`}
            >
              {/* الصورة واللوجو ينكمشان بشكل متناسق */}
              <a href="#" className={`relative transition-all duration-300 flex items-center ${
                scrolled ? 'h-5 w-20' : 'h-6 w-28'
              }`}>
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
                className="text-zinc-300 hover:text-white transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* ================= MOBILE DRAWER MENU ================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col justify-center px-8 space-y-8 text-2xl font-mono uppercase font-bold text-zinc-300">
          <a href="#work" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Work</a>
          <a href="#about" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#contact" className="hover:text-white transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      )}
    </>
  );
}