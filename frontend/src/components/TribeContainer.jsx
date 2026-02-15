import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AntigravityCard from './AntigravityCard';

export default function TribeContainer() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await axios.get(`${API_URL}/tribe/feed`);
        setResources(res.data);
      } catch (error) {
        console.error('Error fetching tribe feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (loading) return <div className="text-white text-center mt-20">Conectando con el Equipo...</div>;

  return (
    <div className="container mx-auto px-4 pt-32 pb-8">
      <h1 className="text-3xl font-display text-white mb-12 text-center">Recursos del Equipo</h1>
      
      <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
        {resources.map((resource) => (
          <AntigravityCard key={resource._id} className="break-inside-avoid mb-8">
            <div className="flex items-center mb-4">
               <div className="w-10 h-10 rounded-full bg-gray-700 mr-3 border border-kallpa-gold">
                   {resource.authorId?.avatarUrl && <img src={resource.authorId.avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover"/>}
               </div>
               <div>
                   <h3 className="text-white font-bold text-sm">{resource.authorId?.fullName || 'Samurai Anónimo'}</h3>
                   <span className="text-kallpa-muted text-xs">{new Date(resource.createdAt).toLocaleDateString()}</span>
               </div>
            </div>
            <h2 className="text-xl font-display text-kallpa-gold mb-2">{resource.title}</h2>
            <p className="text-kallpa-text text-sm mb-4 whitespace-pre-wrap">{resource.content}</p>
            {resource.url && (
                <a href={resource.url} target="_blank" rel="noopener noreferrer" className="text-kallpa-teal text-sm hover:underline block mt-2">
                    Ver Recurso &rarr;
                </a>
            )}
            <div className="mt-4 pt-4 border-t border-gray-800 flex justify-between items-center text-xs text-kallpa-muted uppercase tracking-widest">
                <span>{resource.type}</span>
            </div>
          </AntigravityCard>
        ))}
      </div>
      
      {resources.length === 0 && (
          <p className="text-center text-kallpa-muted">El equipo está en silencio por ahora.</p>
      )}
    </div>
  );
}
