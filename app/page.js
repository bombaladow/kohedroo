'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import About from '../components/About'; 
import BrandsShowcase from '../components/BrandsShowcase';
import ContactFooter from '../components/ContactFooter';
import FloatingContact from '../components/FloatingContact';
import ScrollProgress from '../components/ScrollProgress';
import { useSiteContent } from '../lib/useSiteContent';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings } = useSiteContent();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-transparent text-black min-h-screen selection:bg-black selection:text-white font-sans transition-colors duration-300">
      <div className="noise-bg"></div>
      <ScrollProgress />
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      
      {/* الترتيب الجديد */}
      <Hero settings={settings} />
      <About settings={settings} />
      <BrandsShowcase />
      
      <ContactFooter settings={settings} />
      <FloatingContact settings={settings} />
    </div>
  );
}