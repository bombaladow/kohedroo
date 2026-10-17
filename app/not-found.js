'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* خلفية متحركة */}
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        className="absolute w-[800px] h-[800px] border-[1px] border-white/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />
      <motion.div 
        animate={{ rotate: -360 }} 
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute w-[600px] h-[600px] border-[1px] border-white/10 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      />

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-[150px] md:text-[250px] font-extrabold tracking-tighter leading-none mix-blend-difference z-10"
      >
        404
      </motion.h1>
      
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-xl md:text-3xl text-zinc-400 font-mono mb-12 z-10"
      >
        This page does not exist.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="z-10"
      >
        <Link 
          href="/" 
          className="group inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-bold hover:bg-gray-200 transition-all active:scale-95"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}