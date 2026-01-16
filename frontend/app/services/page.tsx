'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/app/lib/supabase'; 
import Navbar from '../component/Navbar';// Adjust this path to your supabase config

export default function PricingSection() {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPackages = async () => {
      const { data, error } = await supabase
        .from('pricing_packages')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) {
        console.error('Error fetching pricing:', error);
      } else {
        setPackages(data);
      }
      setLoading(false);
    };

    fetchPackages();
  }, []);

  if (loading) {
    return <div className="py-24 text-center font-serif italic text-gray-400">Loading Collections...</div>;
  }

  return (
    <>
    <Navbar forceSolid={true} />
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-[#A0826D] uppercase tracking-[0.3em] text-xs font-semibold mb-4 block">
            Investment
          </span>
          <h2 className="text-5xl md:text-7xl font-['Cormorant_Garamond'] text-[#8B6F47] italic">
            Wedding Collections
          </h2>
          <p className="mt-6 text-gray-500 font-light max-w-xl mx-auto">
            Capturing the fleeting moments of today that will wow your heart tomorrow. 
            Custom packages available upon request.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`relative p-10 flex flex-col transition-all duration-500 border border-[#D4C4B0]/30 ${
                pkg.highlight 
                  ? 'bg-[#FAF8F3] shadow-2xl scale-105 z-10' 
                  : 'bg-white hover:border-[#8B6F47]'
              }`}
            >
              {pkg.highlight && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#8B6F47] text-white text-[10px] uppercase tracking-[0.2em] px-4 py-1">
                  Most Loved
                </div>
              )}

              <h3 className="text-2xl font-['Playfair_Display'] text-[#8B6F47] mb-2">
                {pkg.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-light text-gray-900">{pkg.price}</span>
                <span className="text-gray-400 text-sm italic">/ starting at</span>
              </div>
              
              <p className="text-gray-600 text-sm mb-8 font-light italic leading-relaxed">
                "{pkg.description}"
              </p>

              <div className="w-full h-[1px] bg-[#D4C4B0]/30 mb-8" />

              <ul className="space-y-4 mb-12 flex-grow">
                {pkg.features?.map((feature: string, i: number) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-[#8B6F47] text-xs">✦</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link 
                href="/contact"
                className={`w-full py-4 text-center text-xs uppercase tracking-widest transition-all duration-300 ${
                  pkg.highlight 
                    ? 'bg-[#8B6F47] text-white hover:bg-black' 
                    : 'border border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white'
                }`}
              >
                Inquire
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}