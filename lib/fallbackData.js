// محتوى افتراضي يظهر لحد ما تحط بيانات حقيقية في Supabase من الداش بورد

export const FALLBACK_SETTINGS = {
  hero_title: 'KOHEDROO STUDIO',
  hero_subtitle: 'Visual studio & Video editing',
  hero_tagline: 'Creative Direction • Video Production',
  contact_email: 'contact@kohedroo.com',
  whatsapp: '+9715 55 78 0408',
  location: 'United Arab Emirates — remote worldwide',
  showreel_thumbnail: 'https://images.unsplash.com/photo-1536240478700-b869070f9279?q=80&w=1600',
  stat1_value: '50+', stat1_label: 'Projects completed',
  stat2_value: '10+', stat2_label: 'Years of experience',
  stat3_value: '10M+', stat3_label: 'Views generated'
};

export const FALLBACK_PROJECTS = [
  { id: 1, title: 'ON PLAN', category: 'Motion Graphics / Branding', year: '2026', bg_color: '#1a1917', media_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000' },
  { id: 2, title: 'Amazon Rebrand', category: 'Visual Identity', year: '2025', bg_color: '#111827', media_url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=1000' },
  { id: 3, title: 'Vimeo Showreel', category: 'Video Editing / Color Grading', year: '2025', bg_color: '#064e3b', media_url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1000' },
  { id: 4, title: 'Tripadvisor Campaign', category: 'Social Media / Art Direction', year: '2024', bg_color: '#312e81', media_url: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000' }
];

export const FALLBACK_SERVICES = [
  { number: '01', title: 'Video Editing & Post-Production', description: 'Professional editing, dynamic cutting, and visual effects.' },
  { number: '02', title: 'Color Grading & Audio FX', description: 'Cinematic color correction and precise audio mixing.' },
  { number: '03', title: 'Graphic & Branding', description: 'Visual identities, logos, and social media design.' },
  { number: '04', title: '2D Motion Graphics', description: 'Animated logos, text, and interactive ads.' }
];

export const FALLBACK_TESTIMONIALS = [
  { name: 'Sample Client', role: 'Founder, Coffee Brand', quote: 'Replace this with a real quote once you have client feedback.' },
  { name: 'Sample Client', role: 'Marketing Lead', quote: 'Replace this with a real quote once you have client feedback.' },
  { name: 'Sample Client', role: 'Product Owner', quote: 'Replace this with a real quote once you have client feedback.' }
];

export const FALLBACK_PACKAGES = [
  { title: 'Starter', price: '$300/mo', features: '4 social posts\n2 reels edited\n1 revision round', sort_order: 1 },
  { title: 'Growth', price: '$700/mo', features: '10 social posts\n6 reels edited\n2 revision rounds\nMonthly strategy call', sort_order: 2 },
  { title: 'Full Production', price: 'Custom', features: 'Full branding + ongoing content\nUnlimited revisions\nPriority turnaround', sort_order: 3 }
];
