'use client';

import { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import WorkGrid from '../components/WorkGrid';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Packages from '../components/Packages';
import ContactFooter from '../components/ContactFooter';
import { useSiteContent } from '../lib/useSiteContent';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { settings, projects, services, testimonials, packages } = useSiteContent();

  return (
    <div className="bg-transparent text-white min-h-screen selection:bg-white selection:text-black font-sans">
      <Header isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <Hero settings={settings} />
      <WorkGrid projects={projects} />
      <Services services={services} />
      <Testimonials testimonials={testimonials} />
      <Packages packages={packages} />
      <ContactFooter settings={settings} />
    </div>
  );
}
