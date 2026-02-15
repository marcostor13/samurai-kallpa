import React from 'react';

export default function KatanaButton({ children, onClick, className = '', type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`relative px-8 py-3 bg-kallpa-gold text-kallpa-dark font-sans font-bold uppercase tracking-widest transition-all duration-300 transform hover:scale-105 hover:bg-white hover:shadow-gold-glow active:scale-95 ${className}`}
      style={{
        clipPath: 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 0 100%)',
      }}
    >
      {children}
    </button>
  );
}
