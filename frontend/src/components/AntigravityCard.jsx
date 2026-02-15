import React from 'react';

export default function AntigravityCard({ children, className = '', ...props }) {
  return (
    <div className={`bg-kallpa-surface border border-gray-800 p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-fire-glow hover:border-kallpa-fire relative overflow-hidden group ${className}`} {...props}>
      <div className="absolute inset-0 bg-chakana-pattern opacity-5 pointer-events-none"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
