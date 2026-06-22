import React from 'react';

interface CleusaLogoProps {
  variant?: 'horizontal' | 'vertical' | 'badge';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function CleusaLogo({ variant = 'vertical', className = '', size = 'md' }: CleusaLogoProps) {
  // Deep luxurious wine red: #61152a
  // Warm golden accent color: #ab8140
  
  const chefHatSvg = (
    <svg viewBox="0 0 120 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* 1. Main outer chef's hat puff outlines in gold with subtle metallic shade */}
      <path
        d="M 38,62 
           C 24,56 22,40 34,31 
           C 28,12 55,7 60,22 
           C 65,7 92,12 86,31 
           C 98,40 96,56 82,62 
           Z"
        stroke="#ab8140"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      {/* 2. Lower hat band layers */}
      <path
        d="M 36,66 C 45,63 55,62 60,62 C 65,62 75,63 84,66"
        stroke="#ab8140"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <path
        d="M 39,71 C 46,69 54,68 60,68 C 66,68 74,69 81,71"
        stroke="#ab8140"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      
      {/* 3. Sweeping gold highlights below head band */}
      <path
        d="M 50,75 Q 60,70 70,75"
        stroke="#ab8140"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      
      {/* 4. Elegant Wine Red Heart centered inside the chef's hat cap */}
      <path
        d="M 60,48 
           C 57,41 49,38 49,44 
           C 49,49 60,57 60,57 
           C 60,57 71,49 71,44 
           C 71,38 63,41 60,48 
           Z"
        fill="#61152a"
        stroke="#ab8140"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (variant === 'badge') {
    return (
      <div className={`relative flex items-center justify-center rounded-full bg-white/90 shadow-[0px_4px_15px_rgba(97,21,42,0.15)] border border-[#ab8140]/30 ${className}`}>
        <div className="w-4/5 h-4/5">
          {chefHatSvg}
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-12 h-10 shrink-0">
          {chefHatSvg}
        </div>
        <div className="flex flex-col select-none">
          <span className="font-serif italic font-bold text-xl text-[#61152a] leading-none tracking-tight">
            Cleusa
          </span>
          <span className="text-[9px] font-bold text-[#ab8140] tracking-[0.25em] uppercase leading-none mt-1">
            Bolos
          </span>
        </div>
      </div>
    );
  }

  // Detailed complete vertical layout matching the brand logo card
  return (
    <div className={`flex flex-col items-center text-center select-none ${className}`}>
      {/* Puffy Chef's Hat with Heart */}
      <div className={`
        ${size === 'sm' ? 'w-20 h-16' : size === 'lg' ? 'w-36 h-28' : 'w-28 h-22'} 
        animate-in fade-in zoom-in-75 duration-700
      `}>
        {chefHatSvg}
      </div>
      
      {/* "Cleusa" Calligraphy styling */}
      <h1 className={`
        font-serif font-bold text-[#61152a] italic leading-none
        ${size === 'sm' ? 'text-4xl mt-1' : size === 'lg' ? 'text-7xl mt-4' : 'text-5xl mt-2'}
        tracking-tight select-none
      `} style={{ textShadow: '1px 1px 0px rgba(171, 129, 64, 0.1)' }}>
        Cleusa
      </h1>
      
      {/* "BOLOS" word with gold side-rules */}
      <div className="flex items-center justify-center gap-3 w-full mt-2.5 max-w-[280px]">
        <div className="h-[1.5px] bg-[#ab8140] flex-1 opacity-70"></div>
        <span className={`
          font-sans font-bold text-[#ab8140] tracking-[0.35em] uppercase select-none leading-none
          ${size === 'sm' ? 'text-[9px]' : size === 'lg' ? 'text-sm' : 'text-xs'}
        `}>
          BOLOS
        </span>
        <div className="h-[1.5px] bg-[#ab8140] flex-1 opacity-70"></div>
      </div>
      
      {/* Mini Wine heart decoration */}
      <div className={`
        text-[#61152a] mt-2 animate-pulse
        ${size === 'sm' ? 'text-xs' : 'text-sm'}
      `}>
        ♥
      </div>
    </div>
  );
}
