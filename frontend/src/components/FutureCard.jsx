import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AntigravityCard from './AntigravityCard';
import KatanaButton from './KatanaButton';

export default function FutureCard({ future, onUpdate, index }) {
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(future.progressPercentage);

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  const saveProgress = () => {
    onUpdate(future._id, { percentage: parseInt(progress) });
  };

  return (
    <AntigravityCard className={`cursor-pointer group relative ${expanded ? 'border-kallpa-gold shadow-gold-glow' : ''}`}>
      {/* Large Index Number */}
      <div className="absolute top-[-10px] left-[-10px] text-8xl font-black text-white/5 pointer-events-none group-hover:text-kallpa-gold/10 transition-colors">
        {index + 1}
      </div>

      <div onClick={() => setExpanded(!expanded)} className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-xl font-display text-white group-hover:text-kallpa-gold transition-colors">{future.title}</h3>
          <p className="text-kallpa-muted text-sm line-clamp-2">{future.description}</p>
        </div>
        <div className="text-kallpa-gold font-bold text-2xl ml-4">{progress}%</div>
      </div>

      <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden mb-4">
        <div
          className="bg-gradient-to-r from-kallpa-gold to-kallpa-fire h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {expanded && (
        <div className="mt-6 border-t border-gray-700 pt-4 animate-fadeIn">
          <label className="block text-kallpa-text mb-2 text-sm uppercase tracking-widest">Actualizar Progreso</label>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleProgressChange}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-kallpa-fire mb-4"
          />
          
          <div className="flex justify-between items-center">
             <div className="flex flex-col gap-1">
                <label className="text-kallpa-teal text-xs cursor-pointer hover:underline flex items-center gap-1">
                    <input 
                        type="file" 
                        className="hidden" 
                        onChange={async (e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            
                            const formData = new FormData();
                            formData.append('file', file);
                            formData.append('type', 'IMAGE');
                            
                            try {
                                const token = localStorage.getItem('token');
                                await axios.post(`${API_URL}/futures/${future._id}/evidence`, formData, {
                                    headers: { 
                                        'Authorization': `Bearer ${token}`,
                                        'Content-Type': 'multipart/form-data'
                                    }
                                });
                                alert('Evidencia subida con éxito');
                            } catch (err) {
                                console.error(err);
                                alert('Error al subir evidencia');
                            }
                        }}
                    />
                    <span>Subir Evidencia (+)</span>
                </label>
                {future.evidences?.length > 0 && (
                    <span className="text-[10px] text-kallpa-gold italic">
                        {future.evidences.length} evidencias cargadas
                    </span>
                )}
             </div>
             <KatanaButton onClick={saveProgress} className="text-xs px-4 py-2">
               Guardar
             </KatanaButton>
          </div>
        </div>
      )}
    </AntigravityCard>
  );
}
