'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomepageHero() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data: bannerData } = await supabase
        .from('homepage_banners')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(4);

      if (bannerData) {
        setBanners(bannerData);
        if (bannerData.length === 0) setIsReady(true);
      }
    };
    fetchData();
  }, []);

  // Monitor asset loading
  useEffect(() => {
    if (banners.length > 0 && loadedCount >= banners.length) {
      const timer = setTimeout(() => setIsReady(true), 1000);
      return () => clearTimeout(timer);
    }
  }, [loadedCount, banners.length]);

  // Auto-Slider
  useEffect(() => {
    if (isReady && banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [isReady, banners.length]);

  return (
    <div className="relative">
      
      {/* 1. THE RELOAD / SPLASH SECTION */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] bg-[#FAF8F3] flex flex-col items-center justify-center"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-['Great_Vibes'] text-[#8B6F47] mb-6">
                24 Frames
              </h1>
              <div className="w-64 h-[1px] bg-[#D4C4B0]/30 mx-auto relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-[#8B6F47]"
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
              </div>
              <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-[#A0826D] font-bold animate-pulse">
                Loading...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. THE MAIN WEBSITE CONTENT (Always present, revealed by loader) */}
      <div className={`transition-all duration-1000 ${isReady ? 'opacity-100 blur-0' : 'opacity-0 blur-sm'}`}>
        
        {/* HERO SLIDER SECTION */}
        <div className="rounded-t-3xl relative h-[80vh] md:h-screen overflow-hidden bg-gray-900">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                index === currentIndex ? 'opacity-100' : 'opacity-0'
              }`}
            >
              {banner.media_type === 'video' ? (
                <video
                  src={banner.media_url}
                  autoPlay muted loop playsInline
                  onLoadedData={() => setLoadedCount(prev => prev + 1)}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                />
              ) : (
                <img
                  src={banner.media_url}
                  alt=""
                  onLoad={() => setLoadedCount(prev => prev + 1)}
                  className="w-full h-full object-cover"
                  style={{ filter: 'brightness(0.7) contrast(1.1)' }}
                />
              )}
            </div>
          ))}

          {/* Overlay Content */}
          <div className="absolute inset-0 top-50 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-['Great_Vibes'] text-white drop-shadow-2xl mb-2">
              24 FRAMES
            </h1>
            <p className="text-white text-lg md:text-xl tracking-[0.3em] uppercase font-light drop-shadow-lg">
              Wedding Organizer
            </p>
            <div className="mt-8 pointer-events-auto">
              <Link 
                href="/portfolio" 
                className="px-8 py-3 border border-white/40 text-white uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300 backdrop-blur-md"
              >
                Explore Portfolio
              </Link>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white z-[5]" />
        </div>

        {/* SERVICES SECTION */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] text-[#8B6F47] italic mb-4">
                Our Professional Services
              </h2>
              <div className="w-24 h-[1px] bg-[#D4C4B0] mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <ServiceCard title="Wedding Planning" icon="💍" desc="Comprehensive coordination from concept to the big day." />
              <ServiceCard title="Photography" icon="📸" desc="Capturing timeless moments with an artistic editorial eye." />
              <ServiceCard title="Cinematography" icon="🎥" desc="Full cinematic film coverage of your wedding day." />
              <ServiceCard title="Decor & Design" icon="✨" desc="Creating breathtaking atmospheres tailored to you." />
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#FAF8F3] border-t border-[#D4C4B0]/30 py-12 px-6 text-center">
          <p className="font-['Playfair_Display'] text-[#8B6F47] uppercase tracking-widest text-sm">
            24 Frames Studio © 2026
          </p>
        </footer>
      </div>
    </div>
  );
}

const ServiceCard = ({ title, desc, icon }: { title: string; desc: string; icon: string }) => (
  <div className="group p-8 bg-[#FAF8F3] border border-transparent hover:border-[#D4C4B0] transition-all duration-500 rounded-2xl text-center shadow-sm hover:shadow-xl">
    <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">{icon}</div>
    <h3 className="text-2xl font-['Playfair_Display'] text-[#8B6F47] mb-4">{title}</h3>
    <p className="text-gray-600 text-sm leading-relaxed">{desc}</p>
    <div className="mt-6 pt-6 border-t border-[#D4C4B0]/20 opacity-0 group-hover:opacity-100 transition-opacity">
      <Link href="/contact" className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0826D] hover:underline">
        Inquire Now
      </Link>
    </div>
  </div>
);