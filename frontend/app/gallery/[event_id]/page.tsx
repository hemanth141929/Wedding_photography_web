'use client';
import React, { useEffect, useState, use, useRef } from 'react';
import { supabase } from '@/app/lib/supabase';
import Navbar from '@/app/component/Navbar';
import AuthGate from './AuthGate';
import { Download, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export default function GalleryPage({ params }: { params: Promise<{ event_id: string }> }) {
  const resolvedParams = use(params);
  const event_id = resolvedParams.event_id;
  
  const [photos, setPhotos] = useState<any[]>([]);
  const [eventName, setEventName] = useState('');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: eventData } = await supabase.from('events').select('name').eq('id', event_id).single();
      if (eventData) setEventName(eventData.name);

      const { data: photoData } = await supabase.from('photos').select('*').eq('event_id', event_id).order('created_at', { ascending: true });
      if (photoData) {
        setPhotos(photoData);
        if (photoData.length === 0) setIsReady(true);
      }
    };
    if (event_id) loadData();
  }, [event_id]);

  // Handle asset loading logic
  useEffect(() => {
    if (photos.length > 0 && loadedCount >= photos.length) {
      const timer = setTimeout(() => setIsReady(true), 800);
      return () => clearTimeout(timer);
    }
  }, [loadedCount, photos.length]);

  const handleAssetLoad = () => {
    setLoadedCount((prev) => prev + 1);
  };

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `wedding-${id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const toggleBrowserFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <AuthGate event_id={event_id}>
      {/* 1. LUXURY RELOAD SECTION */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="fixed inset-0 z-[100] bg-[#FAF8F3] flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center"
            >
              <h2 className="text-4xl md:text-6xl font-['Great_Vibes'] text-[#8B6F47] mb-6 lowercase">
                {eventName || 'your gallery'}
              </h2>
              <div className="w-48 h-[1px] bg-[#D4C4B0]/30 mx-auto relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-[#8B6F47]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-[#A0826D] font-bold">
                Getting your memories...{photos.length > 0 ? Math.round((loadedCount / photos.length) * 100) : 0}%
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className={`bg-gradient-to-b from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] min-h-screen transition-all duration-1000 ${isReady ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}>
        <Navbar />
        
        <div className="max-w-[1600px] mx-auto px-1 md:px-2 pt-32 md:pt-40 pb-20">
          <header className="mb-12 md:mb-20 text-center">
            <h1 className="text-3xl md:text-8xl font-black italic uppercase tracking-wide text-white/90 font-serif drop-shadow-sm">
              {eventName}
            </h1>
          </header>

          <div className="columns-2 md:columns-3 lg:columns-4 gap-1 md:gap-2 space-y-1 md:space-y-2">
            {photos.map((photo, index) => (
              <motion.div 
                key={photo.id} 
                className="break-inside-avoid relative group overflow-hidden rounded-sm bg-white shadow-sm cursor-zoom-in"
                onClick={() => setSelectedPhotoIndex(index)}
              >
                <img 
                  src={photo.url} 
                  alt="" 
                  onLoad={handleAssetLoad}
                  className="w-full h-auto block transition-transform duration-700 group-hover:scale-105" 
                />
                
                <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                  <Maximize2 className="text-white/80" size={24} />
                </div>

                <div className="md:hidden absolute bottom-2 right-2 z-10">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(photo.url, photo.id);
                    }}
                    className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-brown-warm active:scale-90 transition-transform"
                  >
                    <Download size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Fullscreen Lightbox Modal */}
        <AnimatePresence>
          {selectedPhotoIndex !== null && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
              ref={fullscreenRef}
            >
              <div className="absolute top-6 right-6 flex gap-4 z-[110]">
                <button onClick={() => handleDownload(photos[selectedPhotoIndex].url, photos[selectedPhotoIndex].id)} className="text-white hover:text-[#f3ca8c] transition-colors p-2">
                  <Download size={24} />
                </button>
                <button onClick={toggleBrowserFullscreen} className="text-white hover:text-[#f3ca8c] transition-colors p-2">
                  <Maximize2 size={24} />
                </button>
                <button onClick={() => setSelectedPhotoIndex(null)} className="text-white hover:text-[#f3ca8c] transition-colors p-2">
                  <X size={30} />
                </button>
              </div>

              <button 
                className="absolute left-4 text-white/50 hover:text-white z-[110] transition-colors"
                onClick={() => setSelectedPhotoIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1))}
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button 
                className="absolute right-4 text-white/50 hover:text-white z-[110] transition-colors"
                onClick={() => setSelectedPhotoIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0))}
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>

              <motion.img 
                key={selectedPhotoIndex}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={photos[selectedPhotoIndex].url}
                className="max-w-full max-h-[90vh] object-contain shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AuthGate>
  );
}