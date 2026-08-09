'use client';

import { MessageSquare } from 'lucide-react';

export default function ContactFooter({ settings }) {
  // تجهيز رابط الواتساب من الرقم الموجود في الـ settings
  const cleanPhoneNumber = settings?.whatsapp?.replace(/[^0-9]/g, '') || '971555780408';
  const whatsappUrl = `https://wa.me/${cleanPhoneNumber}`;

  return (
    <footer id="contact" className="py-24 px-6 md:px-12 border-t border-black/10 bg-transparent text-center">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        
        {/* العنوان الفرعي والرئيسي */}
        <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold block mb-3">
          Have a project in mind?
        </span>
        
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-black mb-8">
          {"Let's work together."}
        </h2>

        {/* زرار الواتساب المباشر */}
        <div className="my-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-mono text-sm uppercase px-8 py-4 rounded-full font-bold tracking-wider hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl"
          >
            <MessageSquare size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* روابط اللوجوهات بدون أي تأثيرات حركة نهائياً */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-10">
          
          {/* Instagram Logo */}
          <a 
            href="https://www.instagram.com/kohedroo/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
            className="text-black block"
          >
            <svg className="w-8 h-8 fill-current block" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6 12.6c0 1.98-.38 2.72-1.42 3.76-1.04 1.04-1.78 1.42-3.76 1.42h-1.64c-1.98 0-2.72-.38-3.76-1.42C6.38 15.32 6 14.58 6 12.6v-1.2c0-1.98.38-2.72 1.42-3.76C8.46 6.6 9.2 6.22 11.18 6.22h1.64c1.98 0 2.72.38 3.76 1.42 1.04 1.04 1.42 1.78 1.42 3.76v1.2z"/>
              <path fill="#fff" d="M12 8.35a3.65 3.65 0 100 7.3 3.65 3.65 0 000-7.3zm0 5.8a2.15 2.15 0 110-4.3 2.15 2.15 0 010 4.3zm3.8-5.95a.85.85 0 11-1.7 0 .85.85 0 011.7 0z"/>
            </svg>
          </a>

          {/* LinkedIn Logo */}
          <a 
            href="https://ae.linkedin.com/in/kohedroo" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
            className="text-black block"
          >
            <svg className="w-8 h-8 fill-current block" viewBox="0 0 24 24">
              <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm-3.5 17.5H6v-8h2.5v8zM7.25 8.25c-.8 0-1.45-.65-1.45-1.45s.65-1.45 1.45-1.45 1.45.65 1.45 1.45-.65 1.45-1.45 1.45zm10.25 9.25h-2.5v-4.2c0-1.05-.38-1.77-1.32-1.77-.72 0-1.15.48-1.34.95-.07.17-.09.41-.09.65v4.37h-2.5v-8h2.5v1.13c.33-.51.92-1.24 2.25-1.24 1.64 0 2.87 1.07 2.87 3.37v4.74z"/>
            </svg>
          </a>

          {/* Behance Logo */}
          <a 
            href="https://www.behance.net/hoossoo88" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Behance"
            className="text-black block"
          >
            <svg className="w-8 h-8 fill-current block" viewBox="0 0 24 24">
              <path d="M19 0H5C2.24 0 0 2.24 0 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5V5c0-2.76-2.24-5-5-5zM11.67 15.17c0 1.58-1.27 2.83-3.21 2.83H4V6h4.37c1.7 0 2.88 1.05 2.88 2.45 0 .97-.53 1.76-1.38 2.12 1.1.34 1.8 1.25 1.8 2.6zm3.33-7.67h4.5v1.2h-4.5v-1.2zm6.33 7.82h-1.63c-.27.63-.8 1.03-1.66 1.03-1.03 0-1.78-.65-1.86-1.88h5.11c.03-.36.05-.73.05-1.05 0-1.93-.93-3.76-3.3-3.76-2.12 0-3.68 1.66-3.68 4.12 0 2.46 1.45 4.01 3.73 4.01 2.14 0 3.23-1.44 3.24-2.47zm-5.14-3.53c.09-.89.68-1.52 1.68-1.52.98 0 1.53.6 1.6 1.52h-3.28z"/>
              <path fill="#fff" d="M6.5 7.8v2.2h1.6c.6 0 1-.3 1-.8 0-.6-.4-.9-1-.9H6.5zm0 4.2v2.5h1.8c.7 0 1.1-.3 1.1-1 0-.7-.4-1.1-1.1-1.1H6.5z"/>
            </svg>
          </a>

        </div>

        {/* حقوق الملكية وحالة الموقع */}
        <p className="font-mono text-xs text-zinc-400 mt-16 pt-8 border-t border-black/10 w-full text-center">
          © {new Date().getFullYear()} {settings?.hero_title || 'KOHEDROO'}. All rights reserved.
        </p>

      </div>
    </footer>
  );
}