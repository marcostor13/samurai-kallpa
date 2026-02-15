import React, { useEffect, useState } from 'react';
import { Menu, X, LayoutDashboard, Info, Users, LogOut, LogIn, Home } from 'lucide-react';

export default function HeaderUser() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (loading) return null;

  return (
    <>
      {/* Brand Logo */}
      <a href="/" className="flex items-center gap-3 group">
        <div className="relative w-10 h-10 md:w-12 md:h-12 overflow-hidden">
            <img 
                src="/logo.png" 
                alt="Samurai Kallpa" 
                className="w-full h-full object-contain filter drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] group-hover:scale-110 transition-transform duration-300"
            />
        </div>
        <div className="flex flex-col">
            <span className="text-kallpa-gold font-display font-black text-sm md:text-lg leading-tight tracking-tighter">SAMURAI</span>
            <span className="text-white font-display text-[10px] md:text-xs tracking-[0.3em] font-light opacity-80 uppercase leading-none">Kallpa</span>
        </div>
      </a>

      {isLoggedIn ? (
        <div className="flex items-center">
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-6 items-center">
            <a href="/" className="text-white/70 hover:text-white transition-colors text-xs font-display uppercase tracking-widest">
                Inicio
            </a>
            <a href="/dashboard" className="text-white hover:text-kallpa-gold font-bold font-display uppercase tracking-widest text-sm transition-colors">
                Panel
            </a>
            <button 
                onClick={handleLogout} 
                className="px-6 py-2 bg-transparent border border-kallpa-fire text-kallpa-fire font-bold font-display uppercase tracking-widest text-sm hover:bg-kallpa-fire hover:text-white transition-all duration-300 transform hover:skew-x-[-10deg] clip-path-katana"
            >
                Cerrar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="md:hidden p-2 text-kallpa-gold hover:text-white transition-colors"
            aria-label="Abrir menú"
          >
            <Menu size={28} />
          </button>

          {/* Mobile Menu Overlay */}
          {isMenuOpen && (
            <div className="fixed inset-0 z-[100] md:hidden overflow-hidden">
              {/* Backdrop */}
              <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
                onClick={() => setIsMenuOpen(false)}
              />
              
              {/* Menu Content */}
              <div className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-kallpa-dark border-l border-kallpa-gold/20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] flex flex-col p-8 animate-slideInRight">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" className="w-8 h-8 object-contain" alt="Logo" />
                    <div className="flex flex-col">
                        <span className="text-kallpa-gold font-display font-bold tracking-widest text-sm">SAMURAI</span>
                        <span className="text-white/50 text-[10px] tracking-[0.3em] uppercase">Kallpa</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsMenuOpen(false)}
                    className="p-2 text-kallpa-gold hover:text-white transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="flex flex-col gap-6">
                  <a 
                    href="/" 
                    className="flex items-center gap-4 text-white hover:text-kallpa-gold font-bold font-display uppercase tracking-widest transition-all p-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Home size={20} className="text-white/50" />
                    Inicio
                  </a>
                  <a 
                    href="/dashboard" 
                    className="flex items-center gap-4 text-white hover:text-kallpa-gold font-bold font-display uppercase tracking-widest transition-all p-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LayoutDashboard size={20} className="text-kallpa-gold" />
                    Panel
                  </a>
                  <a 
                    href="/recursos" 
                    className="flex items-center gap-4 text-white hover:text-kallpa-gold font-bold font-display uppercase tracking-widest transition-all p-3 rounded-lg hover:bg-white/5"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info size={20} className="text-kallpa-teal" />
                    General
                  </a>
                  <a 
                    href="/dashboard" 
                    className="flex items-center gap-4 text-white hover:text-kallpa-gold font-bold font-display uppercase tracking-widest transition-all p-3 rounded-lg hover:bg-white/5"
                    onClick={() => {
                        localStorage.setItem('tribe_view_hint', 'true');
                        setIsMenuOpen(false);
                    }}
                  >
                    <Users size={20} className="text-kallpa-fire" />
                    Ver Equipo
                  </a>
                  
                  <div className="h-px bg-white/10 my-4" />
                  
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-4 text-kallpa-fire hover:text-white font-bold font-display uppercase tracking-widest transition-all p-3 rounded-lg hover:bg-kallpa-fire/10"
                  >
                    <LogOut size={20} />
                    Cerrar Sesión
                  </button>
                </div>
                
                <div className="mt-auto text-center opacity-30">
                  <p className="text-[10px] tracking-[0.3em] font-display text-kallpa-gold uppercase">Samurai Kallpa 2026</p>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <a href="/" className="text-white/70 hover:text-white transition-colors text-xs font-display uppercase tracking-widest hidden md:block mr-4">
              Inicio
          </a>
          <a href="/login" className="px-6 py-2 bg-kallpa-gold text-black font-bold font-display uppercase tracking-widest text-sm hover:bg-white transition-colors duration-300 transform hover:skew-x-[-10deg] clip-path-katana">
            Ingresar
          </a>
        </div>
      )}
    </>
  );
}
