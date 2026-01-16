'use client';
import Link from 'next/link';

const packages = [
  {
    name: "The Essential",
    price: "$1,800",
    description: "Perfect for intimate celebrations and civil ceremonies.",
    features: [
      "6 Hours Coverage",
      "Single Photographer",
      "300+ Digital High-Res Photos",
      "Online Private Gallery",
      "Print Release"
    ],
    highlight: false
  },
  {
    name: "The Signature",
    price: "$2,500",
    description: "Our most popular choice for full-day wedding storytelling.",
    features: [
      "8 Hours Coverage",
      "Two Photographers",
      "500+ Digital High-Res Photos",
      "Complimentary Engagement Session",
      "Premium Linen Photo Box"
    ],
    highlight: true // This will give it a subtle standout background
  },
  {
    name: "The Cinematic",
    price: "$4,200",
    description: "Complete coverage including high-end videography.",
    features: [
      "10 Hours Photography & Video",
      "Full Creative Team (3 people)",
      "5-7 Minute Cinematic Highlight Film",
      "800+ Digital High-Res Photos",
      "Hand-crafted Leather Album"
    ],
    highlight: false
  }
];

export default function PricingSection() {
  return (
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
          {packages.map((pkg, index) => (
            <div 
              key={index} 
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
                {pkg.features.map((feature, i) => (
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
                Inquire for Date
              </Link>
            </div>
          ))}
        </div>

        {/* Custom Quote Footer */}
        <div className="mt-20 p-12 border border-dashed border-[#D4C4B0] text-center bg-[#FAF8F3]/50">
          <h4 className="font-['Playfair_Display'] text-xl text-[#8B6F47] mb-2">Looking for something bespoke?</h4>
          <p className="text-gray-500 text-sm mb-6">We offer custom destination wedding packages worldwide.</p>
          <Link href="/contact" className="text-[#8B6F47] font-bold text-xs uppercase tracking-widest border-b border-[#8B6F47] pb-1 hover:text-black hover:border-black transition-all">
            Contact for Custom Quote
          </Link>
        </div>
      </div>
    </section>
  );
}