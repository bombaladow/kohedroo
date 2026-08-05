'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ContactFooter({ settings }) {
  const [form, setForm] = useState({ name: '', email: '', service_type: '', budget: '', deadline: '', message: '' });
  const [status, setStatus] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('Sending...');
    const { error } = await supabase.from('inquiries').insert(form);
    if (error) {
      setStatus('Something went wrong, please try WhatsApp instead.');
    } else {
      setStatus("Thanks — I'll get back to you soon!");
      setForm({ name: '', email: '', service_type: '', budget: '', deadline: '', message: '' });
    }
  }

  const inputStyles = "bg-white/80 backdrop-blur-md border border-black/15 text-black placeholder:text-zinc-500 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-all shadow-sm";

  return (
    <footer id="contact" className="py-20 px-6 md:px-12 border-t border-black/10 bg-transparent">
      <div>
        <span className="text-xs font-mono uppercase text-zinc-600 tracking-widest font-bold">Have a project in mind?</span>
        <h2 className="text-4xl md:text-7xl font-bold mt-4 tracking-tighter text-black hover:text-zinc-700 transition-colors cursor-pointer">
          Let&apos;s work together.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        <div>
          <a href={`mailto:${settings?.contact_email}`} className="font-mono text-lg text-black font-semibold hover:underline block mb-8">
            {settings?.contact_email}
          </a>
          <div className="flex flex-col gap-4 text-sm">
            <div><span className="text-zinc-500 font-mono uppercase text-xs tracking-wider block mb-1">WhatsApp</span><span className="text-black font-medium">{settings?.whatsapp}</span></div>
            <div><span className="text-zinc-500 font-mono uppercase text-xs tracking-wider block mb-1">Based in</span><span className="text-black font-medium">{settings?.location}</span></div>
          </div>
          <div className="flex items-center gap-6 text-zinc-700 font-mono text-xs uppercase tracking-wider mt-8 font-semibold">
            <a href="https://www.instagram.com/kohedroo/" className="hover:text-black transition-colors">Instagram</a>
            <a href="https://ae.linkedin.com/in/kohedroo" className="hover:text-black transition-colors">LinkedIn</a>
            <a href="https://www.behance.net/hoossoo88" className="hover:text-black transition-colors">Behance</a>
            <a href="#" className="hover:text-black transition-colors">Vimeo</a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required placeholder="Your name" value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className={inputStyles}
          />
          <input
            required type="email" placeholder="Your email" value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className={inputStyles}
          />
          <select
            value={form.service_type}
            onChange={(e) => update('service_type', e.target.value)}
            className={inputStyles}
          >
            <option value="" className="text-zinc-500">Service needed</option>
            <option className="text-black">Branding / Logo</option>
            <option className="text-black">Social Media Design</option>
            <option className="text-black">Video Editing / Reels</option>
            <option className="text-black">Ad Video / Motion Graphics</option>
            <option className="text-black">Something else</option>
          </select>
          <select
            value={form.budget}
            onChange={(e) => update('budget', e.target.value)}
            className={inputStyles}
          >
            <option value="" className="text-zinc-500">Estimated budget</option>
            <option className="text-black">Under $500</option>
            <option className="text-black">$500 – $1,500</option>
            <option className="text-black">$1,500 – $5,000</option>
            <option className="text-black">$5,000+</option>
          </select>
          <input
            placeholder="Expected deadline" value={form.deadline}
            onChange={(e) => update('deadline', e.target.value)}
            className={inputStyles}
          />
          <textarea
            placeholder="Tell me about your project" value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className={`${inputStyles} min-h-[100px]`}
          />
          <button type="submit" className="bg-black text-white font-semibold rounded-lg py-3.5 text-sm hover:bg-zinc-800 transition-colors shadow-md">
            Send Inquiry
          </button>
          {status && <p className="text-xs text-zinc-600 font-mono mt-1 font-semibold">{status}</p>}
        </form>
      </div>

      <p className="font-mono text-xs text-zinc-500 mt-16 pt-8 border-t border-black/10">
        © {new Date().getFullYear()} {settings?.hero_title}. All rights reserved.
      </p>
    </footer>
  );
}