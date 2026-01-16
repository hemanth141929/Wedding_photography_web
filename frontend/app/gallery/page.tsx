'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../lib/supabase';
import Navbar from '../component/Navbar';

const EventsListPage = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) setEvents(data);
      setLoading(false);
    };
    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f3ca8c] via-[#ecd0a5] to-[#f0e1d7] text-gray-800 selection:bg-pink-300/30">
      <Navbar />
      
      <div className="max-w-5xl mx-auto px-6 pt-40 pb-20">
        <header className="mb-24 border-b border-white pb-12 text-center">
          <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-widest leading-none text-gray-800 font-['Playfair_Display']">
            Events
          </h1>
        </header>

        {loading ? (
          <div className="text-[#ffffff] tracking-[0.3em] uppercase text-[10px] animate-pulse text-center">
            Fetching Database...
          </div>
        ) : (
          <div className="flex flex-col bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
            {events.map((event, index) => (
              <Link 
                key={event.id} 
                href={`/gallery/${event.id}`} 
                className="group border-b border-pink-100 last:border-b-0 py-8 md:py-12 flex items-center justify-between transition-all duration-500 hover:px-6 hover:bg-gradient-to-r hover:from-pink-50/50 hover:to-transparent"
              >
                <div className="flex items-baseline gap-6 md:gap-10">
                  <span className="text-[#7e4700] text-xs md:text-sm font-mono italic group-hover:text-[#caa26d] transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  <h2 className="text-3xl md:text-6xl font-bold uppercase tracking-wide italic text-gray-800 group-hover:text-[#caa26d] transition-all duration-500 group-hover:translate-x-2 font-['Playfair_Display']">
                    <span className="text-2xl md:text-4xl">{event.name}</span>
                  </h2>
                </div>

                <div className="text-right">
                  <span className="hidden md:block text-[10px] tracking-[0.4em] uppercase text-brown-medium group-hover:text-brown-light transition-colors">
                    {event.date || 'View Gallery'}
                  </span>
                  <div className="h-[2px] w-0 bg-brown-medium transition-all duration-700 group-hover:w-full mt-2 rounded-full" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default EventsListPage;