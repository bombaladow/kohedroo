"use client";
import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { 
  LayoutDashboard, Image as ImageIcon, Briefcase, Users, 
  Calendar, Settings, LogOut, Plus, Pencil, Trash2, 
  MessageSquare, Menu, X, CheckCircle, TrendingUp, Link as LinkIcon, UserCircle, Search, GripVertical, Download, Database
} from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { toast } from 'sonner';
import imageCompression from 'browser-image-compression';
import ConfirmModal from "@/components/ConfirmModal";
import ImageLightbox from "@/components/ImageLightbox";
import { useLoading } from "@/lib/LoadingContext";

// مكون الحالة الفارغة (Empty State)
const EmptyState = ({ icon: Icon, title, description, btnText, onClick }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
    <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
      <Icon size={40} />
    </div>
    <h3 className="text-2xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
      {description}
    </p>
    <button 
      onClick={onClick} 
      className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
    >
      <Plus size={18} /> {btnText}
    </button>
  </div>
);

export default function AdminDashboard() {
  const { setIsDataLoaded } = useLoading();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();

  const [projects, setProjects] = useState([]);
  const [brands, setBrands] = useState([]);
  const [clients, setClients] = useState([]);
  const [packages, setPackages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [siteContent, setSiteContent] = useState({});
  
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmState, setConfirmState] = useState({ isOpen: false, title: "", message: "", action: null, isDestructive: true });
  const [lightboxImage, setLightboxImage] = useState(null);

  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setIsDataLoaded(true);
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) router.push("/login");
      else {
        setUser(session.user);
        fetchAllData();
      }
    };
    checkUser();
  }, [router, setIsDataLoaded]);

  const fetchAllData = async () => {
    const [proj, brnd, cli, pkg, book, content] = await Promise.all([
      supabase.from("projects").select("*").order("sort_order", { ascending: true }),
      supabase.from("brands").select("*").order("sort_order", { ascending: true }),
      supabase.from("clients").select("*").order("created_at", { ascending: false }),
      supabase.from("packages").select("*").order("sort_order", { ascending: true }),
      supabase.from("bookings").select(`*, clients(name, phone), packages(name)`).order("created_at", { ascending: false }),
      supabase.from("site_content").select("*")
    ]);

    setProjects(proj.data || []);
    setBrands(brnd.data || []);
    setClients(cli.data || []);
    setPackages(pkg.data || []);
    setBookings(book.data || []);
    
    const contentObj = {};
    content.data?.forEach(item => contentObj[item.key] = item.value);
    setSiteContent(contentObj);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({});
    setFile(null);
    setEditingId(null);
    setIsFormOpen(false);
    setIsSidebarOpen(false);
    setSearchQuery("");
  };

  const handleOpenForm = (data = null) => {
    if (data) {
      setFormData(data);
      if (data.features) setFormData(prev => ({ ...prev, features: data.features.join(', ') }));
      setEditingId(data.id);
    } else {
      const defaults = {};
      if (activeTab === "projects") defaults.type = "image";
      if (activeTab === "bookings") defaults.status = "Pending";
      if (activeTab === "brands") defaults.size = 1;
      setFormData(defaults);
      setEditingId(null);
    }
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const uploadMedia = async (file, bucket = 'portfolio-media') => {
    let fileToUpload = file;
    if (file.type.startsWith('image/')) {
      try {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        fileToUpload = await imageCompression(file, options);
      } catch (error) {
        console.warn("Image compression failed", error);
      }
    }

    const fileExt = fileToUpload.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, fileToUpload);
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
        if (!editingId) data.sort_order = projects.length;
        if (editingId) await supabase.from("projects").update(data).eq("id", editingId);
        else await supabase.from("projects").insert([data]);
      } 
      else if (activeTab === "brands") {
        const data = { ...formData };
        if (uploadedUrl) data.logo_url = uploadedUrl;
        data.size = parseFloat(formData.size) || 1;
        if (!editingId) data.sort_order = brands.length;
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
        if (!editingId) data.sort_order = packages.length;
        if (editingId) await supabase.from("packages").update(data).eq("id", editingId);
        else await supabase.from("packages").insert([data]);
      } 
      else if (activeTab === "bookings") {
        if (editingId) await supabase.from("bookings").update(formData).eq("id", editingId);
        else await supabase.from("bookings").insert([formData]);
      } 
      else if (activeTab === "content") {
        for (const [key, value] of Object.entries(formData)) {
          await supabase.from("site_content").upsert({ key, value }, { onConflict: 'key' });
        }
      }
      else if (activeTab === "about") {
        const contentUpdates = {
          about_title: formData.about_title,
          about_bio: formData.about_bio,
          about_skills: formData.about_skills,
          stat_years: formData.stat_years,
          stat_projects: formData.stat_projects,
        };
        if (uploadedUrl) contentUpdates.about_image = uploadedUrl;
        for (const [key, value] of Object.entries(contentUpdates)) {
          if (value) await supabase.from("site_content").upsert({ key, value }, { onConflict: 'key' });
        }
      }

      toast.success(editingId ? "Updated successfully!" : "Saved successfully!");
      setIsFormOpen(false);
      fetchAllData();
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (table, id, name) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Item",
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      isDestructive: true,
      action: async () => {
        try {
          await supabase.from(table).delete().eq("id", id);
          fetchAllData();
          toast.success("Deleted successfully");
        } catch (error) {
          toast.error("Error deleting: " + error.message);
        }
      }
    });
  };

  const handleReorder = async (table, newOrder) => {
    if (table === "projects") setProjects(newOrder);
    if (table === "brands") setBrands(newOrder);
    if (table === "packages") setPackages(newOrder);

    const updates = newOrder.map((item, index) => ({ id: item.id, sort_order: index }));
    for (const update of updates) {
      await supabase.from(table).update({ sort_order: update.sort_order }).eq("id", update.id);
    }
  };

  const exportClientsToCSV = () => {
    if (clients.length === 0) return toast.error("No clients to export");
    
    const headers = ["Name", "Email", "Phone", "Company", "Status", "Date Joined"];
    const csvData = clients.map(c => [
      `"${c.name || ''}"`,
      `"${c.email || ''}"`,
      `"${c.phone || ''}"`,
      `"${c.company || ''}"`,
      `"${c.status || ''}"`,
      `"${new Date(c.created_at).toLocaleDateString()}"`
    ]);

    const csvContent = [headers.join(","), ...csvData.map(row => row.join(","))].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `kohedroo_clients_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Clients exported successfully!");
  };

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;
    const q = searchQuery.toLowerCase();
    return projects.filter(p => p.title?.toLowerCase().includes(q) || p.category?.toLowerCase().includes(q));
  }, [projects, searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const q = searchQuery.toLowerCase();
    return clients.filter(c => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q) || c.phone?.includes(q));
  }, [clients, searchQuery]);

  if (!user) return <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">Loading Dashboard...</div>;

  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "about", label: "About Section", icon: UserCircle },
    { id: "brands", label: "Brands & Logos", icon: ImageIcon },
    { id: "bookings", label: "Inquiries", icon: MessageSquare },
    { id: "clients", label: "Clients", icon: Users },
    { id: "packages", label: "Packages", icon: TrendingUp },
    { id: "content", label: "Site Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-800" dir="ltr">
      
      <ConfirmModal 
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ ...confirmState, isOpen: false })}
        onConfirm={confirmState.action}
        title={confirmState.title}
        message={confirmState.message}
        isDestructive={confirmState.isDestructive}
      />

      <ImageLightbox 
        isOpen={!!lightboxImage} 
        onClose={() => setLightboxImage(null)} 
        imageUrl={lightboxImage} 
      />

      {isSidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsSidebarOpen(false)} />}

      {/* السايدبار بقى ثابت (sticky) وطوله قد الشاشة عشان يظبط السكرول */}
      <div className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-slate-900 text-slate-300 transform transition-transform duration-300 flex flex-col ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
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

      {/* المحتوى الرئيسي شيلنا منه overflow-y-auto عشان السكرول يشتغل طبيعي */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setIsSidebarOpen(true)} className="md:hidden p-2 bg-slate-100 rounded-lg"><Menu size={20}/></button>
            <h1 className="text-xl font-bold text-slate-800 capitalize hidden md:block">{activeTab}</h1>
            
            <div className="relative max-w-md w-full ml-4 hidden md:block">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search projects, clients..." 
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            {activeTab !== "overview" && activeTab !== "about" && activeTab !== "content" && (
              <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                <Plus size={16} /> <span className="hidden sm:inline">Add New</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
              {user.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8">
          {/* ... (باقي الكود بتاع الـ Overview والفورم والقوائم زي ما هو بالظبط من الرسالة اللي فاتت) ... */}
          {/* عشان الكود ميبقاش طويل جداً، أنا مش هعيد كتابة الـ forms والـ tables تاني، هي هي نفسها اللي في الرسالة اللي فاتت بالظبط، بس إنت خد الملف ده كامل من هنا لتحت */}
          
          {/* ... (نفس كود الـ Overview) ... */}
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
               <p className="text-slate-500 max-w-md mx-auto">Your portfolio is up and running. Use the sidebar to manage your content.</p>
             </div>
           </div>
          )}

          {/* ... (نفس كود الـ Form) ... */}
          {isFormOpen && activeTab !== "overview" && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg mb-8 relative">
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-colors"><X size={20}/></button>
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                {editingId ? <Pencil size={20}/> : <Plus size={20}/>} 
                {editingId ? "Edit Item" : (activeTab === "about" ? "Edit About Section" : "Add New Item")}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {activeTab === "about" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Profile Image</label>
                      <input type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files[0])} />
                      {siteContent.about_image && <p className="text-xs text-emerald-500 mt-1">Image already uploaded. Upload a new one to replace.</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Main Headline</label>
                      <input type="text" placeholder="Crafting visual stories..." className="input" required value={formData.about_title || ''} onChange={(e) => setFormData({...formData, about_title: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Bio / Description</label>
                      <textarea placeholder="I am an Art Director..." className="input" rows="4" required value={formData.about_bio || ''} onChange={(e) => setFormData({...formData, about_bio: e.target.value})}></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Skills (Separated by comma)</label>
                      <input type="text" placeholder="Art Direction, AI Videos, Branding" className="input" required value={formData.about_skills || ''} onChange={(e) => setFormData({...formData, about_skills: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Stat: Years Experience</label>
                      <input type="text" placeholder="13+" className="input" required value={formData.stat_years || ''} onChange={(e) => setFormData({...formData, stat_years: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Stat: Projects Done</label>
                      <input type="text" placeholder="100+" className="input" required value={formData.stat_projects || ''} onChange={(e) => setFormData({...formData, stat_projects: e.target.value})} />
                    </div>
                  </div>
                )}

                {activeTab === "projects" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Project Title *</label>
                      <input type="text" placeholder="e.g. Joyalukkas Campaign" className="input" required value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Brand (Company)</label>
                      <select className="input" value={formData.brand_id || ''} onChange={(e) => setFormData({...formData, brand_id: e.target.value})}>
                        <option value="">Select Brand (Optional)</option>
                        {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Category</label>
                      <input type="text" placeholder="e.g. Video, Branding" className="input" value={formData.category || ''} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
                      <input type="text" placeholder="2024" className="input" value={formData.year || ''} onChange={(e) => setFormData({...formData, year: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                      <textarea placeholder="What was this project about?" className="input" rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Type</label>
                      <select className="input" value={formData.type || 'image'} onChange={(e) => setFormData({...formData, type: e.target.value})}>
                        <option value="image">Image</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Media</label>
                      <input type="file" accept="image/*,video/*" className="input" onChange={(e) => setFile(e.target.files[0])} required={!editingId} />
                    </div>
                  </div>
                )}

                {activeTab === "brands" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Brand Name *</label>
                      <input type="text" placeholder="e.g. Joyalukkas" className="input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Size Multiplier (0.5 to 2)</label>
                      <input type="number" step="0.1" placeholder="1" className="input" value={formData.size || '1'} onChange={(e) => setFormData({...formData, size: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Description (Case Study)</label>
                      <textarea placeholder="Short description about the work done for this brand..." className="input" rows="3" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})}></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Upload Logo *</label>
                      <input type="file" accept="image/*" className="input" onChange={(e) => setFile(e.target.files[0])} required={!editingId} />
                    </div>
                  </div>
                )}

                {activeTab === "clients" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Client Name *</label><input type="text" placeholder="Name" className="input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Email</label><input type="email" placeholder="Email" className="input" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label><input type="text" placeholder="Phone" className="input" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Company</label><input type="text" placeholder="Company" className="input" value={formData.company || ''} onChange={(e) => setFormData({...formData, company: e.target.value})} /></div>
                  </div>
                )}

                {activeTab === "packages" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Package Name *</label><input type="text" placeholder="e.g. Gold Package" className="input" required value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Price ($)</label><input type="number" placeholder="500" className="input" value={formData.price || ''} onChange={(e) => setFormData({...formData, price: e.target.value})} /></div>
                    <div className="md:col-span-2"><label className="block text-sm font-semibold text-slate-700 mb-2">Features (comma separated)</label><input type="text" placeholder="Logo Design, Social Media Kit, 2 Revisions" className="input" value={formData.features || ''} onChange={(e) => setFormData({...formData, features: e.target.value})} /></div>
                  </div>
                )}

                {activeTab === "bookings" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Client *</label>
                      <select className="input" required value={formData.client_id || ''} onChange={(e) => setFormData({...formData, client_id: e.target.value})}>
                        <option value="">Select Client</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Package</label>
                      <select className="input" value={formData.package_id || ''} onChange={(e) => setFormData({...formData, package_id: e.target.value})}>
                        <option value="">Select Package</option>
                        {packages.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                      </select>
                    </div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Date *</label><input type="date" className="input" required value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} /></div>
                    <div><label className="block text-sm font-semibold text-slate-700 mb-2">Time *</label><input type="time" className="input" required value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} /></div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                      <select className="input" value={formData.status || 'Pending'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTab === "content" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Key (e.g. hero_subtitle)</label>
                      <input type="text" placeholder="Key" className="input" required disabled={editingId} value={formData.key || ''} onChange={(e) => setFormData({...formData, key: e.target.value})} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">Value</label>
                      <textarea placeholder="Content Value" className="input" rows="3" required value={formData.value || ''} onChange={(e) => setFormData({...formData, value: e.target.value})}></textarea>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button type="submit" disabled={loading} className="btn-primary flex-1 md:flex-none px-8">
                    {loading ? "Saving..." : "Save Data"}
                  </button>
                  <button type="button" onClick={() => setIsFormOpen(false)} className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ... (نفس كود الـ Lists) ... */}
          {activeTab !== "overview" && activeTab !== "about" && activeTab !== "content" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
              
              {activeTab === "projects" && (
                projects.length === 0 && !isFormOpen ? (
                  <EmptyState icon={Briefcase} title="No Projects Yet" description="Start building your portfolio by adding your first project. You can upload an image or video." btnText="Add First Project" onClick={() => handleOpenForm()} />
                ) : (
                  <Reorder.Group axis="y" values={filteredProjects} onReorder={(newOrder) => handleReorder("projects", newOrder)} className="space-y-3">
                    {filteredProjects.map((p) => (
                      <Reorder.Item key={p.id} value={p} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <GripVertical size={20} className="text-slate-300" />
                          <div className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLightboxImage(p.media_url)}>
                            {p.type === 'video' ? (
                               <div className="w-full h-full flex items-center justify-center bg-black text-white"><Briefcase size={16}/></div>
                            ) : (
                               <img src={p.media_url} alt={p.title} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{p.title}</p>
                            <p className="text-xs text-slate-500">{p.category} • {p.year}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenForm(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={16}/></button>
                          <button onClick={() => handleDeleteClick("projects", p.id, p.title)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )
              )}

              {activeTab === "brands" && (
                brands.length === 0 && !isFormOpen ? (
                  <EmptyState icon={ImageIcon} title="No Brands Added Yet" description="Add the companies and brands you have worked with. They will appear on the homepage." btnText="Add First Brand" onClick={() => handleOpenForm()} />
                ) : (
                  <Reorder.Group axis="y" values={brands} onReorder={(newOrder) => handleReorder("brands", newOrder)} className="space-y-3">
                    {brands.map((b) => (
                      <Reorder.Item key={b.id} value={b} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <GripVertical size={20} className="text-slate-300" />
                          <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setLightboxImage(b.logo_url)}>
                            <img src={b.logo_url} alt={b.name} className="max-w-full max-h-full object-contain" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{b.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[200px]">{b.description || 'No description'}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenForm(b)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={16}/></button>
                          <button onClick={() => handleDeleteClick("brands", b.id, b.name)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )
              )}

              {activeTab === "packages" && (
                packages.length === 0 && !isFormOpen ? (
                  <EmptyState icon={TrendingUp} title="No Packages Yet" description="Create pricing packages for your clients to choose from when they book a call." btnText="Add First Package" onClick={() => handleOpenForm()} />
                ) : (
                  <Reorder.Group axis="y" values={packages} onReorder={(newOrder) => handleReorder("packages", newOrder)} className="space-y-3">
                    {packages.map((p) => (
                      <Reorder.Item key={p.id} value={p} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors">
                        <div className="flex items-center gap-4">
                          <GripVertical size={20} className="text-slate-300" />
                          <div>
                            <p className="font-bold text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-500">${p.price}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleOpenForm(p)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={16}/></button>
                          <button onClick={() => handleDeleteClick("packages", p.id, p.name)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                        </div>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                )
              )}

              {activeTab === "clients" && (
                clients.length === 0 && !isFormOpen ? (
                  <EmptyState icon={Users} title="No Clients Yet" description="Clients who book calls or inquire will appear here automatically. You can also add them manually." btnText="Add First Client" onClick={() => handleOpenForm()} />
                ) : (
                  <>
                    <div className="flex justify-end mb-4">
                      <button onClick={exportClientsToCSV} className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors">
                        <Download size={16} /> Export CSV
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Name</th>
                            <th className="p-4 font-semibold">Email</th>
                            <th className="p-4 font-semibold">Phone</th>
                            <th className="p-4 font-semibold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {filteredClients.map((c) => (
                            <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                              <td className="p-4 font-bold text-slate-800">{c.name}</td>
                              <td className="p-4 text-sm text-slate-600">{c.email || '-'}</td>
                              <td className="p-4 text-sm text-slate-600">{c.phone || '-'}</td>
                              <td className="p-4 text-right space-x-2">
                                <button onClick={() => handleOpenForm(c)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={16}/></button>
                                <button onClick={() => handleDeleteClick("clients", c.id, c.name)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                )
              )}

              {activeTab === "bookings" && (
                bookings.length === 0 && !isFormOpen ? (
                  <EmptyState icon={MessageSquare} title="No Inquiries Yet" description="When clients book a call or submit a project request, their details will appear here." btnText="Add Manual Inquiry" onClick={() => handleOpenForm()} />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                          <th className="p-4 font-semibold">Client</th>
                          <th className="p-4 font-semibold">Date</th>
                          <th className="p-4 font-semibold">Status</th>
                          <th className="p-4 font-semibold text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {bookings.map((b) => (
                          <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="p-4">
                              <p className="font-bold text-slate-800">{b.clients?.name || 'Unknown'}</p>
                              <p className="text-xs text-slate-500">{b.packages?.name || 'No Package'}</p>
                            </td>
                            <td className="p-4 text-sm text-slate-600">{b.date} at {b.time}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${b.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : b.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2 flex justify-end">
                              {b.clients?.phone && (
                                <a href={`https://wa.me/${b.clients.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Reply via WhatsApp">
                                  <MessageSquare size={16}/>
                                </a>
                              )}
                              <button onClick={() => handleOpenForm(b)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={16}/></button>
                              <button onClick={() => handleDeleteClick("bookings", b.id, `Booking from ${b.clients?.name}`)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
          )}

          {activeTab === "content" && (
             <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-x-auto">
               <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Site Content (Texts)</h2>
                    <p className="text-sm text-slate-500">Manage every text displayed on your website.</p>
                  </div>
                  <button onClick={() => handleOpenForm()} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm">
                    <Plus size={16} /> Add New Key
                  </button>
               </div>
               {Object.keys(siteContent).length === 0 && !isFormOpen ? (
                 <EmptyState icon={Database} title="No Content Keys" description="Content keys are used to display dynamic text on your website. Click add to create one." btnText="Add New Key" onClick={() => handleOpenForm()} />
               ) : (
               <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Key</th>
                      <th className="p-4 font-semibold">Value</th>
                      <th className="p-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(siteContent).map(([key, value]) => (
                      <tr key={key} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-bold text-slate-800 text-sm">{key}</td>
                        <td className="p-4 text-sm text-slate-600 truncate max-w-xs">{value}</td>
                        <td className="p-4 text-right space-x-2">
                          <button onClick={() => handleOpenForm({ id: key, key: key, value: value })} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"><Pencil size={16}/></button>
                          <button onClick={() => handleDeleteClick("site_content", key, key)} className="p-2 text-red-600 hover:bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
               )}
             </div>
          )}
          
          {activeTab === "about" && !isFormOpen && (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm text-center">
              <UserCircle size={48} className="mx-auto text-indigo-500 mb-4 opacity-50" />
              <h2 className="text-xl font-bold mb-2">About Section</h2>
              <p className="text-slate-500 mb-6">Manage the text, image, and stats in the "Behind the Pixels" section.</p>
              <button onClick={() => handleOpenForm({ ...siteContent, id: 'about' })} className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 inline-flex items-center gap-2 shadow-lg transition-all active:scale-95">
                <Pencil size={18}/> Edit About Section
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}