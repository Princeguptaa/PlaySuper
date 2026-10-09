import React from 'react';

export const PhoneFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative w-full max-w-[390px] h-full max-h-[844px] bg-background md:rounded-[40px] md:border-[8px] border-surface shadow-2xl overflow-hidden mx-auto flex flex-col">
      {/* Fake notch for desktop viewing */}
      <div className="hidden md:block absolute top-0 inset-x-0 h-6 bg-surface z-50 rounded-b-3xl w-40 mx-auto" />
      <div className="flex-1 overflow-y-auto no-scrollbar relative">
        {children}
      </div>
    </div>
  );
};
