'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WorkGrid from '../components/WorkGrid';
import PortraitVideos from '../components/PortraitVideos'; // ضفنا ده
import GraphicDesigns from '../components/GraphicDesigns'; // ضفنا ده
import About from '../components/About'; 
import ContactFooter from '../components/ContactFooter';
import FloatingContact from '../components/FloatingContact';
import ScrollProgress from '../components/ScrollProgress';
import { useSiteContent } from '../lib/useSiteContent';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, projects } = useSiteContent();

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
      <Hero settings={settings} />
      <WorkGrid projects={projects} />
      
      {/* الأقسام الجديدة */}
      <PortraitVideos projects={projects} />
      <GraphicDesigns projects={projects} />
      
      <About settings={settings} />
      <ContactFooter settings={settings} />
      <FloatingContact settings={settings} />
    </div>
  );
}