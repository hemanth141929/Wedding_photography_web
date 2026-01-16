'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled || isOpen
            ? 'bg-white/95 backdrop-blur-xl border-b border-[#D4C4B0]/60 py-4 shadow-sm' 
            : 'bg-transparent py-6 md:py-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          
          <Link href="/" className="z-50" onClick={() => setIsOpen(false)}>
            {/* FIX: Changed text-white to text-[#8B6F47] on mobile (hidden md:text-white) */}
            <h1 className={`text-lg md:text-xl font-black tracking-tight italic uppercase transition-all duration-300 font-serif ${
              isScrolled || isOpen ? 'text-[#b46233]' : 'text-[#ffffff] md:text-white drop-shadow-lg'
            }`}>
              24 FRAMES <span className="text-[#272727] font-bold tracking-widest not-italic">STUDIO</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-12">
            <NavLink href="/portfolio" label="Portfolio" isScrolled={isScrolled} />
            <NavLink href="/gallery" label="Gallery" isScrolled={isScrolled} />
            <NavLink href="/services" label="Services" isScrolled={isScrolled} />
            <NavLink href="/about" label="About" isScrolled={isScrolled} />
          </div>

          {/* Mobile Toggle Button - FIX: Added SVG Icons */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className={`md:hidden z-50 p-2 transition-colors ${
              isScrolled || isOpen ? 'text-[#8B6F47]' : 'text-[#fdfdfd]'
            }`}
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-[55] bg-[#FAF8F3] transition-transform duration-500 ease-in-out md:hidden ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="flex flex-col items-center justify-center h-full gap-10">
          <MobileNavLink href="/" label="home" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/portfolio" label="Portfolio" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/gallery" label="Gallery" onClick={() => setIsOpen(false)} />
          <MobileNavLink href="/services" label="Services" onClick={() => setIsOpen(false)} />

        </div>
      </div>
    </>
  );
};

const NavLink = ({ href, label, isScrolled }: { href: string; label: string; isScrolled: boolean }) => (
  <Link 
    href={href} 
    className={`text-[10px] uppercase font-bold tracking-[0.4em] transition-all duration-300 relative group ${
      isScrolled 
        ? 'text-[#8B6F47] hover:text-[#A0826D]' 
        : 'text-white/90 hover:text-white drop-shadow-md'
    }`}
  >
    {label}
    <span className={`absolute -bottom-2 left-0 w-0 h-[1px] transition-all duration-500 group-hover:w-full ${
      isScrolled ? 'bg-[#8B6F47]' : 'bg-white'
    }`}></span>
  </Link>
);

const MobileNavLink = ({ href, label, onClick }: { href: string; label: string; onClick: () => void }) => (
  <Link 
    href={href} 
    onClick={onClick}
    className="text-2xl uppercase font-bold tracking-[0.3em] text-[#8B6F47] active:text-[#A0826D] font-serif"
  >
    {label}
  </Link>
);

export default Navbar;