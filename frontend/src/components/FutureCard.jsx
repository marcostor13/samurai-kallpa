import AntigravityCard from './AntigravityCard';
import KatanaButton from './KatanaButton';
import apiClient from '../api';
import { uiStore } from '../store/uiStore';
import { Trash2, Edit2, Plus, ExternalLink, Image as ImageIcon, FileText } from 'lucide-react';

export default function FutureCard({ future, onUpdate, onDelete, index }) {
  const [expanded, setExpanded] = useState(false);
  const [progress, setProgress] = useState(future.progressPercentage);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(future.title);
  const [editedDescription, setEditedDescription] = useState(future.description || '');

  const handleProgressChange = (e) => {
    setProgress(e.target.value);
  };

  const saveProgress = () => {
    onUpdate(future._id, { percentage: parseInt(progress) });
  };

  const handleUpdateInfo = async () => {
    try {
        const res = await apiClient.patch(`/futures/${future._id}`, {
            title: editedTitle,
            description: editedDescription
        });
        uiStore.showNotification('FI actualizado', 'success');
        setIsEditing(false);
        // We'll rely on parent state update if possible, or just local refresh
        // For simplicity in this island, we might need a refresh or parent callback
        // DashboardContainer handles progress, but not title/desc yet in its handleUpdate...
        // Let's assume onUpdate can handle full data or just trigger a refresh
        onUpdate(future._id, { ...res.data });
    } catch (err) {
        console.error(err);
    }
  };

  return (
    <AntigravityCard className={`cursor-pointer group relative ${expanded ? 'border-kallpa-gold shadow-gold-glow' : ''}`}>
      {/* Large Index Number */}
      <div className="absolute top-[-10px] left-[-10px] text-8xl font-black text-white/5 pointer-events-none group-hover:text-kallpa-gold/10 transition-colors">
        {index + 1}
      </div>

      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className="flex-1 pr-4">
          {isEditing ? (
            <div className="space-y-2 animate-fadeIn">
                <input 
                    type="text" 
                    value={editedTitle} 
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="w-full bg-black/50 border border-kallpa-gold/50 text-white p-2 rounded text-lg font-display"
                />
                <textarea 
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 text-white p-2 rounded text-sm h-20"
                    placeholder="Descripción del futuro..."
                />
                <div className="flex gap-2">
                    <button onClick={handleUpdateInfo} className="text-xs bg-kallpa-gold text-black px-3 py-1 rounded font-bold uppercase tracking-tighter">Guardar Cambios</button>
                    <button onClick={() => setIsEditing(false)} className="text-xs bg-gray-700 text-white px-3 py-1 rounded font-bold uppercase tracking-tighter">Cancelar</button>
                </div>
            </div>
          ) : (
            <>
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-xl font-display text-white group-hover:text-kallpa-gold transition-colors" onClick={() => setExpanded(!expanded)}>{future.title}</h3>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} className="p-1 hover:text-kallpa-gold text-gray-500"><Edit2 size={14} /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(future._id); }} className="p-1 hover:text-red-500 text-gray-500"><Trash2 size={14} /></button>
                    </div>
                </div>
                <p className="text-kallpa-muted text-sm line-clamp-2" onClick={() => setExpanded(!expanded)}>{future.description || 'Sin descripción'}</p>
            </>
          )}
        </div>
        <div className="text-kallpa-gold font-bold text-2xl ml-4" onClick={() => setExpanded(!expanded)}>{progress}%</div>
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
          
          <div className="flex justify-between items-center mb-6">
             <div className="flex flex-col gap-1">
                <label className="text-kallpa-teal text-xs cursor-pointer hover:underline flex items-center gap-2 bg-kallpa-teal/5 border border-kallpa-teal/20 px-3 py-2 rounded">
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
                                const res = await apiClient.post(`/futures/${future._id}/evidence`, formData, {
                                    headers: { 'Content-Type': 'multipart/form-data' }
                                });
                                uiStore.showNotification('Evidencia subida con éxito', 'success');
                                onUpdate(future._id, { ...res.data });
                            } catch (err) {
                                console.error(err);
                            }
                        }}
                    />
                    <Plus size={14} />
                    <span>Añadir Evidencia</span>
                </label>
             </div>
             <KatanaButton onClick={saveProgress} className="text-xs px-6 py-2">
               Guardar Progreso
             </KatanaButton>
          </div>

          {/* Evidence Grid */}
          {future.evidences?.length > 0 && (
            <div className="space-y-3">
                <h4 className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Evidencias ({future.evidences.length})</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {future.evidences.map((ev, i) => (
                        <a 
                            key={i} 
                            href={ev.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="group/ev relative aspect-square rounded-md overflow-hidden bg-black/40 border border-white/10 hover:border-kallpa-gold/50 transition-all flex flex-col items-center justify-center p-1"
                        >
                            {ev.type === 'IMAGE' ? (
                                <img src={ev.url} alt="Evidencia" className="w-full h-full object-cover rounded" />
                            ) : (
                                <FileText className="text-kallpa-teal" size={24} />
                            )}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/ev:opacity-100 transition-opacity flex items-center justify-center">
                                <ExternalLink size={16} className="text-white" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
          )}
        </div>
      )}
    </AntigravityCard>
  );
}
