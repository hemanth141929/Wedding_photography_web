'use client';
import React, { useState } from 'react';
import Navbar from '../component/Navbar';
import { motion } from 'framer-motion';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 2000);
  };

  return (
    <>
    <div className="min-h-screen bg-[#FAF8F3]">
    <Navbar forceSolid={true} />      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left Side: Editorial Text */}
          <div className="space-y-12">
            <header>
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-[#A0826D] uppercase tracking-[0.4em] text-[10px] font-bold mb-4 block"
              >
                Get in Touch
              </motion.span>
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-['Cormorant_Garamond'] text-[#8B6F47] italic leading-tight"
              >
                Let’s tell your <br /> story together.
              </motion.h1>
            </header>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8 text-[#8B6F47]/80 font-light leading-relaxed max-w-md"
            >
              <p>
                Currently booking for the 2024 and 2025 wedding seasons. 
                Whether you are planning an intimate elopement or a grand 
                celebration, we would love to hear from you.
              </p>
              
              <div className="pt-8 space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-bold text-[#A0826D]">Follow</span>
                  <a href="https://www.instagram.com/hemanth_shetty_1429/" className="text-xl font-['Playfair_Display'] italic underline decoration-[#D4C4B0] underline-offset-8">@24frames_studio</a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Elegant Form */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-10 md:p-16 border border-[#D4C4B0]/30 shadow-sm relative overflow-hidden"
          >
            
            {/* WhatsApp Concierge Section */}
<section className="border-t border-[#D4C4B0]/30 bg-white py-20 px-6">
  <div className="max-w-3xl mx-auto text-center space-y-8">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="space-y-4"
    >
      <span className="text-[#A0826D] uppercase tracking-[0.4em] text-[10px] font-bold block">
        Instant Connection
      </span>
      <h2 className="text-4xl md:text-5xl font-['Cormorant_Garamond'] text-[#8B6F47] italic">
        Prefer a quicker conversation?
      </h2>
      <p className="text-gray-500 font-light text-sm max-w-md mx-auto leading-relaxed">
        For immediate availability checks or quick questions, our studio concierge is available via WhatsApp.
      </p>
    </motion.div>

    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.2 }}
    >
      <a 
        href="https://wa.me/7676004057" // Replace with your actual number
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-4 group"
      >
        <div className="w-16 h-16 rounded-full border border-[#D4C4B0] flex items-center justify-center group-hover:bg-[#8B6F47] group-hover:border-[#8B6F47] transition-all duration-500">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="text-[#8B6F47] group-hover:text-white transition-colors"
          >
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3l-1.5 5.5Z"/>
          </svg>
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-widest font-bold text-[#A0826D]">Chat with us</p>
          <p className="text-xl font-['Playfair_Display'] italic text-[#8B6F47] border-b border-[#D4C4B0] group-hover:border-[#8B6F47] transition-all">
            +91 7676004057
          </p>
        </div>
      </a>
    </motion.div>

    <p className="text-[9px] text-gray-400 uppercase tracking-widest pt-4">
      Available Mon — Sat, 10am to 7pm
    </p>
  </div>
</section>
          </motion.div>
          
        </div>
      </main>
    </div>
    </> 
  );
}