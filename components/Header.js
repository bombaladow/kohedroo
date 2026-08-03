'use client';

import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header({ isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-5 bg-black/70 backdrop-blur-md border-b border-zinc-900">
        <a href="#" className="relative h-7 w-32 flex items-center">
          <Image
            src="/KOHEDROO.png"
            alt="KOHEDROO"
            fill
            className="object-contain filter invert"
            priority
          />
        </a>

        <nav className="hidden md:flex items-center gap-10 font-mono text-xs uppercase tracking-widest text-zinc-400">
          <a href="#work" className="hover:text-white transition-colors">Work</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <a href="#services" className="hover:text-white transition-colors">Services</a>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </nav>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-zinc-300 hover:text-white"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black flex flex-col justify-center px-8 space-y-6 text-2xl font-bold uppercase md:hidden">
          <a href="#work" onClick={() => setIsMenuOpen(false)}>Work</a>
          <a href="#about" onClick={() => setIsMenuOpen(false)}>About</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)}>Services</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)}>Contact</a>
        </div>
      )}
    </>
  );
}
