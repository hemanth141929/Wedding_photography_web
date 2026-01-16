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

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-3 gap-2 md:gap-6">
            {projects.map((item) => {
              const isVideo = item.media_type === 'video' || item.media_url?.toLowerCase().endsWith('.mp4');
              return (
                <motion.div 
                  key={item.id} 
                  className="group cursor-pointer overflow-hidden bg-white rounded-lg shadow-sm hover:shadow-xl transition-all duration-500 border border-brown-light/30"
                  onClick={() => setSelectedMedia(item)}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    {isVideo ? (
                      <video autoPlay muted loop playsInline className="object-cover w-full h-full">
                        <source src={item.media_url} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={item.media_url} alt={item.title} className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110" />
                    )}
                  </div>
                  <div className="p-2 md:p-4 border-t border-brown-light/20 bg-white">
                    <h3 className="text-foreground text-[8px] md:text-sm font-semibold uppercase tracking-tight truncate">{item.title}</h3>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Lightbox Modal */}
          <AnimatePresence>
            {selectedMedia && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md"
              >
                {/* Control Buttons Container */}
                <div className="absolute top-6 right-6 flex items-center gap-4 z-[110]">
                  {/* Browser Fullscreen Trigger */}
                  <button 
                    onClick={handleFullscreen}
                    className="text-white/70 hover:text-white transition-colors"
                    title="Fullscreen Mode"
                  >
                    <Maximize size={28} />
                  </button>
                  
                  {/* Close Button */}
                  <button 
                    onClick={() => setSelectedMedia(null)}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X size={32} />
                  </button>
                </div>
                
                {/* Media Container for Fullscreen Ref */}
                <motion.div 
                  ref={mediaRef}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="relative w-full h-full max-w-6xl max-h-[85vh] flex items-center justify-center p-4 bg-black" 
                  onClick={(e) => e.stopPropagation()}
                >
                  {(selectedMedia.media_type === 'video' || selectedMedia.media_url?.endsWith('.mp4')) ? (
                    <video 
                      controls 
                      autoPlay 
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      <source src={selectedMedia.media_url} type="video/mp4" />
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