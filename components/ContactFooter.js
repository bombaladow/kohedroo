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

  return (
    <footer id="contact" className="py-20 px-6 md:px-12 border-t border-zinc-900">
      <div>
        <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest">Have a project in mind?</span>
        <h2 className="text-4xl md:text-7xl font-bold mt-4 tracking-tighter hover:text-zinc-400 transition-colors cursor-pointer">
          Let&apos;s work together.
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        <div>
          <a href={`mailto:${settings.contact_email}`} className="font-mono text-lg text-zinc-300 hover:text-white block mb-8">
            {settings.contact_email}
          </a>
          <div className="flex flex-col gap-4 text-sm">
            <div><span className="text-zinc-500 font-mono uppercase text-xs tracking-wider block mb-1">WhatsApp</span>{settings.whatsapp}</div>
            <div><span className="text-zinc-500 font-mono uppercase text-xs tracking-wider block mb-1">Based in</span>{settings.location}</div>
          </div>
          <div className="flex items-center gap-6 text-zinc-400 font-mono text-xs uppercase tracking-wider mt-8">
            <a href="https://www.instagram.com/kohedroo/" className="hover:text-white transition-colors">Instagram</a>
            <a href="https://ae.linkedin.com/in/kohedroo" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="https://www.behance.net/hoossoo88" className="hover:text-white transition-colors">Behance</a>
            <a href="#" className="hover:text-white transition-colors">Vimeo</a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            required placeholder="Your name" value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
          />
          <input
            required type="email" placeholder="Your email" value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
          />
          <select
            value={form.service_type}
            onChange={(e) => update('service_type', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
          >
            <option value="">Service needed</option>
            <option>Branding / Logo</option>
            <option>Social Media Design</option>
            <option>Video Editing / Reels</option>
            <option>Ad Video / Motion Graphics</option>
            <option>Something else</option>
          </select>
          <select
            value={form.budget}
            onChange={(e) => update('budget', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
          >
            <option value="">Estimated budget</option>
            <option>Under $500</option>
            <option>$500 – $1,500</option>
            <option>$1,500 – $5,000</option>
            <option>$5,000+</option>
          </select>
          <input
            placeholder="Expected deadline" value={form.deadline}
            onChange={(e) => update('deadline', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-zinc-600"
          />
          <textarea
            placeholder="Tell me about your project" value={form.message}
            onChange={(e) => update('message', e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-sm min-h-[100px] focus:outline-none focus:border-zinc-600"
          />
          <button type="submit" className="bg-white text-black font-semibold rounded-lg py-3 text-sm hover:bg-zinc-200 transition-colors">
            Send Inquiry
          </button>
          {status && <p className="text-xs text-zinc-500 font-mono">{status}</p>}
        </form>
      </div>

      <p className="font-mono text-xs text-zinc-600 mt-16 pt-8 border-t border-zinc-900">
        © {new Date().getFullYear()} {settings.hero_title}. All rights reserved.
      </p>
    </footer>
  );
}
