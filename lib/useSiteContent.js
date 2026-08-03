'use client';

import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import {
  FALLBACK_SETTINGS, FALLBACK_PROJECTS, FALLBACK_SERVICES,
  FALLBACK_TESTIMONIALS, FALLBACK_PACKAGES
} from './fallbackData';

export function useSiteContent() {
  const [settings, setSettings] = useState(FALLBACK_SETTINGS);
  const [projects, setProjects] = useState(FALLBACK_PROJECTS);
  const [services, setServices] = useState(FALLBACK_SERVICES);
  const [testimonials, setTestimonials] = useState(FALLBACK_TESTIMONIALS);
  const [packages, setPackages] = useState(FALLBACK_PACKAGES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const [s, w, sv, tm, pk] = await Promise.all([
          supabase.from('site_settings').select('*').eq('id', 1).single(),
          supabase.from('work_items').select('*').order('sort_order', { ascending: true }),
          supabase.from('services').select('*').order('sort_order', { ascending: true }),
          supabase.from('testimonials').select('*').order('sort_order', { ascending: true }),
          supabase.from('packages').select('*').order('sort_order', { ascending: true })
        ]);
        if (!active) return;
        if (s.data) setSettings(s.data);
        if (w.data && w.data.length) setProjects(w.data);
        if (sv.data && sv.data.length) setServices(sv.data);
        if (tm.data && tm.data.length) setTestimonials(tm.data);
        if (pk.data && pk.data.length) setPackages(pk.data);
      } catch (err) {
        console.warn('Supabase not configured yet, using fallback content.', err);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, []);

  return { settings, projects, services, testimonials, packages, loading };
}
