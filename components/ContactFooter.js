'use client';

import { MessageSquare, Instagram, Linkedin } from 'lucide-react';

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

        {/* روابط التواصل الاجتماعي تحت الزرار (أيقونات بدلاً من الكلمات) */}
        <div className="flex items-center justify-center gap-6 md:gap-8 mt-10">
          
          {/* Instagram */}
          <a 
            href="https://www.instagram.com/kohedroo/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Instagram"
            className="text-zinc-700 hover:text-black hover:scale-110 transition-all duration-300 p-2 rounded-full hover:bg-black/5"
          >
            <Instagram className="w-6 h-6 stroke-[2]" />
          </a>

          {/* LinkedIn */}
          <a 
            href="https://ae.linkedin.com/in/kohedroo" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
            className="text-zinc-700 hover:text-black hover:scale-110 transition-all duration-300 p-2 rounded-full hover:bg-black/5"
          >
            <Linkedin className="w-6 h-6 stroke-[2]" />
          </a>

          {/* Behance */}
          <a 
            href="https://www.behance.net/hoossoo88" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="Behance"
            className="text-zinc-700 hover:text-black hover:scale-110 transition-all duration-300 p-2 rounded-full hover:bg-black/5"
          >
            <svg
              className="w-6 h-6 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M22 7h-7v-2h7v2zm1.726 10c0 2.174-1.282 3.868-3.793 3.868-2.677 0-4.381-1.815-4.381-4.704 0-2.883 1.83-4.832 4.312-4.832 2.766 0 3.862 2.155 3.862 4.417 0 .373-.024.819-.059 1.251h-5.975c.094 1.455.972 2.222 2.188 2.222 1.012 0 1.637-.478 1.957-1.222h1.889zm-5.834-3.136h3.843c-.078-1.071-.722-1.782-1.874-1.782-1.168 0-1.868.74-1.969 1.782zm-10.892 5.136h-7v-13h7.288c2.251 0 3.712 1.001 3.712 2.803 0 1.189-.625 2.115-1.637 2.585 1.282.41 2.052 1.503 2.052 2.981 0 2.22-1.748 4.631-4.415 4.631zm-4.859-7.854h2.511c1.139 0 1.815-.521 1.815-1.393 0-.895-.676-1.352-1.815-1.352h-2.511v2.745zm0 5.727h2.71c1.282 0 2.012-.628 2.012-1.554 0-.972-.73-1.579-2.012-1.579h-2.71v3.133z" />
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