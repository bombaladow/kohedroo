'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useLoading } from '@/lib/LoadingContext';

export default function BookNow() {
  const { setIsDataLoaded } = useLoading();
  const [packages, setPackages] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', package_id: '', date: '', time: '', notes: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setIsDataLoaded(true);

    const fetchPackages = async () => {
      const { data } = await supabase.from('packages').select('*').eq('is_active', true);
      setPackages(data || []);
    };
    fetchPackages();
  }, [setIsDataLoaded]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .insert([{ name: formData.name, email: formData.email, phone: formData.phone, status: 'Lead' }])
        .select()
        .single();
      
      if (clientError) throw clientError;
      if (!clientData) throw new Error("Failed to save client data.");

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          client_id: clientData.id,
          package_id: formData.package_id || null,
          date: formData.date,
          time: formData.time || '12:00:00',
          notes: formData.notes,
          status: 'Pending'
        }]);

      if (bookingError) throw bookingError;
      setSuccess(true);
    } catch (error) {
      alert("Error during booking: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 md:p-10 rounded-3xl shadow-xl text-center max-w-md w-full">
          <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-emerald-500 mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Booking Successful!</h2>
          <p className="text-sm md:text-base text-gray-600 mb-8">Thank you, we will contact you shortly to confirm your appointment.</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-zinc-800 transition-all active:scale-95">
            <ArrowLeft size={18} /> Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:pt-32 pb-20 px-4 md:px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          
          <h1 className="text-3xl md:text-4xl font-extrabold mb-2 tracking-tighter">{"Let's Work Together."}</h1>
          <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-10">Book your appointment and choose the package that suits your project.</p>

          <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input type="text" required className="input" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input type="tel" required className="input" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Email Address</label>
              <input type="email" className="input" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              <div>
                <label className="block text-sm font-semibold mb-2">Select Package</label>
                <select className="input" value={formData.package_id} onChange={(e) => setFormData({...formData, package_id: e.target.value})}>
                  <option value="">No specific package</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>{p.name} - ${p.price}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Preferred Date *</label>
                <input type="date" required className="input" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Preferred Time *</label>
              <input type="time" required className="input" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Project Details (Optional)</label>
              <textarea rows="4" className="input" placeholder="Write your project idea or any details..." value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
            </div>

            <button type="submit" disabled={loading} className="w-full btn-primary py-3.5 md:py-4 text-base md:text-lg">
              {loading ? "Sending..." : "Confirm Booking"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}