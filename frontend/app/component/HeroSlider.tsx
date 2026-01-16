'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import Link from 'next/link';

export default function HomepageHero() {
  const [banners, setBanners] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch the top 4 banners to rotate through
      const { data: bannerData } = await supabase
        .from('homepage_banners')
        .select('*')
        .order('display_order', { ascending: true })
        .limit(4);

      if (bannerData) setBanners(bannerData);
    };
    fetchData();
  }, []);

  // Timer logic for the main hero transition
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === banners.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // 3 seconds

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  return (
    <div className="relative min-h-screen bg-white">
      {/* Main Hero Section with Auto-Slider */}
      <div className="relative h-[80vh] md:h-screen overflow-hidden bg-gray-900">
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
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.7) contrast(1.1)' }}
              />
            ) : (
              <img
                src={banner.media_url}
                alt={banner.title}
                className="w-full h-full object-cover"
                style={{ filter: 'brightness(0.7) contrast(1.1)' }}
              />
            )}
          </div>
        ))}

        {/* Overlay Content (Static on top of changing images) */}
        <div className="absolute mt-100 inset-0 flex flex-col items-center justify-center text-center px-6 z-10 pointer-events-none">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-['Great_Vibes'] text-white drop-shadow-black mb-2 drop-shadow-2xl">
            24 FRAMES
          </h1>
          <p className="text-white text-lg md:text-xl tracking-[0.3em] uppercase font-light drop-shadow-lg">
            Wedding Organizer
          </p>
          
          {/* Optional: Call to Action button */}
          <div className="mt-8 pointer-events-auto">
            <Link 
              href="/portfolio" 
              className="px-8 py-3 border border-brown-medium text-gray-800 uppercase text-xs tracking-widest hover:bg-white hover:text-black transition-all duration-300"
            >
              Explore Portfolio
            </Link>
          </div>
        </div>

        {/* Soft Bottom Gradient to transition into content */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-white z-[5]" />

        {/* Slider Navigation Dots */}
        {/* <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${
                i === currentIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'
              }`}
            />
          ))}
        </div> */}
      </div>

      {/* Content starts immediately after the Hero Slider */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Your Price List or About section continues here */}
      </div>
      {/* Services Section */}
      <section className="bg-white py-0 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-['Cormorant_Garamond'] text-[#8B6F47] italic mb-4">
              Our Professional Services
            </h2>
            <div className="w-24 h-[1px] bg-[#D4C4B0] mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              title="Wedding Planning" 
              desc="Comprehensive coordination from concept to the big day, ensuring every detail is flawless." 
              icon="💍"
            />
            <ServiceCard 
              title="Photography" 
              desc="Capturing timeless moments with high-end equipment and an artistic editorial eye." 
              icon="📸"
            />
            <ServiceCard 
              title="Cinematography" 
              desc="Full cinematic film coverage of your wedding day with professional storytelling." 
              icon="🎥"
            />
            <ServiceCard 
              title="Decor & Design" 
              desc="Creating breathtaking atmospheres tailored to your unique aesthetic and theme." 
              icon="✨"
            />
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-[#FAF8F3] border-t border-[#D4C4B0]/30 py-12 px-6 text-center">
        <p className="font-['Playfair_Display'] text-[#8B6F47] uppercase tracking-widest text-sm">
          24 Frames Studio © 2026
        </p>
      </footer>
    </div>
  );
}
const ServiceCard = ({ title, desc, icon }: { title: string; desc: string; icon: string }) => (
  <div className="group p-8 bg-[#FAF8F3] border border-transparent hover:border-[#D4C4B0] transition-all duration-500 rounded-2xl text-center shadow-sm hover:shadow-xl">
    <div className="text-4xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-500">
      {icon}
    </div>
    <h3 className="text-2xl font-['Playfair_Display'] text-[#8B6F47] mb-4">
      {title}
    </h3>
    <p className="text-gray-600 text-sm leading-relaxed">
      {desc}
    </p>
    <div className="mt-6 pt-6 border-t border-[#D4C4B0]/20 opacity-0 group-hover:opacity-100 transition-opacity">
      <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#A0826D]">
        <Link href="/contact" className="hover:underline">Inquire Now</Link>
      </span>
    </div>
  </div>
);