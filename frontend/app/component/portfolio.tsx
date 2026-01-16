'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import { Maximize, X, Film, Image as ImageIcon } from 'lucide-react';

export default function PortfolioGrid() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  
  // Ref for browser-level fullscreen
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setProjects(data);
    };
    fetchPortfolio();
  }, []);

  // Preloader Logic
  useEffect(() => {
    if (projects.length > 0 && loadedCount >= projects.length) {
      const timer = setTimeout(() => setIsReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loadedCount, projects.length]);

  const handleAssetLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  // --- FULLSCREEN FUNCTIONS ---
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (mediaRef.current) {
        if (mediaRef.current.requestFullscreen) {
          mediaRef.current.requestFullscreen();
        } else if ((mediaRef.current as any).webkitRequestFullscreen) {
          (mediaRef.current as any).webkitRequestFullscreen();
        }
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const closeGallery = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
    setSelectedMedia(null);
  };

  return (
    <>
      {/* 1. LUXURY RELOAD SECTION */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#FAF8F3] flex flex-col items-center justify-center"
          >
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
              <h2 className="text-4xl md:text-6xl font-['Great_Vibes'] text-[#8B6F47] mb-6">Portfolio</h2>
              <div className="w-48 h-[1px] bg-[#D4C4B0]/30 mx-auto relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-[#8B6F47]"
                  initial={{ x: "-100%" }} animate={{ x: "0%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-[#A0826D] font-bold">
                loading... {projects.length > 0 ? Math.round((loadedCount / projects.length) * 100) : 0}%
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar />
      
      {/* 2. MAIN CONTENT */}
      <main className={`bg-gradient-to-b from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] min-h-screen transition-all duration-1000 ${isReady ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}>
        <div className="max-w-[1600px] mx-auto pt-20 px-2 md:px-4 pb-20">
          <header className="mb-10 text-center">
            <span className="text-white text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Showcase</span>
            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-wide text-brown-warm leading-none font-serif">Portfolio</h2>
          </header>

          <div className="columns-2 md:columns-3 gap-2 space-y-2">
            {projects.map((item) => {
              const url = item.media_url || '';
              const isVideo = item.media_type === 'video' || url.toLowerCase().endsWith('.mp4') || url.toLowerCase().endsWith('.mov');

              return (
                <motion.div 
                  key={item.id} 
                  className="break-inside-avoid relative group cursor-pointer overflow-hidden rounded-sm bg-white/10 shadow-sm"
                  onClick={() => setSelectedMedia(item)}
                >
                  <div className="relative w-full h-auto">
                    {isVideo ? (
                      <video autoPlay muted loop playsInline onLoadedData={handleAssetLoad} className="w-full h-auto block">
                        <source src={url} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={url} alt="" onLoad={handleAssetLoad} className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" />
                    )}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4 text-white">
                       <p className="text-[10px] uppercase tracking-widest font-bold">View Story</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* 3. LIGHTBOX MODAL */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
          >
            {/* Control Buttons */}
            <div className="absolute top-6 right-6 flex items-center gap-6 z-[110]">
              <button onClick={toggleFullscreen} className="text-white/70 hover:text-white transition-all p-2 bg-white/10 rounded-full">
                <Maximize size={24} />
              </button>
              <button onClick={closeGallery} className="text-white/70 hover:text-white transition-all p-2 bg-white/10 rounded-full">
                <X size={24} />
              </button>
            </div>

            <motion.div 
              ref={mediaRef}
              className="relative w-full h-full flex items-center justify-center p-4 bg-black" 
              onClick={(e) => e.stopPropagation()}
            >
              {(selectedMedia.media_type === 'video' || selectedMedia.media_url?.toLowerCase().endsWith('.mp4')) ? (
                <video key={selectedMedia.id} controls autoPlay playsInline className="w-full h-full object-contain">
                  <source src={selectedMedia.media_url} type="video/mp4" />
                </video>
              ) : (
                <img src={selectedMedia.media_url} className="w-full h-full object-contain" alt="" />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}