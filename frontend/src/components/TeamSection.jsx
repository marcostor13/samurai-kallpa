import React from 'react';
import AntigravityCard from './AntigravityCard';
import { teamMembers } from '../data/team';

export default function TeamSection() {
    return (
        <section className="py-20 w-full max-w-7xl mx-auto">
            <h2 className="text-4xl font-display text-kallpa-text mb-16 text-center">
                <span className="border-b-2 border-kallpa-fire pb-2">El Equipo</span>
            </h2>
            
            {(() => {
                const managerNames = [
                    "David Emerson Contreras Luchine",
                    "Fernando Abel López López",
                    "Gareth Ramos Pérez",
                    "Giovana Palomino Marcos",
                    "Gissella Milagros Huamán Celestino",
                    "Jessica Pilar López López",
                    "Rosa Vaneza Ramirez Hualpa"
                ];
                
                const managers = teamMembers.filter(m => managerNames.includes(m.name));
                const warriors = teamMembers.filter(m => !managerNames.includes(m.name));
                
                const renderMembers = (members, title, colorClass) => (
                    <div className="mb-20 last:mb-0">
                        <div className="flex items-center gap-4 mb-12">
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                            <h3 className={`text-2xl font-display ${colorClass} tracking-[0.2em] uppercase`}>{title}</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
                        </div>
                        <div className="flex flex-wrap justify-center gap-8 px-4">
                            {members.map((member, idx) => (
                                <AntigravityCard key={idx} className="w-full sm:w-80 flex flex-col items-center text-center p-8 group hover:translate-y-[-5px] transition-all duration-300 border border-white/5 bg-kallpa-dark/50">
                                    <div className="relative w-28 h-28 rounded-full bg-gray-900 mb-6 border border-kallpa-gold/50 overflow-hidden group-hover:border-kallpa-gold transition-all duration-500 shadow-[0_0_20px_rgba(212,175,55,0.15)] group-hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] mx-auto">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-all duration-700" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xl text-kallpa-muted font-display bg-kallpa-surface">SK</div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-display text-kallpa-gold tracking-[0.2em] font-medium transition-colors uppercase">{member.nickname}</h3>
                                        <p className="text-[9px] font-sans text-white/40 uppercase tracking-[0.3em] font-medium leading-relaxed max-w-[200px] mx-auto group-hover:text-white/70 transition-colors">{member.name}</p>
                                    </div>
                                </AntigravityCard>
                            ))}
                        </div>
                    </div>
                );

                return (
                    <>
                        {managers.length > 0 && renderMembers(managers, "Mánagers", "text-kallpa-gold")}
                        {warriors.length > 0 && renderMembers(warriors, "Equipo Samurai", "text-white")}
                    </>
                );
            })()}
        </section>
    );
}
