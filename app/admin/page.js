"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Image as ImageIcon, Briefcase, Users, 
  Calendar, Settings, LogOut, Plus, Pencil, Trash2, 
  MessageSquare, Menu, X, CheckCircle, TrendingUp, Link as LinkIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  // States للبيانات
  const [projects, setProjects] = useState([]);
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [siteContent, setSiteContent] = useState([]);

  // States للفورم
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else {
        setUser(session.user);
        fetchAllData();
      }
    };
    checkUser();
  }, [router]);

  const fetchAllData = async () => {
    const [proj, brnd, cli, pkg, book, content] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("brands").select("*").order("created_at", { ascending: false }),
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("packages").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select(`*, clients(name, phone), packages(name)`).order("created_at", { ascending: false }),
      supabase.from("site_content").select("*")
    ]);

    setProjects(proj.data || []);
    setBrands(brnd.data || []);
    setClients(cli.data || []);
    setPackages(pkg.data || []);
    setBookings(book.data || []);
    setSiteContent(content.data || []);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({});
    setFile(null);
    setEditingId(null);
    setIsFormOpen(false);
    setIsSidebarOpen(false);
  };

  const handleOpenForm = (data = null) => {
    if (data) {
      setFormData(data);
      if (data.features) setFormData(prev => ({ ...prev, features: data.features.join(', ') }));
      setEditingId(data.id);
    } else {
      setFormData({});
      setEditingId(null);
    }
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadMedia = async (file, bucket = 'portfolio-media') => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let uploadedUrl = null;
      if (file) uploadedUrl = await uploadMedia(file);

      if (activeTab === "projects") {
        const data = { ...formData };
        if (uploadedUrl) {
          data.media_url = uploadedUrl;
          if (formData.type === 'video') data.video_url = uploadedUrl;
        }
        if (editingId) await supabase.from("projects").update(data).eq("id", editingId);
        else await supabase.from("projects").insert([data]);
      } 
      else if (activeTab === "brands") {
        const data = { ...formData };
        if (uploadedUrl) data.logo_url = uploadedUrl;
        data.size = parseFloat(formData.size) || 1;
        if (editingId) await supabase.from("brands").update(data).eq("id", editingId);
        else await supabase.from("brands").insert([data]);
      }
      else if (activeTab === "clients") {
        if (editingId) await supabase.from("clients").update(formData).eq("id", editingId);
        else await supabase.from("clients").insert([formData]);
      } 
      else if (activeTab === "packages") {
        const featuresArray = formData.features ? formData.features.split(',').map(f => f.trim()) : [];
        const data = { ...formData, features: featuresArray };
        if (editingId) await supabase.from("packages").update(data).eq("id", editingId);
        else await supabase.from("packages").insert([data]);
      } 
      else if (activeTab === "bookings") {
        if (editingId) await supabase.from("bookings").update(formData).eq("id", editingId);
        else await supabase.from("bookings").insert([formData]);
      } 
      else if (activeTab === "content") {
        if (editingId) {
           await supabase.from("site_content").update({ value: formData.value }).eq("id", editingId);
        } else {
           await supabase.from("site_content").insert([{ key: formData.key, value: formData.value }]);
        }
      }

      alert(editingId ? "Updated successfully!" : "Saved successfully!");
      setIsFormOpen(false);
      fetchAllData();
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (table, id) => {
    if (!confirm("Are you sure you want to delete this? This action cannot be undone.")) return;
    try {
      await supabase.from(table).delete().eq("id", id);
      fetchAllData();
    } catch (error) {
      alert("Error deleting: " + error.message);
    }
  };

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Loading Dashboard...</div>;

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "brands", label: "Brands & Logos", icon: ImageIcon },
    { id: "bookings", label: "Inquiries", icon: MessageSquare },
    { id: "clients", label: "Clients", icon: Users },
    { id: "packages", label: "Packages", icon: TrendingUp },
    { id: "content", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800" dir="ltr">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* Sidebar */}
      <div className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white tracking-tighter">Kohedroo<span className="text-indigo-500">.</span></h2>
          <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-400"><X size={20}/></button>
        </div>
        
        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={() => handleTabChange(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === item.id ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20" : "hover:bg-slate-800 hover:text-white"}`}>
                <Icon size={18} className={activeTab === item.id ? "text-white" : "text-slate-400"} />
                <span className="font-medium text-sm">{item.label}</span>
                {item.id === 'bookings' && bookings.filter(b => b.status === 'Pending').length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {bookings.filter(b => b.status === 'Pending').length}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors">
            <LogOut size={18} /><span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-lg"><Menu size={20}/></button>
            <h1 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            {activeTab !== "overview" && (
              <button onClick={() => handleOpenForm()} className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                <Plus size={16} /> Add New
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm font-bold text-slate-600">
              {user.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {/* 🟢 Tab 1: Overview */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center"><Briefcase size={24}/></div>
                  <div><p className="text-sm text-slate-500 font-medium">Total Projects</p><h3 className="text-2xl font-bold">{projects.length}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center"><Users size={24}/></div>
                  <div><p className="text-sm text-slate-500 font-medium">Total Clients</p><h3 className="text-2xl font-bold">{clients.length}</h3></div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center"><Calendar size={24}/></div>
                  <div><p className="text-sm text-slate-500 font-medium">Pending Inquiries</p><h3 className="text-2xl font-bold">{bookings.filter(b => b.status === 'Pending').length}</h3></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-20">
                <CheckCircle size={48} className="mx-auto text-emerald-500 mb-4 opacity-50" />
                <h2 className="text-xl font-bold mb-2">Welcome back, {user.email.split('@')[0]}</h2>
                <p className="text-slate-500 max-w-md mx-auto">Your portfolio is up and running. Use the sidebar to manage your content, projects, and client inquiries.</p>
              </div>
            </div>
          )}

          {/* 🟢 Tab 2: Form (Add/Edit) */}
          {isFormOpen && activeTab !== "overview" && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg mb-8 relative">
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><X size={20}/></button>
              <h2 className="text-lg font-bold mb-6">{editingId ? "Edit Item" : "Add New Item"}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === "projects" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Project Title" className="input" required value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    <input type="text" placeholder="Category (e.g., Branding, Video)" className="input" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    <input type="text" placeholder="Year (e.g., 2024)" className="input" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                    <input type="text" placeholder="Background Color (Hex)" className="input" value={formData.bg_color || '#1a1917'} onChange={(e) => setFormData({...formData, bg_color: e.target.value})} />
                    <textarea placeholder="Description" className="input md:col-span-2" rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                    <select className="input" value={formData.type || 'image'} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                      <option value="image">Image</option>
                      <option value="video">Video</option>
                    </select>
                    <input type="file" accept="image/*,video/*" className="input" onChange={(e) => setFile(e.target.files[0])} required={!editingId} />
                  </div>
                )}

                {activeTab === "brands" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Brand Name" className="input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="number" step="0.1" placeholder="Logo Size Multiplier (e.g., 1.2)" className="input" value={formData.size || '1'} onChange={(e) => setFormData({...formData, size: e.target.value})} />
                    <div className="md:col-span-2">
                      <label className="block text-sm text-slate-500 mb-2">Upload Logo (PNG recommended)</label>
                      <input type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files[0])} required={!editingId} />
                    </div>
                  </div>
                )}

                {activeTab === "clients" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Client Name" className="input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="email" placeholder="Email" className="input" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                    <input type="text" placeholder="Phone (e.g., 971501234567)" className="input" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    <input type="text" placeholder="Company" className="input" value={formData.company || ''} onChange={(e) => setFormData({...formData, company: e.target.value})} />
                  </div>
                )}

                {activeTab === "packages" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Package Name (e.g., Gold)" className="input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    <input type="number" placeholder="Price ($)" className="input" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} />
                    <input type="text" placeholder="Features (comma separated)" className="input md:col-span-2" value={formData.features || ''} onChange={(e) => setFormData({...formData, features: e.target.value})} />
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <select className="input" required value={formData.client_id || ''} onChange={(e) => setFormData({...formData, client_id: e.target.value})}>
                      <option value="">Select Client</option>
                      {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select className="input" value={formData.package_id || ''} onChange={(e) => setFormData({...formData, package_id: e.target.value})}>
                      <option value="">Select Package (Optional)</option>
                      {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    <input type="date" className="input" required value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
                    <input type="time" className="input" required value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                    <textarea placeholder="Notes" className="input md:col-span-2" rows="2" value={formData.notes || ''} onChange={(e) => setFormData({...formData, notes: e.target.value})}></textarea>
                    <select className="input md:col-span-2" value={formData.status || 'Pending'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="Key (e.g., hero_subtitle)" className="input md:col-span-2" required disabled={editingId} value={formData.key || ''} onChange={(e) => setFormData({...formData, key: e.target.value})} />
                    <textarea placeholder="Content Value" className="input md:col-span-2" rows="3" required value={formData.value || ''} onChange={(e) => setFormData({...formData, value: e.target.value})}></textarea>
                  </div>
                )}

                <button type="submit" disabled={loading} className="btn-primary mt-4 w-full md:w-auto px-8">
                  {loading ? "Saving..." : "Save Data"}
                </button>
              </form>
            </motion.div>
          )}

          {/* 🟢 Tab 3: Data Tables */}
          {activeTab !== "overview" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Details</th>
                      <th className="p-4 font-semibold hidden md:table-cell">Info</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    
                    {/* Projects Table */}
                    {activeTab === "projects" && projects.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{p.title}</p>
                          <p className="text-xs text-slate-500">{p.category} • {p.year}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md uppercase font-semibold">{p.type}</span>
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenForm(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16}/></button>
                          <button onClick={() => handleDelete("projects", p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}

                    {/* Brands Table */}
                    {activeTab === "brands" && brands.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex items-center justify-center border border-slate-200 p-1">
                            <img src={b.logo_url} alt={b.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <p className="font-bold text-slate-800">{b.name}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm text-slate-500">Size: {b.size}x</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenForm(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16}/></button>
                          <button onClick={() => handleDelete("brands", b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}

                    {/* Bookings / Inquiries Table */}
                    {activeTab === "bookings" && bookings.map(b => (
                      <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{b.clients?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500">{b.date} at {b.time}</p>
                          <p className="text-xs font-mono mt-1 text-slate-400">Pkg: {b.packages?.name || 'None'}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell">
                          <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="p-4 text-right space-x-2 flex justify-end">
                          {b.clients?.phone && (
                            <a href={`https://wa.me/${b.clients.phone.replace(/[^0-9]/g, '')}?text=Hello ${b.clients.name}, thanks for reaching out to Kohedroo.`} target="_blank" rel="noreferrer" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Reply via WhatsApp">
                              <MessageSquare size={16}/>
                            </a>
                          )}
                          <button onClick={() => handleOpenForm(b)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16}/></button>
                          <button onClick={() => handleDelete("bookings", b.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}

                    {/* Clients Table */}
                    {activeTab === "clients" && clients.map(c => (
                      <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-500">{c.email || 'No email'}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm text-slate-500">{c.phone || 'No phone'}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenForm(c)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16}/></button>
                          <button onClick={() => handleDelete("clients", c.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}

                    {/* Packages Table */}
                    {activeTab === "packages" && packages.map(p => (
                      <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800">{p.name}</p>
                          <p className="text-xs text-slate-500">${p.price}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell text-xs text-slate-500 max-w-xs truncate">
                          {p.features?.join(' • ')}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenForm(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16}/></button>
                          <button onClick={() => handleDelete("packages", p.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}

                    {/* Site Content Table */}
                    {activeTab === "content" && siteContent.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4">
                          <p className="font-bold text-slate-800 flex items-center gap-2"><LinkIcon size={14} className="text-slate-400"/> {item.key}</p>
                        </td>
                        <td className="p-4 hidden md:table-cell text-sm text-slate-500 max-w-md truncate">
                          {item.value}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenForm(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Pencil size={16}/></button>
                          <button onClick={() => handleDelete("site_content", item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}

                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}