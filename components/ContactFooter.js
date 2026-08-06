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
          Let&apos;s work together.
        </h2>

        {/* زرار الواتساب المباشر */}
        <div className="my-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-emerald-600 text-white font-mono text-sm uppercase px-8 py-4 rounded-full font-bold tracking-wider hover:bg-emerald-700 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            <MessageSquare size={18} />
            <span>Chat on WhatsApp</span>
          </a>
        </div>

        {/* روابط التواصل الاجتماعي تحت الزرار */}
        <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 text-zinc-700 font-mono text-xs uppercase tracking-wider mt-10 font-bold">
          <a 
            href="https://www.instagram.com/kohedroo/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-black transition-colors"
          >
            Instagram
          </a>
          <a 
            href="https://ae.linkedin.com/in/kohedroo" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-black transition-colors"
          >
            LinkedIn
          </a>
          <a 
            href="https://www.behance.net/hoossoo88" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-black transition-colors"
          >
            Behance
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