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
  const fullscreenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      const { data: eventData } = await supabase.from('events').select('name').eq('id', event_id).single();
      if (eventData) setEventName(eventData.name);

      const { data: photoData } = await supabase.from('photos').select('*').eq('event_id', event_id);
      if (photoData) setPhotos(photoData);
    };
    if (event_id) loadData();
  }, [event_id]);

  const handleDownload = async (url: string, id: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `photo-${id}.jpg`;
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
      <main className="bg-gradient-to-b from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] min-h-screen">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-32 md:pt-40 pb-20">
          <header className="mb-12 md:mb-20 text-center">
            <h1 className="text-3xl md:text-8xl font-black italic uppercase tracking-wide text-amber-50 font-serif">
              {eventName}
            </h1>
          </header>

          <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
            {photos.map((photo, index) => (
              <div 
                key={photo.id} 
                className="relative group overflow-hidden rounded-lg bg-white shadow-sm transition-all duration-500 border border-brown-light/20 cursor-zoom-in"
                onClick={() => setSelectedPhotoIndex(index)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <img src={photo.url} alt="" className="w-full h-full object-cover" />
                  
                  {/* Download overlay for desktop */}
                  <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                    <Maximize2 className="text-white opacity-70" size={32} />
                  </div>

                  {/* Mobile Download - Keep separate from Fullscreen click */}
                  <div className="md:hidden absolute bottom-1 right-1 z-10">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload(photo.url, photo.id);
                      }}
                      className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-lg text-brown-warm"
                    >
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </div>
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
              {/* Controls */}
              <div className="absolute top-6 right-6 flex gap-4 z-[110]">
                <button onClick={() => handleDownload(photos[selectedPhotoIndex].url, photos[selectedPhotoIndex].id)} className="text-white hover:text-brown-light transition-colors p-2">
                  <Download size={24} />
                </button>
                <button onClick={toggleBrowserFullscreen} className="text-white hover:text-brown-light transition-colors p-2">
                  <Maximize2 size={24} />
                </button>
                <button onClick={() => setSelectedPhotoIndex(null)} className="text-white hover:text-brown-light transition-colors p-2">
                  <X size={30} />
                </button>
              </div>

              {/* Navigation */}
              <button 
                className="absolute left-4 text-white/50 hover:text-white z-[110]"
                onClick={() => setSelectedPhotoIndex((prev) => (prev! > 0 ? prev! - 1 : photos.length - 1))}
              >
                <ChevronLeft size={48} strokeWidth={1} />
              </button>
              <button 
                className="absolute right-4 text-white/50 hover:text-white z-[110]"
                onClick={() => setSelectedPhotoIndex((prev) => (prev! < photos.length - 1 ? prev! + 1 : 0))}
              >
                <ChevronRight size={48} strokeWidth={1} />
              </button>

              <motion.img 
                key={selectedPhotoIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                src={photos[selectedPhotoIndex].url}
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </AuthGate>
  );
}