'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function AdminPage() {
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(null); // null = checking, false = denied, true = ok
  const [notice, setNotice] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(false); return; }
    (async () => {
      const { data, error } = await supabase.rpc('am_i_admin');
      if (error || !data) {
        setIsAdmin(false);
        setNotice("This account isn't allowed to access the dashboard. Ask whoever manages it to add your email.");
      } else {
        setIsAdmin(true);
      }
    })();
  }, [session]);

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: typeof window !== 'undefined' ? window.location.origin + '/admin' : undefined }
    });
  }

  async function logout() {
    await supabase.auth.signOut();
    setSession(null);
    setIsAdmin(null);
  }

  if (!session || isAdmin === false) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4 text-center px-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-400 text-sm">Sign in with the Google account allowed to make edits</p>
        <button onClick={login} className="bg-white text-black font-semibold rounded-lg px-6 py-3 text-sm">
          Sign in with Google
        </button>
        {notice && <p className="text-xs text-zinc-500 max-w-xs">{notice}</p>}
      </div>
    );
  }

  if (isAdmin === null) {
    return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;
  }

  return <Dashboard email={session.user.email} onLogout={logout} />;
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5 mb-3">
      <label className="text-xs text-zinc-500">{label}</label>
      {children}
    </div>
  );
}

const inputClass = "bg-black border border-zinc-800 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-600 w-full";
const cardClass = "bg-zinc-950 border border-zinc-900 rounded-xl p-6 mb-6";
const btnClass = "bg-white text-black font-semibold rounded-lg px-5 py-2.5 text-sm hover:bg-zinc-200 transition-colors";
const dangerBtnClass = "bg-red-950 text-red-300 rounded-lg px-3 py-1.5 text-xs";

function Dashboard({ email, onLogout }) {
  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-12 py-10 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-zinc-500 text-sm">{email}</p>
        </div>
        <button onClick={onLogout} className="border border-zinc-700 rounded-lg px-4 py-2 text-xs">Sign out</button>
      </div>

      <SettingsCard />
      <WorkCard />
      <ServicesCard />
      <TestimonialsCard />
      <PackagesCard />
      <InquiriesCard />
    </div>
  );
}

// ---------------- Settings ----------------
function SettingsCard() {
  const [data, setData] = useState({});
  const [status, setStatus] = useState('');

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single().then(({ data }) => data && setData(data));
  }, []);

  function set(field, value) { setData((d) => ({ ...d, [field]: value })); }

  async function save() {
    setStatus('Saving...');
    const { error } = await supabase.from('site_settings').upsert({ ...data, id: 1 });
    setStatus(error ? 'Error: ' + error.message : 'Saved ✓');
  }

  return (
    <div className={cardClass}>
      <h2 className="font-bold mb-4">General Settings</h2>
      <Field label="Hero title (brand name)"><input className={inputClass} value={data.hero_title || ''} onChange={(e) => set('hero_title', e.target.value)} /></Field>
      <Field label="Hero subtitle"><input className={inputClass} value={data.hero_subtitle || ''} onChange={(e) => set('hero_subtitle', e.target.value)} /></Field>
      <Field label="Hero tagline (small text, use • to separate)"><input className={inputClass} value={data.hero_tagline || ''} onChange={(e) => set('hero_tagline', e.target.value)} /></Field>
      <Field label="Showreel thumbnail URL"><input className={inputClass} value={data.showreel_thumbnail || ''} onChange={(e) => set('showreel_thumbnail', e.target.value)} /></Field>
      <Field label="Contact email"><input className={inputClass} value={data.contact_email || ''} onChange={(e) => set('contact_email', e.target.value)} /></Field>
      <Field label="WhatsApp"><input className={inputClass} value={data.whatsapp || ''} onChange={(e) => set('whatsapp', e.target.value)} /></Field>
      <Field label="Location"><input className={inputClass} value={data.location || ''} onChange={(e) => set('location', e.target.value)} /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Stat 1 value"><input className={inputClass} value={data.stat1_value || ''} onChange={(e) => set('stat1_value', e.target.value)} /></Field>
        <Field label="Stat 1 label"><input className={inputClass} value={data.stat1_label || ''} onChange={(e) => set('stat1_label', e.target.value)} /></Field>
        <Field label="Stat 2 value"><input className={inputClass} value={data.stat2_value || ''} onChange={(e) => set('stat2_value', e.target.value)} /></Field>
        <Field label="Stat 2 label"><input className={inputClass} value={data.stat2_label || ''} onChange={(e) => set('stat2_label', e.target.value)} /></Field>
        <Field label="Stat 3 value"><input className={inputClass} value={data.stat3_value || ''} onChange={(e) => set('stat3_value', e.target.value)} /></Field>
        <Field label="Stat 3 label"><input className={inputClass} value={data.stat3_label || ''} onChange={(e) => set('stat3_label', e.target.value)} /></Field>
      </div>
      <button onClick={save} className={btnClass}>Save Settings</button>
      <p className="text-xs text-emerald-400 mt-2">{status}</p>
    </div>
  );
}

// ---------------- Work items ----------------
function WorkCard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', category: '', year: '', sort_order: '', media_url: '', video_url: '' });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('work_items').select('*').order('sort_order', { ascending: true });
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  function set(field, value) { setForm((f) => ({ ...f, [field]: value })); }

  async function add() {
    setStatus('Saving...');
    let media_url = form.media_url || null;
    if (file) {
      const path = `work/${Date.now()}-${file.name}`;
      const { error: upErr } = await supabase.storage.from('portfolio').upload(path, file);
      if (upErr) { setStatus('Upload error: ' + upErr.message); return; }
      const { data: pub } = supabase.storage.from('portfolio').getPublicUrl(path);
      media_url = pub.publicUrl;
    }
    const { error } = await supabase.from('work_items').insert({
      title: form.title, tag: form.category, year: form.year,
      sort_order: parseInt(form.sort_order) || 0, image_url: media_url, video_url: form.video_url || null
    });
    setStatus(error ? 'Error: ' + error.message : 'Added ✓');
    if (!error) {
      setForm({ title: '', category: '', year: '', sort_order: '', media_url: '', video_url: '' });
      setFile(null);
      load();
    }
  }

  async function remove(id) {
    if (!confirm('Delete this project?')) return;
    await supabase.from('work_items').delete().eq('id', id);
    load();
  }

  return (
    <div className={cardClass}>
      <h2 className="font-bold mb-4">Work</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border-b border-zinc-900 py-3">
          <div>
            <div className="text-sm">{item.title}</div>
            <div className="text-xs text-zinc-500">{item.tag} · order {item.sort_order}</div>
          </div>
          <button onClick={() => remove(item.id)} className={dangerBtnClass}>Delete</button>
        </div>
      ))}
      <h3 className="font-semibold text-sm mt-6 mb-3">Add new project</h3>
      <Field label="Title"><input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} /></Field>
      <Field label="Category"><input className={inputClass} placeholder="Motion Graphics / Branding" value={form.category} onChange={(e) => set('category', e.target.value)} /></Field>
      <Field label="Year"><input className={inputClass} placeholder="2026" value={form.year} onChange={(e) => set('year', e.target.value)} /></Field>
      <Field label="Sort order (lower shows first)"><input className={inputClass} value={form.sort_order} onChange={(e) => set('sort_order', e.target.value)} /></Field>
      <Field label="Image URL (optional if uploading a file)"><input className={inputClass} value={form.media_url} onChange={(e) => set('media_url', e.target.value)} /></Field>
      <Field label="Or upload an image"><input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="text-sm" /></Field>
      <Field label="Video URL (optional — plays on hover instead of the image)"><input className={inputClass} value={form.video_url} onChange={(e) => set('video_url', e.target.value)} /></Field>
      <button onClick={add} className={btnClass}>Add</button>
      <p className="text-xs text-emerald-400 mt-2">{status}</p>
    </div>
  );
}

// ---------------- Services ----------------
function ServicesCard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', sort_order: '' });
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const { error } = await supabase.from('services').insert({
      title: form.title, description: form.description, sort_order: parseInt(form.sort_order) || 0
    });
    setStatus(error ? 'Error: ' + error.message : 'Added ✓');
    if (!error) { setForm({ title: '', description: '', sort_order: '' }); load(); }
  }

  async function remove(id) {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    load();
  }

  return (
    <div className={cardClass}>
      <h2 className="font-bold mb-4">Services</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border-b border-zinc-900 py-3">
          <div className="text-sm">{item.title}</div>
          <button onClick={() => remove(item.id)} className={dangerBtnClass}>Delete</button>
        </div>
      ))}
      <h3 className="font-semibold text-sm mt-6 mb-3">Add new service</h3>
      <Field label="Title"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Description"><textarea className={inputClass} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
      <Field label="Sort order"><input className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></Field>
      <button onClick={add} className={btnClass}>Add</button>
      <p className="text-xs text-emerald-400 mt-2">{status}</p>
    </div>
  );
}

// ---------------- Testimonials ----------------
function TestimonialsCard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', role: '', quote: '', sort_order: '' });
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('testimonials').select('*').order('sort_order', { ascending: true });
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const { error } = await supabase.from('testimonials').insert({ ...form, sort_order: parseInt(form.sort_order) || 0 });
    setStatus(error ? 'Error: ' + error.message : 'Added ✓');
    if (!error) { setForm({ name: '', role: '', quote: '', sort_order: '' }); load(); }
  }

  async function remove(id) {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    load();
  }

  return (
    <div className={cardClass}>
      <h2 className="font-bold mb-4">Testimonials</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border-b border-zinc-900 py-3">
          <div>
            <div className="text-sm">{item.name} — <span className="text-zinc-500">{item.role}</span></div>
            <div className="text-xs text-zinc-500">&ldquo;{item.quote}&rdquo;</div>
          </div>
          <button onClick={() => remove(item.id)} className={dangerBtnClass}>Delete</button>
        </div>
      ))}
      <h3 className="font-semibold text-sm mt-6 mb-3">Add testimonial</h3>
      <Field label="Client name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Role / company"><input className={inputClass} value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} /></Field>
      <Field label="Quote"><textarea className={inputClass} value={form.quote} onChange={(e) => setForm({ ...form, quote: e.target.value })} /></Field>
      <Field label="Sort order"><input className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></Field>
      <button onClick={add} className={btnClass}>Add</button>
      <p className="text-xs text-emerald-400 mt-2">{status}</p>
    </div>
  );
}

// ---------------- Packages ----------------
function PackagesCard() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', price: '', features: '', sort_order: '' });
  const [status, setStatus] = useState('');

  async function load() {
    const { data } = await supabase.from('packages').select('*').order('sort_order', { ascending: true });
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function add() {
    const { error } = await supabase.from('packages').insert({ ...form, sort_order: parseInt(form.sort_order) || 0 });
    setStatus(error ? 'Error: ' + error.message : 'Added ✓');
    if (!error) { setForm({ title: '', price: '', features: '', sort_order: '' }); load(); }
  }

  async function remove(id) {
    if (!confirm('Delete this package?')) return;
    await supabase.from('packages').delete().eq('id', id);
    load();
  }

  return (
    <div className={cardClass}>
      <h2 className="font-bold mb-4">Packages & Pricing</h2>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center border-b border-zinc-900 py-3">
          <div className="text-sm">{item.title} — {item.price}</div>
          <button onClick={() => remove(item.id)} className={dangerBtnClass}>Delete</button>
        </div>
      ))}
      <h3 className="font-semibold text-sm mt-6 mb-3">Add package</h3>
      <Field label="Title"><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
      <Field label="Price"><input className={inputClass} placeholder="$300/mo" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} /></Field>
      <Field label="Features (one per line)"><textarea className={inputClass} value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} /></Field>
      <Field label="Sort order"><input className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></Field>
      <button onClick={add} className={btnClass}>Add</button>
      <p className="text-xs text-emerald-400 mt-2">{status}</p>
    </div>
  );
}

// ---------------- Inquiries ----------------
function InquiriesCard() {
  const [items, setItems] = useState([]);

  async function load() {
    const { data } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false });
    setItems(data || []);
  }
  useEffect(() => { load(); }, []);

  async function remove(id) {
    if (!confirm('Delete this inquiry?')) return;
    await supabase.from('inquiries').delete().eq('id', id);
    load();
  }

  return (
    <div className={cardClass}>
      <h2 className="font-bold mb-4">Incoming Inquiries</h2>
      {items.length === 0 && <p className="text-sm text-zinc-500">No inquiries yet.</p>}
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-start border-b border-zinc-900 py-3">
          <div>
            <div className="text-sm">{item.name} — {item.email}</div>
            <div className="text-xs text-zinc-500">{item.service_type || '—'} · {item.budget || '—'} · Deadline: {item.deadline || '—'}</div>
            <div className="text-xs text-zinc-500 mt-1">{item.message}</div>
          </div>
          <button onClick={() => remove(item.id)} className={dangerBtnClass}>Delete</button>
        </div>
      ))}
    </div>
  );
}
