'use client';
import { useEffect, useState, useRef } from 'react'; // Added useRef
import { supabase } from '../lib/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './Navbar';
import { Maximize, X } from 'lucide-react'; // Recommended icons

export default function PortfolioGrid() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Ref to target the image/video for browser-level fullscreen
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const { data } = await supabase
        .from('portfolio')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setProjects(data);
      setLoading(false);
    };
    fetchPortfolio();
  }, []);

  // Function to trigger Browser Fullscreen API
  const handleFullscreen = () => {
    if (mediaRef.current) {
      if (mediaRef.current.requestFullscreen) {
        mediaRef.current.requestFullscreen();
      } else if ((mediaRef.current as any).webkitRequestFullscreen) {
        (mediaRef.current as any).webkitRequestFullscreen();
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="py-40 text-center text-brown-warm uppercase tracking-widest text-sm font-elegant">Loading...</div>
    </div>
  );
  

  return (
    <>
      <Navbar />
      <main className="bg-gradient-to-b from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] min-h-screen selection:bg-pink-300/30">
        <div className="max-w-7xl mx-auto pt-20">
          <header className="mb-10 text-center">
            <span className="text-white text-[10px] font-bold tracking-[0.5em] uppercase mb-4 block">Showcase</span>
            <h2 className="text-4xl md:text-7xl font-black italic uppercase tracking-wide text-brown-warm leading-none font-serif">Portfolio</h2>
          </header>

          {/* --- Inside your return statement --- */}
<div className="grid grid-cols-3 gap-2 md:gap-6">
  {projects.map((item) => {
    // 1. Define variables INSIDE the map function
    const url = item.media_url || '';
    const isVideo = 
      item.media_type === 'video' || 
      url.toLowerCase().endsWith('.mp4') || 
      url.toLowerCase().endsWith('.mov');

    return (
      <motion.div 
        key={item.id} 
        className="..." 
        onClick={() => setSelectedMedia(item)}
      >
        <div className="relative aspect-square overflow-hidden bg-zinc-100">
          {isVideo ? (
            <video autoPlay muted loop playsInline className="object-cover w-full h-full">
              <source src={url} type="video/mp4" />
              <source src={url} type="video/quicktime" />
            </video>
          ) : (
            <img src={url} alt={item.title} className="..." />
          )}
        </div>
        {/* ... Rest of your card ... */}
      </motion.div>
    );
  })}
</div>

          {/* Lightbox Modal */}
          {/* --- Lightbox Modal --- */}
<AnimatePresence>
  {selectedMedia && (
    <motion.div >
      
      {/* Change 'url' to 'selectedMedia.media_url' here */}
      <motion.div 
        ref={mediaRef}
        className="relative w-full h-full flex items-center justify-center p-4 bg-black" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* UPDATED LOGIC BELOW */}
        {(selectedMedia.media_type === 'video' || 
          selectedMedia.media_url?.toLowerCase().endsWith('.mp4') || 
          selectedMedia.media_url?.toLowerCase().endsWith('.mov')) ? (
          
          <video 
            key={selectedMedia.id} // Add key so video resets when switching
            controls 
            autoPlay 
            className="w-full h-full object-contain"
          >
            <source src={selectedMedia.media_url} type="video/mp4" />
            <source src={selectedMedia.media_url} type="video/quicktime" />
          </video>
          
        ) : (
          <img 
            src={selectedMedia.media_url} 
            className="w-full h-full object-contain" 
            alt={selectedMedia.title} 
          />
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
        </div>
      </main>
    </>
  );
}