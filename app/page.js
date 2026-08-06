'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WorkGrid from '../components/WorkGrid';
import Testimonials from '../components/Testimonials';
import ContactFooter from '../components/ContactFooter';
import { useSiteContent } from '../lib/useSiteContent';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, projects, testimonials } = useSiteContent();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-transparent text-black min-h-screen selection:bg-black selection:text-white font-sans transition-colors duration-300">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero settings={settings} />
      <WorkGrid projects={projects} />
      <Testimonials testimonials={testimonials} />
      <ContactFooter settings={settings} />
    </div>
  );
}