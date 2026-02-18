import React from 'react';
import AntigravityCard from './AntigravityCard';

export default function TribeMemberCard({ member }) {
  const averageProgress = member.futures.length > 0
    ? Math.round(member.futures.reduce((acc, curr) => acc + curr.progressPercentage, 0) / member.futures.length)
    : 0;

  return (
    <AntigravityCard 
        className="w-full sm:w-80 flex flex-col group relative overflow-hidden transition-all duration-300 hover:shadow-gold-glow cursor-pointer"
        onClick={() => window.location.href = `/perfil?id=${member._id}`}
    >
        {/* Dynamic Background Gradient based on Power Level */}
        <div 
            className={`absolute inset-0 opacity-10 transition-opacity duration-500 group-hover:opacity-20 ${
                averageProgress === 100 ? 'bg-gradient-to-br from-green-500 via-emerald-900 to-black' : 
                averageProgress > 50 ? 'bg-gradient-to-br from-kallpa-gold via-yellow-900 to-black' : 
                'bg-gradient-to-br from-gray-700 via-gray-900 to-black'
            }`}
        ></div>

        <div className="relative z-10 flex flex-col items-center text-center mb-6 gap-4">
            <div className="relative">
                <div className="relative w-20 h-20 rounded-full border-2 border-kallpa-gold overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] group-hover:shadow-gold-glow transition-all duration-300">
                    {member.avatarUrl ? (
                        <img 
                            src={member.avatarUrl.replace(/([^/]+)\.(jpg|png|webp)$/, (match, name) => {
                                return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase() + '.webp';
                            })} 
                            alt={member.fullName} 
                            className="w-full h-full object-cover" 
                            onError={(e) => {
                                e.target.onerror = null; 
                                e.target.src = `https://ui-avatars.com/api/?name=${member.fullName}&background=random`;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-kallpa-muted font-display bg-kallpa-surface">SK</div>
                    )}
                </div>
                <div className="absolute top-0 -right-2 bg-kallpa-gold/20 border border-kallpa-gold/40 backdrop-blur-md rounded-full px-2 py-1 flex items-center gap-1 shadow-lg">
                    <span className="text-xs font-black text-kallpa-gold leading-none">{averageProgress}%</span>
                </div>
            </div>
            
            <div className="flex flex-col items-center">
                <h3 className="text-sm font-display text-kallpa-gold tracking-[0.2em] font-medium transition-colors uppercase">{member.fullName}</h3>
                {averageProgress === 100 && <span className="text-[9px] text-green-400 font-bold tracking-[0.2em] mt-1 opacity-80">★ LEGENDARIO</span>}
            </div>
        </div>
        
        <div className="relative z-10 flex-grow pt-4 border-t border-gray-800/30">
            <h4 className="text-kallpa-gold font-bold text-xs uppercase tracking-[0.15em] mb-4 flex items-center">
                <span className="w-2 h-2 bg-kallpa-fire rounded-full mr-3 shadow-[0_0_8px_#ff4500]"></span>
                Futuros Imposibles
            </h4>
            {member.futures && member.futures.length > 0 ? (
                <ul className="space-y-4">
                    {member.futures.map((future, idx) => (
                        <li key={idx} className="bg-black/30 p-3 rounded-lg flex flex-col gap-2 text-xs border border-white/5 hover:border-kallpa-gold/20 transition-all duration-300">
                            <div className="flex justify-between items-center w-full">
                                <span className={`font-semibold tracking-wide ${future.status === 'ACHIEVED' ? 'text-green-400' : 'text-gray-200'}`}>
                                    {future.title}
                                </span>
                                <span className={`${future.status === 'ACHIEVED' ? 'text-green-500 font-black' : 'text-gray-500 font-bold'}`}>
                                    {future.progressPercentage}%
                                </span>
                            </div>
                            <div className="w-full h-1.5 bg-gray-900 rounded-full overflow-hidden shadow-inner">
                                <div 
                                    className={`h-full rounded-full transition-all duration-1000 ${future.status === 'ACHIEVED' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-gradient-to-r from-kallpa-gold to-kallpa-fire shadow-[0_0_10px_rgba(212,175,55,0.3)]'}`} 
                                    style={{ width: `${future.progressPercentage}%` }}
                                ></div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-gray-600 text-center py-6 bg-black/10 rounded-xl border border-dashed border-gray-800 italic uppercase tracking-widest font-display">Falta subir sus FIs</p>
            )}
        </div>
    </AntigravityCard>
  );
}
