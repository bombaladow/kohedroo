'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WorkGrid from '../components/WorkGrid';
import ContactFooter from '../components/ContactFooter';
import FloatingContact from '../components/FloatingContact';
import ScrollProgress from '../components/ScrollProgress';
import { useSiteContent } from '../lib/useSiteContent';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, projects, loading } = useSiteContent();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-transparent font-mono text-sm">جاري التحميل...</div>;
  }

  return (
    <div className="bg-transparent text-black min-h-screen selection:bg-black selection:text-white font-sans transition-colors duration-300">
      <div className="noise-bg"></div> {/* الخلفية الحية */}
      <ScrollProgress />
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero settings={settings} />
      <WorkGrid projects={projects} />
      <ContactFooter settings={settings} />
      <FloatingContact settings={settings} />
    </div>
  );
}