import React from 'react';
import AntigravityCard from './AntigravityCard';
import { FileText, Download, Calendar, Clock, MapPin, Star, ChevronLeft } from 'lucide-react';
import { agendaSamurai } from '../data/agenda';

export default function ResourcesContainer() {
    // Current date for highlighting the next activity
    // Using Feb 14, 2026 as reference if today is earlier, or real Date.now()
    const today = new Date();
    
    // Find Next Activity
    const nextActivity = agendaSamurai.find(item => {
        const itemDate = new Date(item.endDate || item.date);
        return itemDate >= today;
    }) || agendaSamurai[agendaSamurai.length - 1];

    const pdfs = [
        { name: "CALENDARIO E23", file: "CALENDARIO E23.pdf", icon: <Calendar className="text-kallpa-gold" /> },
        { name: "DIRECTORIO E 23", file: "DIRECTORIO E 23-1 (4).pdf", icon: <FileText className="text-kallpa-teal" /> },
        { name: "ENTRENAMIENTOS SUSTENTABLES", file: "ENTRENAMIENTOS SUSTENTABLES 1 FDS.pdf", icon: <Star className="text-kallpa-fire" /> },
        { name: "INSTRUCTIVO FUTUROS IMPOSIBLES", file: "INSTRUCTIVO PARA CREAR TUS FUTUROS IMPOSIBLES.pdf", icon: <FileText className="text-kallpa-gold" /> },
        { name: "MANUAL DE IDENTIDAD", file: "MANUAL DE DISTINTIVOS IDENTIDAD CREAR (1).pdf", icon: <Star className="text-kallpa-teal" /> }
    ];

    return (
        <div className="max-w-6xl mx-auto px-4 space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <a href="/dashboard" className="p-2 bg-gray-800 rounded-full border border-gray-700 text-gray-400 hover:text-white transition-colors">
                        <ChevronLeft size={24} />
                    </a>
                    <div>
                        <h1 className="text-4xl font-display text-white">Información General</h1>
                        <p className="text-kallpa-muted uppercase tracking-widest text-xs mt-1">Recursos y Agenda del Equipo 23</p>
                    </div>
                </div>
                
                {nextActivity && (
                    <div className="bg-kallpa-gold/10 border border-kallpa-gold/30 p-4 rounded-2xl flex items-center gap-4 animate-pulse-subtle">
                        <div className="bg-kallpa-gold text-black p-3 rounded-xl font-black shadow-[0_0_20px_rgba(212,175,55,0.4)]">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] text-kallpa-gold font-bold uppercase tracking-widest">Actividad más próxima</p>
                            <h3 className="text-white font-bold">{nextActivity.title}</h3>
                            <p className="text-xs text-gray-400">{new Date(nextActivity.date).toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                {/* PDF Downloads */}
                <div className="space-y-6">
                    <h2 className="text-xl font-display text-kallpa-gold uppercase tracking-tighter">Documentos de Maestría</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {pdfs.map((pdf, idx) => (
                            <a 
                                key={idx} 
                                href={`/info/${pdf.file}`} 
                                download 
                                className="group bg-kallpa-surface border border-white/5 p-4 rounded-2xl flex items-center justify-between hover:border-kallpa-gold/50 transition-all duration-300"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:bg-kallpa-gold/20 transition-colors">
                                        {pdf.icon}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white group-hover:text-kallpa-gold transition-colors">{pdf.name}</h4>
                                        <p className="text-[10px] text-gray-500 uppercase">PDF • Descargar</p>
                                    </div>
                                </div>
                                <Download size={18} className="text-gray-600 group-hover:text-kallpa-gold transition-colors" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Agenda */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-xl font-display text-white uppercase tracking-tighter flex items-center gap-3">
                        <Calendar className="text-kallpa-fire" />
                        Agenda Samurai
                    </h2>
                    
                    <div className="space-y-4">
                        {agendaSamurai.map((item) => {
                            const isNext = item.id === nextActivity?.id;
                            const isPast = new Date(item.endDate || item.date) < today;

                            return (
                                <div 
                                    key={item.id} 
                                    className={`relative group p-6 rounded-2xl border transition-all duration-300 ${
                                        isNext 
                                        ? 'bg-kallpa-gold/5 border-kallpa-gold/40 shadow-[0_0_30px_rgba(212,175,55,0.05)]' 
                                        : 'bg-kallpa-surface border-white/5 hover:border-white/10'
                                    } ${isPast ? 'opacity-40 grayscale' : ''}`}
                                >
                                    {isNext && (
                                        <div className="absolute -top-3 left-6 bg-kallpa-gold text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-xl">
                                            Próximamente
                                        </div>
                                    )}

                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex gap-4 items-start">
                                            <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center font-display leading-none border shrink-0 ${
                                                isNext ? 'bg-kallpa-gold text-black border-kallpa-gold' : 'bg-black/40 text-kallpa-gold border-kallpa-gold/20'
                                            }`}>
                                                <span className="text-lg font-black">{new Date(item.date).getDate()}</span>
                                                <span className="text-[8px] uppercase">{new Date(item.date).toLocaleDateString('es-ES', { month: 'short' }).replace('.', '')}</span>
                                            </div>
                                            <div>
                                                <h3 className={`text-lg font-bold ${isNext ? 'text-kallpa-gold' : 'text-white'}`}>{item.title}</h3>
                                                {item.subtitle && <p className="text-xs text-gray-400 mt-1">{item.subtitle}</p>}
                                                <div className="flex flex-wrap gap-4 mt-3">
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                                        <Clock size={12} className="text-kallpa-fire" />
                                                        {item.time}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                                        <MapPin size={12} className="text-kallpa-teal" />
                                                        {item.location}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                            item.type === 'FDS' ? 'bg-kallpa-fire/10 text-kallpa-fire border-kallpa-fire/30' : 
                                            item.type === 'ENTRENAMIENTO' ? 'bg-kallpa-teal/10 text-kallpa-teal border-kallpa-teal/30' :
                                            'bg-gray-800 text-gray-400 border-gray-700'
                                        }`}>
                                            {item.type}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
