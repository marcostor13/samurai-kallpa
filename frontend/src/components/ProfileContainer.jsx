import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AntigravityCard from './AntigravityCard';
import { User, Phone, MapPin, Calendar, Briefcase, Zap, Target, Mail } from 'lucide-react';

export default function ProfileContainer({ memberId: propMemberId } = {}) {
    const [member, setMember] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                // Determine member ID from props or URL
                let id = propMemberId;
                if (!id && typeof window !== 'undefined') {
                    const params = new URLSearchParams(window.location.search);
                    id = params.get('id');
                }

                if (!id) {
                    setError('ID de guerrero no proporcionado.');
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${API_URL}/tribe/team/${id}`);
                setMember(response.data);
            } catch (err) {
                console.error('Error fetching profile:', err);
                setError('No se pudo cargar el perfil del guerrero.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [propMemberId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-kallpa-gold border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-kallpa-gold font-display animate-pulse">CANALIZANDO KI...</p>
            </div>
        );
    }

    if (error || !member) {
        return (
            <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
                <AntigravityCard className="p-12">
                    <p className="text-red-400 font-display text-xl">{error || 'Guerrero no encontrado.'}</p>
                    <a href="/dashboard" className="mt-6 inline-block text-kallpa-teal hover:underline font-bold uppercase tracking-wider text-xs">Volver al Equipo</a>
                </AntigravityCard>
            </div>
        );
    }

    const averageProgress = member.futures.length > 0
        ? Math.round(member.futures.reduce((acc, curr) => acc + curr.progressPercentage, 0) / member.futures.length)
        : 0;

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-8">
            {/* Top Back Button */}
            <div className="flex justify-start">
                <a href="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-black/40 text-kallpa-gold border border-kallpa-gold/30 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-kallpa-gold hover:text-black transition-all duration-300">
                    <span className="text-lg">←</span> Volver al Equipo
                </a>
            </div>

            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-kallpa-surface border border-kallpa-gold/20 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-kallpa-gold/10 via-transparent to-kallpa-fire/5"></div>
                
                <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar with Glow */}
                    <div className="relative">
                        <div className="w-48 h-48 rounded-full border-4 border-kallpa-gold overflow-hidden shadow-[0_0_50px_rgba(212,175,55,0.3)]">
                            <img 
                                src={member.avatarUrl?.replace(/([^/]+)\.(jpg|png|webp)$/, (match, name) => {
                                    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() + '.webp';
                                })} 
                                alt={member.fullName} 
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://ui-avatars.com/api/?name=${member.fullName}&size=200&background=111&color=d4af37`;
                                }}
                            />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-kallpa-gold text-black px-6 py-1.5 rounded-full font-black text-[10px] uppercase tracking-tighter shadow-xl whitespace-nowrap">
                            {averageProgress}% Avance FIs
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="flex-grow text-center md:text-left">
                        <h1 className="text-4xl md:text-6xl font-display text-white mb-6 drop-shadow-sm">{member.fullName}</h1>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                            {member.email && (
                                <a 
                                    href={`mailto:${member.email}`}
                                    className="flex items-center gap-3 text-gray-400 hover:text-kallpa-teal transition-colors cursor-pointer"
                                >
                                    <Mail size={18} className="text-kallpa-teal" />
                                    <span>{member.email}</span>
                                </a>
                            )}
                            {member.phone && (
                                <a 
                                    href={`https://wa.me/${member.phone?.replace(/\D/g, '')}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 text-gray-400 hover:text-kallpa-teal transition-colors cursor-pointer"
                                >
                                    <Phone size={18} className="text-kallpa-teal" />
                                    <span>{member.phone}</span>
                                </a>
                            )}
                            {member.address && (
                                <div className="flex items-center gap-3 text-gray-400">
                                    <MapPin size={18} className="text-kallpa-teal" />
                                    <span className="truncate">{member.address}</span>
                                </div>
                            )}
                        </div>

                        {member.bio && (
                            <div className="mt-8 p-4 bg-black/40 rounded-xl border border-white/5 italic text-gray-300">
                                "{member.bio}"
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Stats & Meta */}
                <div className="space-y-6">
                    <AntigravityCard className="p-6">
                        <h3 className="text-kallpa-gold font-display mb-4 border-b border-kallpa-gold/20 pb-2">EXPEDIENTE KALLPA</h3>
                        
                        <div className="space-y-4 text-sm">
                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 uppercase text-[10px] tracking-tighter">Ocupación</label>
                                <div className="flex items-center gap-2 text-white">
                                    <Briefcase size={16} className="text-kallpa-gold" />
                                    <span>{member.occupation || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-gray-500 uppercase text-[10px] tracking-tighter">Nacimiento</label>
                                <div className="flex items-center gap-2 text-white">
                                    <Calendar size={16} className="text-kallpa-gold" />
                                    <span>{member.birthDate || 'N/A'}</span>
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-white/5">
                                <label className="text-kallpa-fire uppercase text-[10px] font-bold mb-2 block tracking-widest">Salto Cuántico</label>
                                <div className="flex gap-2 text-white/90">
                                    <Zap size={20} className="text-kallpa-fire shrink-0" />
                                    <p className="text-xs leading-relaxed">{member.quantumLeap || 'El guerrero aún no revela su salto cuántico.'}</p>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <label className="text-kallpa-teal uppercase text-[10px] font-bold mb-2 block tracking-widest">IMO</label>
                                <div className="flex gap-2 text-white/90">
                                    <Target size={20} className="text-kallpa-teal shrink-0" />
                                    <p className="text-xs leading-relaxed">{member.imo || 'Misión no definida.'}</p>
                                </div>
                            </div>
                        </div>
                    </AntigravityCard>
                </div>

                {/* Right Column: Futuros Imposibles */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-2xl font-display text-white border-l-4 border-kallpa-fire pl-4">FUTUROS IMPOSIBLES</h2>
                    
                    <div className="space-y-4">
                        {member.futures.map((future, idx) => (
                            <div key={future._id} className="group relative bg-kallpa-surface border border-white/5 rounded-2xl overflow-hidden hover:border-kallpa-gold/30 transition-all duration-300">
                                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-kallpa-gold to-kallpa-fire opacity-40"></div>
                                
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex gap-4">
                                            <span className="text-4xl font-black text-white/5 font-display select-none">0{idx + 1}</span>
                                            <div>
                                                <h3 className="text-lg font-bold text-white group-hover:text-kallpa-gold transition-colors">{future.title}</h3>
                                                <p className="text-sm text-gray-400 mt-1">{future.description}</p>
                                            </div>
                                        </div>
                                        <div className="bg-black/40 px-3 py-1 rounded-full border border-kallpa-gold/20 text-kallpa-gold font-bold text-xs uppercase">
                                            {future.progressPercentage}%
                                        </div>
                                    </div>

                                    {/* Progress Bar */}
                                    <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                                        <div 
                                            className="h-full bg-gradient-to-r from-kallpa-gold to-kallpa-fire transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.5)]" 
                                            style={{ width: `${future.progressPercentage}%` }}
                                        ></div>
                                    </div>

                                    {/* Evidences if any */}
                                    {future.evidences && future.evidences.length > 0 && (
                                        <div className="mt-6">
                                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mb-3">Evidencias ({future.evidences.length})</p>
                                            <div className="flex flex-wrap gap-2">
                                                {future.evidences.map((ev, i) => (
                                                    <a 
                                                        key={i} 
                                                        href={ev.url} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer"
                                                        className="w-12 h-12 rounded-lg border border-white/10 overflow-hidden hover:border-kallpa-gold transition-colors"
                                                    >
                                                        <img src={ev.url} alt="Evidencia" className="w-full h-full object-cover" />
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
