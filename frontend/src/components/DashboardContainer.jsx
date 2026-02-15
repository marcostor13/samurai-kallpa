import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import PowerChart from './PowerChart';
import FutureCard from './FutureCard';
import KatanaButton from './KatanaButton';
import AntigravityCard from './AntigravityCard';
import TribeMemberCard from './TribeMemberCard';
import { Phone, MapPin, Calendar, Briefcase, Zap, Target, Mail, User, Info, Users } from 'lucide-react';

export default function DashboardContainer() {
  const [futures, setFutures] = useState([]);
  const [tribe, setTribe] = useState([]);
  const [powerLevel, setPowerLevel] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingTribe, setLoadingTribe] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newFutureTitle, setNewFutureTitle] = useState('');
  const [viewMode, setViewMode] = useState('PERSONAL'); // 'PERSONAL' | 'TRIBE'
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // ... same effect logic ...
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    const fetchData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [dashboardRes, futuresRes, profileRes] = await Promise.all([
          axios.get(`${API_URL}/samurai/dashboard`, config),
          axios.get(`${API_URL}/futures`, config),
          axios.get(`${API_URL}/samurai/me`, config)
        ]);
        
        setUserProfile(profileRes.data);
        // Calculate average progress for Power Level
        const futuresData = futuresRes.data;
        const avgProgress = futuresData.length > 0 
          ? Math.round(futuresData.reduce((acc, curr) => acc + curr.progressPercentage, 0) / futuresData.length)
          : 0;
        
        setPowerLevel(avgProgress);
        setFutures(futuresData);

        // Check for view hint
        const viewHint = localStorage.getItem('tribe_view_hint');
        if (viewHint === 'true') {
            localStorage.removeItem('tribe_view_hint');
            setViewMode('TRIBE');
            // Trigger tribe fetch if needed
            fetchTribeData(token);
        }
      } catch (error) {
        console.error('Error fetching data', error);
        if (error.response && error.response.status === 401) {
             window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateFuture = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
      try {
          const res = await axios.post(`${API_URL}/futures`, { title: newFutureTitle }, {
              headers: { Authorization: `Bearer ${token}` }
          });
          setFutures([...futures, res.data]);
          setNewFutureTitle('');
          setShowCreate(false);
      } catch (error) {
          console.error(error);
      }
  };

  const handleUpdateFuture = async (id, data) => {
      // ... same logic ...
      const token = localStorage.getItem('token');
      try {
          const res = await axios.patch(`${API_URL}/futures/${id}/progress`, data, {
               headers: { Authorization: `Bearer ${token}` }
          });
          const updatedFutures = futures.map(f => f._id === id ? res.data : f);
          setFutures(updatedFutures);
          // Recalculate power level
          const avg = Math.round(updatedFutures.reduce((acc, curr) => acc + curr.progressPercentage, 0) / updatedFutures.length);
          setPowerLevel(avg);
      } catch (error) {
          console.error(error);
      }
  };

  const fetchTribeData = async (token) => {
    setLoadingTribe(true);
    try {
        const res = await axios.get(`${API_URL}/tribe/team`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        // Filter out members who don't have images or are explicitly requested to be removed
        const usersToRemove = ['ALFREDO', 'ANTHONY', 'ARTURO', 'RAYZA', 'MAGGIE'];
        const filteredTribe = res.data.filter(member => !usersToRemove.includes(member.username));

        // Sort by power level
        const sortedTribe = filteredTribe.sort((a, b) => {
            const avgA = a.futures.length ? a.futures.reduce((acc, c) => acc + c.progressPercentage, 0) / a.futures.length : 0;
            const avgB = b.futures.length ? b.futures.reduce((acc, c) => acc + c.progressPercentage, 0) / b.futures.length : 0;
            return avgB - avgA;
        });
        setTribe(sortedTribe);
    } catch (error) {
        console.error("Error fetching tribe", error);
        if (error.response && error.response.status === 401) {
            window.location.href = '/login';
        }
    } finally {
        setLoadingTribe(false);
    }
  };

  const toggleViewMode = async () => {
    if (viewMode === 'PERSONAL') {
        if (tribe.length === 0) {
            const token = localStorage.getItem('token');
            fetchTribeData(token);
        }
        setViewMode('TRIBE');
    } else {
        setViewMode('PERSONAL');
    }
  };

  if (loading) return <div className="text-white text-center mt-20">Cargando...</div>;

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      {/* Dashboard header with better alignment */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6">
        <div>
            <span className="text-kallpa-gold font-display text-xs tracking-[0.4em] uppercase mb-2 block">Centro de Comando</span>
            <h1 className="text-4xl md:text-5xl font-display text-white tracking-tight">
                {viewMode === 'PERSONAL' ? 'Dashboard Personal' : 'El Equipo Samurai'}
            </h1>
        </div>
        
        <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button 
                onClick={() => window.location.href = '/recursos'} 
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-kallpa-teal/10 border border-kallpa-teal text-kallpa-teal font-display text-xs tracking-widest uppercase hover:bg-kallpa-teal hover:text-black transition-all duration-300 group shadow-[0_0_15px_rgba(45,212,191,0.2)]"
                style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 0 100%)' }}
            >
                <Info size={16} className="group-hover:rotate-12 transition-transform" />
                Información Gral
            </button>
            <button 
                onClick={toggleViewMode} 
                className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-gray-900 border border-kallpa-gold text-kallpa-gold font-display text-xs tracking-widest uppercase hover:bg-kallpa-gold hover:text-black transition-all duration-300 group shadow-[0_0_15px_rgba(212,175,55,0.2)]"
                style={{ clipPath: 'polygon(0 0, 90% 0, 100% 30%, 100% 100%, 0 100%)' }}
            >
                {viewMode === 'PERSONAL' ? (
                    <>
                        <Users size={16} className="group-hover:scale-110 transition-transform" />
                        Ver Equipo
                    </>
                ) : (
                    <>
                        <User size={16} className="group-hover:scale-110 transition-transform" />
                        Mi Dashboard
                    </>
                )}
            </button>
        </div>
      </div>

      {viewMode === 'PERSONAL' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Refined Profile & Power Section */}
            <div className="flex flex-col gap-8">
                <AntigravityCard className="relative overflow-hidden">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-kallpa-gold/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    
                    <div className="relative p-2">
                        <div className="flex flex-col items-center text-center">
                            {userProfile && (
                                <div className="relative mb-6">
                                    <div className="relative w-32 h-32 rounded-full border-2 border-kallpa-gold p-1 shadow-[0_0_25px_rgba(212,175,55,0.4)]">
                                        <div className="w-full h-full rounded-full overflow-hidden">
                                            {userProfile.avatarUrl ? (
                                                <img 
                                                    src={userProfile.avatarUrl.replace(/([^/]+)\.jpg$/, (match, name) => {
                                                        return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() + '.jpg';
                                                    })} 
                                                    alt={userProfile.fullName} 
                                                    className="w-full h-full object-cover" 
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = `https://ui-avatars.com/api/?name=${userProfile.fullName}&background=D4AF37&color=fff`;
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-3xl text-kallpa-gold font-display bg-kallpa-surface">
                                                    {userProfile.fullName?.split(' ').map(n => n[0]).join('')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="absolute bottom-2 right-2 w-5 h-5 bg-green-500 rounded-full border-4 border-gray-900 shadow-lg"></div>
                                </div>
                            )}
                            
                            <h2 className="text-2xl font-display text-white mb-1 uppercase tracking-tight">{userProfile?.fullName || 'Guerrero Samurai'}</h2>
                            <p className="text-kallpa-gold text-xs tracking-[0.3em] font-display mb-8 uppercase opacity-80">{userProfile?.occupation || 'Participante E23'}</p>
                            
                            <div className="w-full max-w-[200px] mb-8">
                                <PowerChart percentage={powerLevel} />
                            </div>
                        </div>

                        {userProfile && (
                            <div className="space-y-4 border-t border-white/5 pt-6 mt-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col group p-3 rounded-lg bg-white/5 border border-transparent hover:border-kallpa-gold/20 transition-all">
                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                                            <Phone size={10} className="text-kallpa-gold" /> Teléfono
                                        </span>
                                        <span className="text-xs text-white font-medium">{userProfile.phone || 'S/D'}</span>
                                    </div>
                                    <div className="flex flex-col group p-3 rounded-lg bg-white/5 border border-transparent hover:border-kallpa-teal/20 transition-all">
                                        <span className="text-[9px] text-gray-500 uppercase tracking-widest font-bold mb-1 flex items-center gap-1">
                                            <MapPin size={10} className="text-kallpa-teal" /> Ciudad
                                        </span>
                                        <span className="text-xs text-white font-medium truncate">Lima, PE</span>
                                    </div>
                                </div>

                                <div className="flex flex-col group p-4 rounded-lg bg-gradient-to-br from-kallpa-gold/10 to-transparent border border-kallpa-gold/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <Zap size={40} />
                                    </div>
                                    <span className="text-[9px] text-kallpa-gold uppercase tracking-[0.2em] font-bold mb-2 block">Salto Cuántico</span>
                                    <span className="text-sm text-white italic font-serif leading-relaxed line-clamp-2">
                                        "{userProfile.quantumLeap || 'Camino a la Leyenda'}"
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </AntigravityCard>
            </div>
    
            {/* Future Management */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-display text-kallpa-text">Mis Futuros Imposibles</h2>
                    <KatanaButton onClick={() => setShowCreate(!showCreate)} className="text-xs px-4 py-2">
                        {showCreate ? 'Cancelar' : 'Declarar Futuro'}
                    </KatanaButton>
                </div>
    
                {showCreate && (
                    <div className="mb-6 animate-fadeIn">
                        <form onSubmit={handleCreateFuture} className="flex gap-4">
                            <input 
                                type="text" 
                                value={newFutureTitle} 
                                onChange={(e) => setNewFutureTitle(e.target.value)}
                                placeholder="Título del Futuro Imposible..." 
                                className="flex-1 bg-black/50 border border-gray-700 text-white p-3 rounded focus:border-kallpa-gold focus:outline-none"
                                required
                            />
                            <KatanaButton type="submit" className="whitespace-nowrap">Crear</KatanaButton>
                        </form>
                    </div>
                )}
    
                <div className="space-y-4">
                    {futures.map((future, idx) => (
                        <FutureCard key={future._id} future={future} onUpdate={handleUpdateFuture} index={idx} />
                    ))}
                    {futures.length === 0 && (
                        <p className="text-kallpa-muted text-center py-8">No has declarado ningún futuro imposible aún. ¡Empieza ahora!</p>
                    )}
                </div>
            </div>
        </div>
      ) : (
        loadingTribe ? (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-kallpa-gold"></div>
            </div>
        ) : (
            <div className="space-y-12 animate-fadeIn">
                {/* Managers Section */}
                {(() => {
                    const managerNicknames = ['DAVID', 'FERNANDO', 'GARETH', 'GIOVI', 'GISSE', 'JESSI', 'VANEZA'];
                    const managers = tribe.filter(m => managerNicknames.includes(m.username));
                    const warriors = tribe.filter(m => !managerNicknames.includes(m.username));
                    
                    return (
                        <>
                            {managers.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-kallpa-gold/50 to-transparent"></div>
                                        <h2 className="text-2xl font-display text-kallpa-gold tracking-widest uppercase">Mánagers</h2>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-kallpa-gold/50 to-transparent"></div>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-6">
                                        {managers.map(member => (
                                            <TribeMemberCard key={member._id} member={member} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {warriors.length > 0 && (
                                <section>
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-kallpa-fire/50 to-transparent"></div>
                                        <h2 className="text-2xl font-display text-white tracking-widest uppercase">Equipo Samurai</h2>
                                        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-kallpa-fire/50 to-transparent"></div>
                                    </div>
                                    <div className="flex flex-wrap justify-center gap-6">
                                        {warriors.map(member => (
                                            <TribeMemberCard key={member._id} member={member} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {tribe.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-kallpa-muted italic">No se encontraron miembros en el equipo aún.</p>
                                </div>
                            )}
                        </>
                    );
                })()}
            </div>
        )
      )}
    </div>
  );
}
