import React from 'react';

export const BannerCarousel: React.FC = () => {
  return (
    <div className="w-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 px-4 gap-4" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      <div className="snap-center shrink-0 w-[85%] h-32 bg-gradient-to-r from-[var(--primary)] to-[var(--accent-coin)] rounded-xl flex flex-col justify-center px-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay"></div>
        <h3 className="text-white font-bold text-lg z-10 relative">Special Weekend Offers</h3>
        <p className="text-white/90 text-sm z-10 relative">Save big on your favorite brands</p>
      </div>
      <div className="snap-center shrink-0 w-[85%] h-32 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex flex-col justify-center px-6 shadow-md relative overflow-hidden">
        <h3 className="text-white font-bold text-lg z-10 relative">New Arrivals</h3>
        <p className="text-white/90 text-sm z-10 relative">Check out the latest rewards</p>
      </div>
    </div>
  );
};
