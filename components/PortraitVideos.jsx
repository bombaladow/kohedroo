'use client';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import VideoModal from './VideoModal';

export default function PortraitVideos({ projects }) {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const videoProjects = projects?.filter(p => p.type === 'video') || [];

  if (videoProjects.length === 0) return null;

  return (
    <section className="py-16 md:py-20 px-6 md:px-12 bg-zinc-50 border-t border-black/5 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 md:mb-12 flex items-end justify-between">
          <div>
            <span className="text-xs font-mono uppercase text-zinc-500 tracking-widest font-bold block mb-2">
              Motion & Reels
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tighter">
              Vertical Showcase
            </h2>
          </div>
          {/* Swipe Hint - Mobile Only */}
          <span className="md:hidden text-[10px] font-mono uppercase tracking-widest text-zinc-400 animate-pulse">
            Swipe →
          </span>
        </div>

        {/* 📱 موبايل: سكرول أفقي (Swipe) */}
        <div 
          data-lenis-prevent
          className="md:hidden -mx-6 px-6 flex overflow-x-auto snap-x-mandatory no-scrollbar gap-4 pb-4"
        >
          {videoProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="snap-center flex-shrink-0 w-[85vw]"
            >
              <VideoCard 
                project={project} 
                index={index} 
                onClick={() => setSelectedVideo(project.video_url || project.media_url)} 
              />
            </div>
          ))}
        </div>

        {/* 💻 ديسكتوب: شبكة 3 أعمدة */}
        <div className="hidden md:grid grid-cols-3 gap-8">
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
    if (videoRef.current) videoRef.current.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.1 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="group relative aspect-[9/16] rounded-3xl overflow-hidden bg-zinc-900 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-black/10 active:scale-[0.98]"
    >
      <img
        src={project.media_url}
        alt={project.title}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-10" />
      
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 z-20 flex flex-col justify-end pointer-events-none">
        {project.category && (
          <span className="inline-block w-fit text-[10px] font-mono uppercase tracking-widest text-white/90 border border-white/20 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full mb-3">
            {project.category}
          </span>
        )}
        <h3 className="text-xl md:text-2xl font-bold text-white">{project.title}</h3>
      </div>

      {/* زرار التشغيل */}
      <div className="absolute top-5 right-5 w-11 h-11 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center z-20 md:opacity-0 md:group-hover:opacity-100 scale-100 md:scale-90 md:group-hover:scale-100 transition-all duration-500">
        <Play size={18} className="text-white ml-0.5" fill="white" />
      </div>
    </motion.div>
  );
}