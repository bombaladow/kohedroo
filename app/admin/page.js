
"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase, supabaseUrl, supabaseAnonKey } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Image as ImageIcon, Briefcase, Users,
  Calendar, Settings, LogOut, Plus, Pencil, Trash2,
  MessageSquare, Menu, X, CheckCircle, TrendingUp, UserCircle,
  Search, GripVertical, Download, Database
} from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { toast } from "sonner";
import imageCompression from "browser-image-compression";
import ConfirmModal from "@/components/ConfirmModal";
import ImageLightbox from "@/components/ImageLightbox";
import { useLoading } from "@/lib/LoadingContext";

// =========================================
// SETTINGS
// =========================================

const MAX_UPLOAD_SIZE = 50 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (!bytes) return "0 MB";

  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${(bytes / 1024).toFixed(0)} KB`;
};

// =========================================
// EMPTY STATE
// =========================================

const EmptyState = ({
  icon: Icon,
  title,
  description,
  btnText,
  onClick
}) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center bg-white rounded-2xl border border-slate-200 shadow-sm">
    <div className="w-20 h-20 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-6">
      <Icon size={40} />
    </div>

    <h3 className="text-2xl font-bold text-slate-800 mb-3">
      {title}
    </h3>

    <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
      {description}
    </p>

    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-black text-white px-8 py-3.5 rounded-xl text-sm font-semibold hover:bg-slate-800 transition-all shadow-lg active:scale-95"
    >
      <Plus size={18} />
      {btnText}
    </button>
  </div>
);

// =========================================
// SUPABASE UPLOAD
// =========================================

const uploadMedia = async (
  file,
  onProgress,
  bucket = "portfolio-media"
) => {
  let f = file;

  // Compress images only
  if (file.type.startsWith("image/")) {
    try {
      f = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      });
    } catch (err) {
      console.warn(
        "Image compression failed, uploading original.",
        err
      );
    }
  }

  const ext = (f.name || file.name).split(".").pop();

  const path = `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${ext}`;

  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("Session expired. Please log in again.");
  }

  await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(
      "POST",
      `${supabaseUrl}/storage/v1/object/${bucket}/${path}`
    );

    xhr.setRequestHeader(
      "Authorization",
      `Bearer ${session.access_token}`
    );

    xhr.setRequestHeader("apikey", supabaseAnonKey);

    xhr.setRequestHeader(
      "Content-Type",
      f.type || "application/octet-stream"
    );

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        onProgress?.(
          Math.round((e.loaded / e.total) * 100)
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            xhr.responseText || `HTTP ${xhr.status}`
          )
        );
      }
    };

    xhr.onerror = () => reject(
      new Error("Network error")
    );

    xhr.send(f);
  });

  return supabase.storage
    .from(bucket)
    .getPublicUrl(path).data.publicUrl;
};

// =========================================
// VIDEO POSTER
// =========================================

const makePoster = (file) =>
  new Promise((resolve) => {
    const v = document.createElement("video");
    const objectUrl = URL.createObjectURL(file);

    let done = false;

    const finish = (blob) => {
      if (done) return;

      done = true;
      URL.revokeObjectURL(objectUrl);
      resolve(blob);
    };

    v.muted = true;
    v.playsInline = true;
    v.preload = "metadata";
    v.src = objectUrl;

    v.onloadeddata = () => {
      v.currentTime = Math.min(
        1,
        (v.duration || 2) / 2
      );
    };

    v.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");

        canvas.width = v.videoWidth;
        canvas.height = v.videoHeight;

        canvas.getContext("2d").drawImage(
          v,
          0,
          0
        );

        canvas.toBlob(
          (blob) => finish(blob),
          "image/jpeg",
          0.8
        );
      } catch {
        finish(null);
      }
    };

    v.onerror = () => finish(null);

    setTimeout(() => finish(null), 8000);
  });

// =========================================
// SINGLE FILE DROPZONE
// =========================================

const DropZone = ({
  accept,
  label,
  currentUrl,
  onDone,
  onBusy
}) => {
  const [progress, setProgress] = useState(null);
  const [over, setOver] = useState(false);

  const handle = async (file) => {
    if (!file) return;

    setProgress(0);
    onBusy?.(true);

    try {
      const url = await uploadMedia(
        file,
        setProgress
      );

      await onDone(url, file);

      toast.success("Uploaded!");
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setProgress(null);
      onBusy?.(false);
    }
  };

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setOver(false);
        handle(e.dataTransfer.files[0]);
      }}
      className={`block cursor-pointer rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
        over
          ? "border-indigo-500 bg-indigo-50"
          : "border-slate-300 hover:border-slate-400"
      }`}
    >
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          handle(e.target.files[0]);
          e.target.value = "";
        }}
      />

      {progress !== null ? (
        <div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-indigo-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-xs text-slate-500">
            {progress === 100
              ? "Finishing..."
              : `${progress}%`}
          </p>
        </div>
      ) : currentUrl ? (
        <p className="text-sm text-emerald-600 font-semibold">
          File ready. Drop a new one to replace.
        </p>
      ) : (
        <p className="text-sm text-slate-500">
          {label}
        </p>
      )}
    </label>
  );
};

// =========================================
// DASHBOARD
// =========================================

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

  const [confirmState, setConfirmState] = useState({
    isOpen: false,
    title: "",
    message: "",
    action: null,
    isDestructive: true
  });

  const [lightboxImage, setLightboxImage] = useState(null);

  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // BULK UPLOAD STATES
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [bulkProgress, setBulkProgress] = useState(0);

  const isUploading = uploadingCount > 0;

  const trackBusy = (busy) =>
    setUploadingCount((c) =>
      Math.max(0, c + (busy ? 1 : -1))
    );

  const selectedTotalSize = useMemo(
    () =>
      selectedFiles.reduce(
        (total, file) => total + file.size,
        0
      ),
    [selectedFiles]
  );

  const selectedPercentage = Math.min(
    100,
    (selectedTotalSize / MAX_UPLOAD_SIZE) * 100
  );

  // =========================================
  // BULK FILE SELECTION
  // =========================================

  const handleBulkFileSelection = (fileList) => {
    const incoming = Array.from(fileList || []);

    if (!incoming.length) return;

    const invalidFiles = incoming.filter(
      (file) =>
        !file.type.startsWith("image/") &&
        !file.type.startsWith("video/")
    );

    if (invalidFiles.length) {
      toast.error(
        "Only images and videos are allowed."
      );
      return;
    }

    const combined = [
      ...selectedFiles,
      ...incoming
    ];

    // Prevent duplicate files
    const uniqueFiles = combined.filter(
      (file, index, array) =>
        array.findIndex(
          (item) =>
            item.name === file.name &&
            item.size === file.size &&
            item.lastModified === file.lastModified
        ) === index
    );

    const totalSize = uniqueFiles.reduce(
      (total, file) => total + file.size,
      0
    );

    if (totalSize > MAX_UPLOAD_SIZE) {
      toast.error(
        `Upload limit is 50 MB. Selected files total: ${formatFileSize(totalSize)}`
      );
      return;
    }

    setSelectedFiles(uniqueFiles);
  };

  const removeBulkFile = (index) => {
    setSelectedFiles((current) =>
      current.filter((_, i) => i !== index)
    );
  };

  // =========================================
  // AUTH
  // =========================================

  useEffect(() => {
    setIsDataLoaded(true);

    const checkUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
      } else {
        const ALLOWED_EMAILS = [
          "mahmoudabdelaziz20378@gmail.com",
          "bombaladow@gmail.com",
          "kohedroo@gmail.com"
        ];

        if (
          !ALLOWED_EMAILS.includes(session.user.email)
        ) {
          await supabase.auth.signOut();
          router.push("/login");

          toast.error(
            "Unauthorized access. You are not an admin."
          );

          return;
        }

        setUser(session.user);
        fetchAllData();
      }
    };

    checkUser();
  }, [router, setIsDataLoaded]);

  // =========================================
  // FETCH DATA
  // =========================================

  const fetchAllData = async () => {
    const [
      proj,
      brnd,
      cli,
      pkg,
      book,
      content
    ] = await Promise.all([
      supabase
        .from("projects")
        .select("*")
        .order("sort_order", { ascending: true }),

      supabase
        .from("brands")
        .select("*")
        .order("sort_order", { ascending: true }),

      supabase
        .from("clients")
        .select("*")
        .order("created_at", { ascending: false }),

      supabase
        .from("packages")
        .select("*")
        .order("sort_order", { ascending: true }),

      supabase
        .from("bookings")
        .select("*, clients(name, phone), packages(name)")
        .order("created_at", { ascending: false }),

      supabase
        .from("site_content")
        .select("*")
    ]);

    setProjects(proj.data || []);
    setBrands(brnd.data || []);
    setClients(cli.data || []);
    setPackages(pkg.data || []);
    setBookings(book.data || []);

    const contentObj = {};

    content.data?.forEach((item) => {
      contentObj[item.key] = item.value;
    });

    setSiteContent(contentObj);
  };

  // =========================================
  // FORM CONTROLS
  // =========================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({});
    setEditingId(null);
    setIsFormOpen(false);
    setIsSidebarOpen(false);
    setSearchQuery("");
    setSelectedFiles([]);
    setBulkProgress(0);
  };

  const handleOpenForm = (data = null) => {
    setSelectedFiles([]);
    setBulkProgress(0);

    if (data) {
      const next = { ...data };

      if (Array.isArray(data.features)) {
        next.features = data.features.join(", ");
      }

      setFormData(next);
      setEditingId(data.id);
    } else {
      const defaults = {};

      if (activeTab === "projects") {
        defaults.type = "image";
      }

      if (activeTab === "bookings") {
        defaults.status = "Pending";
      }

      if (activeTab === "brands") {
        defaults.size = 1;
      }

      setFormData(defaults);
      setEditingId(null);
    }

    setIsFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // =========================================
  // BULK PROJECT UPLOAD
  // =========================================

  const handleBulkUpload = async () => {
    if (!selectedFiles.length) {
      throw new Error("Please select files first.");
    }

    if (!formData.brand_id) {
      throw new Error("Please select a brand first.");
    }

    const totalBytes = selectedFiles.reduce(
      (total, file) => total + file.size,
      0
    );

    if (totalBytes > MAX_UPLOAD_SIZE) {
      throw new Error(
        "Total upload size cannot exceed 50 MB."
      );
    }

    const uploadedProjects = [];

    let completedBytes = 0;

    setBulkProgress(0);

    for (
      let index = 0;
      index < selectedFiles.length;
      index++
    ) {
      const file = selectedFiles[index];

      // Upload original media
      const fileUrl = await uploadMedia(
        file,
        (percentage) => {
          const currentBytes =
            completedBytes +
            (file.size * percentage) / 100;

          const overallProgress = Math.round(
            (currentBytes / totalBytes) * 100
          );

          setBulkProgress(overallProgress);
        }
      );

      let projectData;

      if (file.type.startsWith("video/")) {
        // Create video poster
        const poster = await makePoster(file);

        let posterUrl = null;

        if (poster) {
          try {
            posterUrl = await uploadMedia(
              new File(
                [poster],
                "poster.jpg",
                { type: "image/jpeg" }
              )
            );
          } catch (err) {
            console.warn(
              "Poster upload failed:",
              err
            );
          }
        }

        projectData = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: "video",
          video_url: fileUrl,
          media_url: posterUrl || fileUrl,
          brand_id: formData.brand_id,
          sort_order: projects.length + index
        };
      } else {
        projectData = {
          title: file.name.replace(/\.[^/.]+$/, ""),
          type: "image",
          video_url: null,
          media_url: fileUrl,
          brand_id: formData.brand_id,
          sort_order: projects.length + index
        };
      }

      uploadedProjects.push(projectData);

      completedBytes += file.size;

      setBulkProgress(
        Math.round(
          (completedBytes / totalBytes) * 100
        )
      );
    }

    // Save all projects in one database request
    const { error } = await supabase
      .from("projects")
      .insert(uploadedProjects);

    if (error) throw error;

    return uploadedProjects.length;
  };

  // =========================================
  // SAVE FORM
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isUploading) {
      return toast.error(
        "Please wait for the upload to finish."
      );
    }

    setLoading(true);

    try {
      if (activeTab === "projects") {
        // BULK UPLOAD - NEW PROJECTS
        if (!editingId && selectedFiles.length > 0) {
          const uploadedCount =
            await handleBulkUpload();

          toast.success(
            `${uploadedCount} projects uploaded successfully!`
          );

          setIsFormOpen(false);
          setFormData({});
          setSelectedFiles([]);
          setBulkProgress(0);

          await fetchAllData();
          return;
        }

        // SINGLE PROJECT / EDIT
        if (!formData.media_url) {
          throw new Error(
            "Please upload an image or video first."
          );
        }

        const data = { ...formData };

        if (!editingId) {
          data.sort_order = projects.length;
        }

        const res = editingId
          ? await supabase
              .from("projects")
              .update(data)
              .eq("id", editingId)
          : await supabase
              .from("projects")
              .insert([data]);

        if (res.error) throw res.error;
      }

      else if (activeTab === "brands") {
        if (!formData.logo_url) {
          throw new Error(
            "Please upload the brand logo first."
          );
        }

        const data = {
          ...formData,
          size: parseFloat(formData.size) || 1
        };

        if (!editingId) {
          data.sort_order = brands.length;
        }

        const res = editingId
          ? await supabase
              .from("brands")
              .update(data)
              .eq("id", editingId)
          : await supabase
              .from("brands")
              .insert([data]);

        if (res.error) throw res.error;
      }

      else if (activeTab === "clients") {
        const res = editingId
          ? await supabase
              .from("clients")
              .update(formData)
              .eq("id", editingId)
          : await supabase
              .from("clients")
              .insert([formData]);

        if (res.error) throw res.error;
      }

      else if (activeTab === "packages") {
        const featuresArray = formData.features
          ? formData.features
              .split(",")
              .map((f) => f.trim())
              .filter(Boolean)
          : [];

        const data = {
          ...formData,
          features: featuresArray
        };

        if (!editingId) {
          data.sort_order = packages.length;
        }

        const res = editingId
          ? await supabase
              .from("packages")
              .update(data)
              .eq("id", editingId)
          : await supabase
              .from("packages")
              .insert([data]);

        if (res.error) throw res.error;
      }

      else if (activeTab === "bookings") {
        const data = {
          client_id: formData.client_id,
          package_id: formData.package_id || null,
          date: formData.date,
          time: formData.time,
          status: formData.status || "Pending",
          notes: formData.notes || null
        };

        const res = editingId
          ? await supabase
              .from("bookings")
              .update(data)
              .eq("id", editingId)
          : await supabase
              .from("bookings")
              .insert([data]);

        if (res.error) throw res.error;
      }

      else if (activeTab === "content") {
        const res = await supabase
          .from("site_content")
          .upsert(
            {
              key: formData.key,
              value: formData.value
            },
            { onConflict: "key" }
          );

        if (res.error) throw res.error;
      }

      else if (activeTab === "about") {
        const contentUpdates = {
          about_title: formData.about_title,
          about_bio: formData.about_bio,
          about_skills: formData.about_skills,
          stat_years: formData.stat_years,
          stat_projects: formData.stat_projects,
          about_image: formData.about_image
        };

        const rows = Object.entries(contentUpdates)
          .filter(([, value]) => value)
          .map(([key, value]) => ({
            key,
            value
          }));

        const res = await supabase
          .from("site_content")
          .upsert(rows, { onConflict: "key" });

        if (res.error) throw res.error;
      }

      toast.success(
        editingId
          ? "Updated successfully!"
          : "Saved successfully!"
      );

      setIsFormOpen(false);
      setFormData({});
      setEditingId(null);
      setSelectedFiles([]);
      setBulkProgress(0);

      await fetchAllData();

    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDeleteClick = (table, id, name) => {
    setConfirmState({
      isOpen: true,
      title: "Delete Item",
      message: `Are you sure you want to delete "${name}"? This cannot be undone.`,
      isDestructive: true,

      action: async () => {
        try {
          const column =
            table === "site_content" ? "key" : "id";

          const { error } = await supabase
            .from(table)
            .delete()
            .eq(column, id);

          if (error) throw error;

          await fetchAllData();

          toast.success("Deleted successfully");
        } catch (error) {
          toast.error(
            "Error deleting: " + error.message
          );
        }
      }
    });
  };

  // =========================================
  // REORDER
  // =========================================

  const handleReorder = async (table, newOrder) => {
    if (table === "projects") {
      setProjects(newOrder);
    }

    if (table === "brands") {
      setBrands(newOrder);
    }

    if (table === "packages") {
      setPackages(newOrder);
    }

    await Promise.all(
      newOrder.map((item, index) =>
        supabase
          .from(table)
          .update({ sort_order: index })
          .eq("id", item.id)
      )
    );
  };

  // =========================================
  // EXPORT CLIENTS
  // =========================================

  const exportClientsToCSV = () => {
    if (clients.length === 0) {
      return toast.error("No clients to export");
    }

    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Status",
      "Date Joined"
    ];

    const csvData = clients.map((c) => [
      `"${c.name || ""}"`,
      `"${c.email || ""}"`,
      `"${c.phone || ""}"`,
      `"${c.company || ""}"`,
      `"${c.status || ""}"`,
      `"${new Date(c.created_at).toLocaleDateString()}"`
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(","))
    ].join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      { type: "text/csv;charset=utf-8;" }
    );

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;

    link.setAttribute(
      "download",
      `kohedroo_clients_${new Date()
        .toISOString()
        .slice(0, 10)}.csv`
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Clients exported successfully!");
  };

  // =========================================
  // SEARCH
  // =========================================

  const filteredProjects = useMemo(() => {
    if (!searchQuery) return projects;

    const q = searchQuery.toLowerCase();

    return projects.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
    );
  }, [projects, searchQuery]);

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;

    const q = searchQuery.toLowerCase();

    return clients.filter(
      (c) =>
        c.name?.toLowerCase().includes(q) ||
        c.email?.toLowerCase().includes(q) ||
        c.phone?.includes(q)
    );
  }, [clients, searchQuery]);

  // =========================================
  // LOADING
  // =========================================

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 font-bold text-slate-500">
        Loading Dashboard...
      </div>
    );
  }

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard
    },
    {
      id: "projects",
      label: "Projects",
      icon: Briefcase
    },
    {
      id: "about",
      label: "About Section",
      icon: UserCircle
    },
    {
      id: "brands",
      label: "Brands & Logos",
      icon: ImageIcon
    },
    {
      id: "bookings",
      label: "Inquiries",
      icon: MessageSquare
    },
    {
      id: "clients",
      label: "Clients",
      icon: Users
    },
    {
      id: "packages",
      label: "Packages",
      icon: TrendingUp
    },
    {
      id: "content",
      label: "Site Settings",
      icon: Settings
    }
  ];

  // =========================================
  // DASHBOARD UI
  // =========================================

  return (
    <div
      className="min-h-screen bg-slate-50 flex font-sans text-slate-800"
      dir="ltr"
    >
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() =>
          setConfirmState({
            ...confirmState,
            isOpen: false
          })
        }
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

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`fixed md:sticky top-0 inset-y-0 left-0 z-50 w-64 h-screen bg-slate-900 text-slate-300 transform transition-transform duration-300 flex flex-col ${
          isSidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <h2 className="text-2xl font-extrabold text-white tracking-tighter">
            Kohedroo
            <span className="text-indigo-500">.</span>
          </h2>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-400"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/20"
                    : "hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={
                    activeTab === item.id
                      ? "text-white"
                      : "text-slate-400"
                  }
                />

                <span className="font-medium text-sm">
                  {item.label}
                </span>

                {item.id === "bookings" &&
                  bookings.filter(
                    (b) => b.status === "Pending"
                  ).length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {
                        bookings.filter(
                          (b) => b.status === "Pending"
                        ).length
                      }
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={() =>
              supabase.auth
                .signOut()
                .then(() => router.push("/"))
            }
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
          >
            <LogOut size={18} />
            <span className="font-medium text-sm">
              Sign Out
            </span>
          </button>
        </div>
      </div>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col min-w-0 relative">

        {/* HEADER */}
        <header className="bg-white border-b border-slate-200 p-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 bg-slate-100 rounded-lg"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-xl font-bold text-slate-800 capitalize hidden md:block">
              {activeTab}
            </h1>

            <div className="relative max-w-md w-full ml-4 hidden md:block">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search projects, clients..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-sm transition-all"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            {activeTab !== "overview" &&
              activeTab !== "about" &&
              activeTab !== "content" && (
                <button
                  onClick={() => handleOpenForm()}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">
                    Add New
                  </span>
                </button>
              )}

            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
              {user.email[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-4 md:p-8">

          {/* OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                    <Briefcase size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Total Projects
                    </p>
                    <h3 className="text-2xl font-bold">
                      {projects.length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Users size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Total Clients
                    </p>
                    <h3 className="text-2xl font-bold">
                      {clients.length}
                    </h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
                    <Calendar size={24} />
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 font-medium">
                      Pending Inquiries
                    </p>
                    <h3 className="text-2xl font-bold">
                      {
                        bookings.filter(
                          (b) => b.status === "Pending"
                        ).length
                      }
                    </h3>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center py-20">
                <CheckCircle
                  size={48}
                  className="mx-auto text-emerald-500 mb-4 opacity-50"
                />

                <h2 className="text-xl font-bold mb-2">
                  Welcome back, {user.email.split("@")[0]}
                </h2>

                <p className="text-slate-500 max-w-md mx-auto">
                  Your portfolio is up and running. Use the sidebar to manage your content.
                </p>
              </div>
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {isFormOpen && activeTab !== "overview" && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-lg mb-8 relative"
            >
              <button
                onClick={() => {
                  setIsFormOpen(false);
                  setSelectedFiles([]);
                  setBulkProgress(0);
                }}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 bg-slate-100 hover:bg-red-50 p-2 rounded-full transition-colors"
              >
                <X size={20} />
              </button>

              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                {editingId ? (
                  <Pencil size={20} />
                ) : (
                  <Plus size={20} />
                )}

                {editingId
                  ? "Edit Item"
                  : activeTab === "about"
                    ? "Edit About Section"
                    : "Add New Item"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >

                {/* ABOUT */}
                {activeTab === "about" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Profile Image (drag & drop)
                      </label>

                      <DropZone
                        accept="image/*"
                        label="Drop profile image here, or click to browse"
                        currentUrl={formData.about_image}
                        onBusy={trackBusy}
                        onDone={(url) =>
                          setFormData((p) => ({
                            ...p,
                            about_image: url
                          }))
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Main Headline
                      </label>

                      <input
                        type="text"
                        placeholder="Crafting visual stories..."
                        className="input"
                        required
                        value={formData.about_title || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about_title: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Bio / Description
                      </label>

                      <textarea
                        placeholder="I am an Art Director..."
                        className="input"
                        rows="4"
                        required
                        value={formData.about_bio || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about_bio: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Skills (Separated by comma)
                      </label>

                      <input
                        type="text"
                        placeholder="Art Direction, AI Videos, Branding"
                        className="input"
                        required
                        value={formData.about_skills || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            about_skills: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Stat: Years Experience
                      </label>

                      <input
                        type="text"
                        placeholder="13+"
                        className="input"
                        required
                        value={formData.stat_years || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stat_years: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Stat: Projects Done
                      </label>

                      <input
                        type="text"
                        placeholder="100+"
                        className="input"
                        required
                        value={formData.stat_projects || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stat_projects: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* PROJECTS - BULK UPLOAD */}
                {activeTab === "projects" && (
                  <div className="grid grid-cols-1 gap-5">

                    {!editingId ? (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="block text-sm font-semibold text-slate-700">
                            Upload Multiple Images & Videos
                          </label>

                          <span className="text-xs font-bold text-indigo-600">
                            MAX 50 MB
                          </span>
                        </div>

                        {/* FILE PICKER */}
                        <label
                          className={`flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-400 transition-all ${
                            loading
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer border-slate-300"
                          }`}
                        >
                          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <ImageIcon size={26} />
                          </div>

                          <div className="text-center">
                            <p className="font-bold text-slate-700">
                              Select Multiple Files
                            </p>

                            <p className="text-xs text-slate-400 mt-1">
                              Choose images and videos from your device
                            </p>
                          </div>

                          <input
                            type="file"
                            accept="image/*,video/*"
                            multiple
                            disabled={loading}
                            className="hidden"
                            onChange={(e) => {
                              handleBulkFileSelection(
                                e.target.files
                              );

                              e.target.value = "";
                            }}
                          />
                        </label>

                        {/* SIZE INDICATOR */}
                        <div className="mt-5 p-4 bg-white border border-slate-200 rounded-xl">

                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-semibold text-slate-700">
                              Selected Files
                            </span>

                            <span className="text-xs text-slate-500">
                              {selectedFiles.length} files
                            </span>
                          </div>

                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs text-slate-500">
                              Total Size
                            </span>

                            <span className="text-sm font-bold text-indigo-600">
                              {formatFileSize(selectedTotalSize)} / 50 MB
                            </span>
                          </div>

                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                selectedPercentage >= 100
                                  ? "bg-amber-500"
                                  : "bg-indigo-600"
                              }`}
                              style={{
                                width: `${selectedPercentage}%`
                              }}
                            />
                          </div>

                          <p className="text-[11px] text-slate-400 mt-2">
                            Maximum total size per upload batch is 50 MB.
                          </p>
                        </div>

                        {/* UPLOAD PROGRESS */}
                        {loading && selectedFiles.length > 0 && (
                          <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">

                            <div className="flex justify-between mb-2">
                              <span className="text-sm font-semibold text-indigo-900">
                                Uploading files...
                              </span>

                              <span className="text-sm font-bold text-indigo-600">
                                {bulkProgress}%
                              </span>
                            </div>

                            <div className="h-2.5 bg-indigo-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                                style={{
                                  width: `${bulkProgress}%`
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* FILES LIST */}
                        {selectedFiles.length > 0 && (
                          <div className="mt-5 space-y-2">

                            <div className="flex items-center justify-between">
                              <p className="text-sm font-bold text-slate-700">
                                Files Preview
                              </p>

                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => setSelectedFiles([])}
                                className="text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
                              >
                                Clear All
                              </button>
                            </div>

                            {selectedFiles.map((file, index) => (
                              <div
                                key={`${file.name}-${file.lastModified}-${index}`}
                                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                              >
                                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                                  {file.type.startsWith("video/") ? (
                                    <Briefcase size={18} />
                                  ) : (
                                    <ImageIcon size={18} />
                                  )}
                                </div>

                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-slate-700 truncate">
                                    {file.name}
                                  </p>

                                  <p className="text-xs text-slate-400">
                                    {formatFileSize(file.size)}
                                    {" • "}
                                    {file.type.startsWith("video/")
                                      ? "Video"
                                      : "Image"}
                                  </p>
                                </div>

                                <button
                                  type="button"
                                  disabled={loading}
                                  onClick={() =>
                                    removeBulkFile(index)
                                  }
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg disabled:opacity-40"
                                  title="Remove file"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      // EDIT EXISTING PROJECT
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Replace Media
                        </label>

                        <DropZone
                          accept="image/*,video/*"
                          label="Drop an image or video here, or click to browse"
                          currentUrl={formData.media_url}
                          onBusy={trackBusy}
                          onDone={async (url, f) => {
                            const autoTitle = f.name.replace(
                              /\.[^/.]+$/,
                              ""
                            );

                            if (f.type.startsWith("video/")) {
                              const poster = await makePoster(f);

                              let posterUrl = null;

                              if (poster) {
                                try {
                                  posterUrl = await uploadMedia(
                                    new File(
                                      [poster],
                                      "poster.jpg",
                                      { type: "image/jpeg" }
                                    )
                                  );
                                } catch (err) {
                                  console.warn(
                                    "Poster upload failed",
                                    err
                                  );
                                }
                              }

                              setFormData((p) => ({
                                ...p,
                                title: p.title || autoTitle,
                                type: "video",
                                video_url: url,
                                media_url: posterUrl || url
                              }));
                            } else {
                              setFormData((p) => ({
                                ...p,
                                title: p.title || autoTitle,
                                type: "image",
                                video_url: null,
                                media_url: url
                              }));
                            }
                          }}
                        />
                      </div>
                    )}

                    {/* BRAND */}
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Brand *
                      </label>

                      <select
                        className="input"
                        required
                        value={formData.brand_id || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            brand_id: e.target.value || null
                          })
                        }
                      >
                        <option value="">
                          Select Brand
                        </option>

                        {brands.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* BRANDS */}
                {activeTab === "brands" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Brand Name *
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Joyalukkas"
                        className="input"
                        required
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Size Multiplier (0.5 to 2)
                      </label>

                      <input
                        type="number"
                        step="0.1"
                        placeholder="1"
                        className="input"
                        value={formData.size || "1"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            size: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Description (Case Study)
                      </label>

                      <textarea
                        placeholder="Short description about the work done for this brand..."
                        className="input"
                        rows="3"
                        value={formData.description || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            description: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Logo (Transparent PNG) *
                      </label>

                      <DropZone
                        accept="image/*"
                        label="Drop logo here, or click to browse"
                        currentUrl={formData.logo_url}
                        onBusy={trackBusy}
                        onDone={(url) =>
                          setFormData((p) => ({
                            ...p,
                            logo_url: url
                          }))
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Cover Image (Background)
                      </label>

                      <DropZone
                        accept="image/*"
                        label="Drop cover image here, or click to browse"
                        currentUrl={formData.cover_url}
                        onBusy={trackBusy}
                        onDone={(url) =>
                          setFormData((p) => ({
                            ...p,
                            cover_url: url
                          }))
                        }
                      />
                    </div>
                  </div>
                )}

                {/* CLIENTS */}
                {activeTab === "clients" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Client Name *
                      </label>

                      <input
                        type="text"
                        placeholder="Name"
                        className="input"
                        required
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Email
                      </label>

                      <input
                        type="email"
                        placeholder="Email"
                        className="input"
                        value={formData.email || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            email: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Phone
                      </label>

                      <input
                        type="text"
                        placeholder="Phone"
                        className="input"
                        value={formData.phone || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            phone: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Company
                      </label>

                      <input
                        type="text"
                        placeholder="Company"
                        className="input"
                        value={formData.company || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            company: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* PACKAGES */}
                {activeTab === "packages" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Package Name *
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. Gold Package"
                        className="input"
                        required
                        value={formData.name || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            name: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Price ($)
                      </label>

                      <input
                        type="number"
                        placeholder="500"
                        className="input"
                        value={formData.price || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            price: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Features (comma separated)
                      </label>

                      <input
                        type="text"
                        placeholder="Logo Design, Social Media Kit, 2 Revisions"
                        className="input"
                        value={formData.features || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            features: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* BOOKINGS */}
                {activeTab === "bookings" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Client *
                      </label>

                      <select
                        className="input"
                        required
                        value={formData.client_id || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            client_id: e.target.value
                          })
                        }
                      >
                        <option value="">
                          Select Client
                        </option>

                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Package
                      </label>

                      <select
                        className="input"
                        value={formData.package_id || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            package_id: e.target.value
                          })
                        }
                      >
                        <option value="">
                          Select Package
                        </option>

                        {packages.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Date *
                      </label>

                      <input
                        type="date"
                        className="input"
                        required
                        value={formData.date || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date: e.target.value
                          })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Time *
                      </label>

                      <input
                        type="time"
                        className="input"
                        required
                        value={formData.time || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            time: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Status
                      </label>

                      <select
                        className="input"
                        value={formData.status || "Pending"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value
                          })
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* CONTENT */}
                {activeTab === "content" && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Key (e.g. hero_subtitle)
                      </label>

                      <input
                        type="text"
                        placeholder="Key"
                        className="input"
                        required
                        disabled={!!editingId}
                        value={formData.key || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            key: e.target.value
                          })
                        }
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Value
                      </label>

                      <textarea
                        placeholder="Content Value"
                        className="input"
                        rows="3"
                        required
                        value={formData.value || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            value: e.target.value
                          })
                        }
                      />
                    </div>
                  </div>
                )}

                {/* FORM BUTTONS */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">

                  <button
                    type="submit"
                    disabled={
                      loading ||
                      isUploading ||
                      (
                        activeTab === "projects" &&
                        !editingId &&
                        selectedFiles.length > 0 &&
                        selectedTotalSize > MAX_UPLOAD_SIZE
                      )
                    }
                    className="btn-primary flex-1 md:flex-none px-8 disabled:opacity-50"
                  >
                    {isUploading
                      ? "Uploading..."
                      : loading
                        ? "Uploading & Saving..."
                        : activeTab === "projects" &&
                          !editingId &&
                          selectedFiles.length > 0
                          ? `Upload ${selectedFiles.length} Files`
                          : "Save Data"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsFormOpen(false);
                      setSelectedFiles([]);
                      setBulkProgress(0);
                    }}
                    disabled={loading}
                    className="bg-slate-100 text-slate-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* LISTS */}
          {activeTab !== "overview" &&
            activeTab !== "about" &&
            activeTab !== "content" && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">

                {/* PROJECTS LIST */}
                {activeTab === "projects" && (
                  projects.length === 0 && !isFormOpen ? (
                    <EmptyState
                      icon={Briefcase}
                      title="No Projects Yet"
                      description="Start building your portfolio by adding your first project. You can upload images and videos."
                      btnText="Add First Project"
                      onClick={() => handleOpenForm()}
                    />
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={filteredProjects}
                      onReorder={(newOrder) =>
                        handleReorder("projects", newOrder)
                      }
                      className="space-y-3"
                    >
                      {filteredProjects.map((p) => (
                        <Reorder.Item
                          key={p.id}
                          value={p}
                          className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <GripVertical
                              size={20}
                              className="text-slate-300"
                            />

                            <div
                              className="w-12 h-12 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() =>
                                setLightboxImage(p.media_url)
                              }
                            >
                              {p.type === "video" && !p.media_url ? (
                                <div className="w-full h-full flex items-center justify-center bg-black text-white">
                                  <Briefcase size={16} />
                                </div>
                              ) : (
                                <img
                                  src={p.media_url}
                                  alt={p.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {p.title}
                              </p>

                              <p className="text-xs text-slate-500">
                                {p.category} • {p.year}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenForm(p)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  "projects",
                                  p.id,
                                  p.title
                                )
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )
                )}

                {/* BRANDS LIST */}
                {activeTab === "brands" && (
                  brands.length === 0 && !isFormOpen ? (
                    <EmptyState
                      icon={ImageIcon}
                      title="No Brands Added Yet"
                      description="Add the companies and brands you have worked with. They will appear on the homepage."
                      btnText="Add First Brand"
                      onClick={() => handleOpenForm()}
                    />
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={brands}
                      onReorder={(newOrder) =>
                        handleReorder("brands", newOrder)
                      }
                      className="space-y-3"
                    >
                      {brands.map((b) => (
                        <Reorder.Item
                          key={b.id}
                          value={b}
                          className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <GripVertical
                              size={20}
                              className="text-slate-300"
                            />

                            <div
                              className="w-12 h-12 bg-white rounded-lg border border-slate-200 flex items-center justify-center p-1 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() =>
                                setLightboxImage(b.logo_url)
                              }
                            >
                              <img
                                src={b.logo_url}
                                alt={b.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            </div>

                            <div>
                              <p className="font-bold text-slate-800">
                                {b.name}
                              </p>

                              <p className="text-xs text-slate-500 truncate max-w-[200px]">
                                {b.description || "No description"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenForm(b)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  "brands",
                                  b.id,
                                  b.name
                                )
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )
                )}

                {/* PACKAGES LIST */}
                {activeTab === "packages" && (
                  packages.length === 0 && !isFormOpen ? (
                    <EmptyState
                      icon={TrendingUp}
                      title="No Packages Yet"
                      description="Create pricing packages for your clients to choose from when they book a call."
                      btnText="Add First Package"
                      onClick={() => handleOpenForm()}
                    />
                  ) : (
                    <Reorder.Group
                      axis="y"
                      values={packages}
                      onReorder={(newOrder) =>
                        handleReorder("packages", newOrder)
                      }
                      className="space-y-3"
                    >
                      {packages.map((p) => (
                        <Reorder.Item
                          key={p.id}
                          value={p}
                          className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <GripVertical
                              size={20}
                              className="text-slate-300"
                            />

                            <div>
                              <p className="font-bold text-slate-800">
                                {p.name}
                              </p>

                              <p className="text-xs text-slate-500">
                                ${p.price}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenForm(p)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  "packages",
                                  p.id,
                                  p.name
                                )
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </Reorder.Item>
                      ))}
                    </Reorder.Group>
                  )
                )}

                {/* CLIENTS LIST */}
                {activeTab === "clients" && (
                  clients.length === 0 && !isFormOpen ? (
                    <EmptyState
                      icon={Users}
                      title="No Clients Yet"
                      description="Clients who book calls or inquire will appear here automatically. You can also add them manually."
                      btnText="Add First Client"
                      onClick={() => handleOpenForm()}
                    />
                  ) : (
                    <>
                      <div className="flex justify-end mb-4">
                        <button
                          onClick={exportClientsToCSV}
                          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors"
                        >
                          <Download size={16} />
                          Export CSV
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                              <th className="p-4 font-semibold">Name</th>
                              <th className="p-4 font-semibold">Email</th>
                              <th className="p-4 font-semibold">Phone</th>
                              <th className="p-4 font-semibold text-right">
                                Actions
                              </th>
                            </tr>
                          </thead>

                          <tbody className="divide-y divide-slate-100">
                            {filteredClients.map((c) => (
                              <tr
                                key={c.id}
                                className="hover:bg-slate-50/50 transition-colors"
                              >
                                <td className="p-4 font-bold text-slate-800">
                                  {c.name}
                                </td>

                                <td className="p-4 text-sm text-slate-600">
                                  {c.email || "-"}
                                </td>

                                <td className="p-4 text-sm text-slate-600">
                                  {c.phone || "-"}
                                </td>

                                <td className="p-4 text-right space-x-2">
                                  <button
                                    onClick={() => handleOpenForm(c)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                  >
                                    <Pencil size={16} />
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDeleteClick(
                                        "clients",
                                        c.id,
                                        c.name
                                      )
                                    }
                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )
                )}

                {/* BOOKINGS LIST */}
                {activeTab === "bookings" && (
                  bookings.length === 0 && !isFormOpen ? (
                    <EmptyState
                      icon={MessageSquare}
                      title="No Inquiries Yet"
                      description="When clients book a call or submit a project request, their details will appear here."
                      btnText="Add Manual Inquiry"
                      onClick={() => handleOpenForm()}
                    />
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                            <th className="p-4 font-semibold">Client</th>
                            <th className="p-4 font-semibold">Date</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right">
                              Actions
                            </th>
                          </tr>
                        </thead>

                        <tbody className="divide-y divide-slate-100">
                          {bookings.map((b) => (
                            <tr
                              key={b.id}
                              className="hover:bg-slate-50/50 transition-colors"
                            >
                              <td className="p-4">
                                <p className="font-bold text-slate-800">
                                  {b.clients?.name || "Unknown"}
                                </p>

                                <p className="text-xs text-slate-500">
                                  {b.packages?.name || "No Package"}
                                </p>
                              </td>

                              <td className="p-4 text-sm text-slate-600">
                                {b.date} at {b.time}
                              </td>

                              <td className="p-4">
                                <span
                                  className={`px-2 py-1 rounded-md text-xs font-bold uppercase ${
                                    b.status === "Confirmed"
                                      ? "bg-emerald-100 text-emerald-700"
                                      : b.status === "Cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-amber-100 text-amber-700"
                                  }`}
                                >
                                  {b.status}
                                </span>
                              </td>

                              <td className="p-4 text-right space-x-2 flex justify-end">
                                {b.clients?.phone && (
                                  <a
                                    href={`https://wa.me/${b.clients.phone.replace(
                                      /[^0-9]/g,
                                      ""
                                    )}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg"
                                    title="Reply via WhatsApp"
                                  >
                                    <MessageSquare size={16} />
                                  </a>
                                )}

                                <button
                                  onClick={() => handleOpenForm(b)}
                                  className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  onClick={() =>
                                    handleDeleteClick(
                                      "bookings",
                                      b.id,
                                      `Booking from ${b.clients?.name}`
                                    )
                                  }
                                  className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                                >
                                  <Trash2 size={16} />
                                </button>
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

          {/* SITE CONTENT */}
          {activeTab === "content" && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 overflow-x-auto">

              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">
                    Site Content (Texts)
                  </h2>

                  <p className="text-sm text-slate-500">
                    Manage every text displayed on your website.
                  </p>
                </div>

                <button
                  onClick={() => handleOpenForm()}
                  className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-800 transition-all shadow-sm"
                >
                  <Plus size={16} />
                  Add New Key
                </button>
              </div>

              {Object.keys(siteContent).length === 0 &&
              !isFormOpen ? (
                <EmptyState
                  icon={Database}
                  title="No Content Keys"
                  description="Content keys are used to display dynamic text on your website. Click add to create one."
                  btnText="Add New Key"
                  onClick={() => handleOpenForm()}
                />
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs uppercase tracking-wider">
                      <th className="p-4 font-semibold">Key</th>
                      <th className="p-4 font-semibold">Value</th>
                      <th className="p-4 font-semibold text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {Object.entries(siteContent).map(
                      ([key, value]) => (
                        <tr
                          key={key}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="p-4 font-bold text-slate-800 text-sm">
                            {key}
                          </td>

                          <td className="p-4 text-sm text-slate-600 truncate max-w-xs">
                            {value}
                          </td>

                          <td className="p-4 text-right space-x-2">
                            <button
                              onClick={() =>
                                handleOpenForm({
                                  id: key,
                                  key,
                                  value
                                })
                              }
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Pencil size={16} />
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteClick(
                                  "site_content",
                                  key,
                                  key
                                )
                              }
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* ABOUT SECTION */}
          {activeTab === "about" && !isFormOpen && (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm text-center">
              <UserCircle
                size={48}
                className="mx-auto text-indigo-500 mb-4 opacity-50"
              />

              <h2 className="text-xl font-bold mb-2">
                About Section
              </h2>

              <p className="text-slate-500 mb-6">
                Manage the text, image, and stats in the "Behind the Pixels" section.
              </p>

              <button
                onClick={() =>
                  handleOpenForm({
                    ...siteContent,
                    id: "about"
                  })
                }
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 inline-flex items-center gap-2 shadow-lg transition-all active:scale-95"
              >
                <Pencil size={18} />
                Edit About Section
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
