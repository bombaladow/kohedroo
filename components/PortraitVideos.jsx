'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import VideoModal from './VideoModal';

export default function PortraitVideos({ projects }) {
  const [selectedVideo, setSelectedVideo] = useState(null);

  // بنفلتر بس الفيديوهات
  const videoProjects = projects?.filter(p => p.type === 'video') || [];

  if (videoProjects.length === 0) return null;

  return (
    <section className="py-20 px-6 md:px-12 bg-zinc-50 border-t border-black/5 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold block mb-2">
            Motion & Reels
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
            Vertical Showcase
          </h2>
        </div>

        {/* شبكة الفيديوهات (3 أعمدة على الديسكتوب) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {videoProjects.map((project, index) => (
            <VideoCard 
              key={project.id} 
              project={project} 
              index={index} 
              onClick={() => setSelectedVideo(project.video_url || project.media_url)} 
            />
          ))}
        </div>
      </div>

      <VideoModal 
        isOpen={!!selectedVideo} 
        onClose={() => setSelectedVideo(null)} 
        videoUrl={selectedVideo} 
      />
    </section>
  );
}

function VideoCard({ project, index, onClick }) {
  const videoRef = useRef(null);

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0; // إرجاع الفيديو من الأول
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/10"
    >
      {/* صورة الكفر */}
      <img
        src={project.media_url}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* الفيديو اللي بيشتغل عند الهوفر */}
      {project.video_url && (
        <video
          ref={videoRef}
          src={project.video_url}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />
      )}

      {/* طبقة التغطية والبيانات */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-500 z-10" />
      
      <div className="absolute inset-x-0 bottom-0 p-6 z-20 flex flex-col justify-end pointer-events-none">
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          {/* لوجو أو اسم الشركة لو موجود في الـ Category */}
          {project.category && (
            <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-white/80 border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-3">
              {project.category}
            </span>
          )}
          <h3 className="text-2xl font-bold text-white mb-2">{project.title}</h3>
        </div>
        
        {/* أيقونة التشغيل */}
        <div className="absolute bottom-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500">
          <Play size={20} className="text-white ml-1" />
        </div>
      </div>
    </motion.div>
  );
}