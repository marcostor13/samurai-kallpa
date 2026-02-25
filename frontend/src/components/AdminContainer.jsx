import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import AntigravityCard from './AntigravityCard';
import KatanaButton from './KatanaButton';
import { Search, Key, ShieldAlert } from 'lucide-react';

export default function AdminContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [updateMessage, setUpdateMessage] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch current user and list of all users concurrently
      const [profileRes, usersRes] = await Promise.all([
          axios.get(`${API_URL}/samurai/me`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/samurai/admin/users`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setUser(profileRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (err) {
      if (err.response?.status === 401) window.location.href = '/login';
      setError(err.response?.data?.message || 'Error al cargar datos.');
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (u.fullName && u.fullName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    setUpdateMessage(null);

    if (newPassword !== confirmPassword) {
      setUpdateMessage({ type: 'error', text: 'Las contraseñas no coinciden.' });
      return;
    }

    if (newPassword.length < 5) {
        setUpdateMessage({ type: 'error', text: 'La contraseña debe tener al menos 5 caracteres.' });
        return;
    }

    setIsUpdating(true);
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/samurai/admin/users/${selectedUser._id}/password`, 
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUpdateMessage({ type: 'success', text: `Contraseña de ${selectedUser.username} actualizada con éxito.` });
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSelectedUser(null);
        setUpdateMessage(null);
      }, 3000);
    } catch (err) {
        setUpdateMessage({ type: 'error', text: err.response?.data?.message || 'Error al actualizar contraseña.' });
    } finally {
        setIsUpdating(false);
    }
  };

  if (loading) return <div className="text-kallpa-gold text-center py-20 animate-pulse">Cargando datos del dojo...</div>;

  if (user && user.role !== 'SENSEI') {
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <ShieldAlert size={64} className="text-red-500 mb-4" />
            <h2 className="text-2xl font-display text-red-500 mb-2">Acceso Denegado</h2>
            <p className="text-kallpa-muted">No tienes los privilegios necesarios para ver esta sección.</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-3xl font-display text-kallpa-gold tracking-wider mb-2">Panel del Sensei</h1>
          <p className="text-kallpa-muted">Gestión de Guerreros y Seguridad</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 text-red-200 border border-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* User List */}
        <div className={`lg:col-span-${selectedUser ? '2' : '3'} transition-all duration-300`}>
          <AntigravityCard>
            <div className="mb-6 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" 
                placeholder="Buscar por apodo o nombre..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/50 border border-gray-700 text-white py-3 pl-10 pr-4 rounded-lg focus:border-kallpa-gold focus:outline-none transition-colors"
              />
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
              {filteredUsers.map(u => (
                <div 
                    key={u._id} 
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-colors ${selectedUser?._id === u._id ? 'bg-kallpa-gold/10 border-kallpa-gold' : 'bg-black/30 border-gray-800 hover:border-gray-600'}`}
                    onClick={() => setSelectedUser(u)}
                >
                  <div className="flex items-center space-x-4">
                    {u.avatarUrl ? (
                        <img src={u.avatarUrl} alt={u.username} className="w-10 h-10 rounded-full object-cover border border-gray-700" />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-kallpa-gold font-bold">
                            {u.username.charAt(0)}
                        </div>
                    )}
                    <div>
                      <h3 className="text-white font-medium">{u.fullName}</h3>
                      <p className="text-gray-400 text-sm">@{u.username} • {u.role}</p>
                    </div>
                  </div>
                  <button className="text-gray-500 hover:text-kallpa-gold transition-colors" title="Cambiar Contraseña">
                    <Key size={18} />
                  </button>
                </div>
              ))}
              {filteredUsers.length === 0 && (
                  <div className="text-center text-gray-500 py-8">No se encontraron guerreros.</div>
              )}
            </div>
          </AntigravityCard>
        </div>

        {/* Password Reset Form Sidebar */}
        {selectedUser && (
          <div className="lg:col-span-1">
            <AntigravityCard className="sticky top-6">
              <div className="mb-6">
                <h3 className="text-xl font-display text-white mb-1">Cambiar Contraseña</h3>
                <p className="text-kallpa-gold text-sm">Para: {selectedUser.fullName}</p>
              </div>

              {updateMessage && (
                  <div className={`p-3 mb-6 rounded text-sm ${updateMessage.type === 'success' ? 'bg-green-900/50 text-green-200 border border-green-700' : 'bg-red-900/50 text-red-200 border border-red-700'}`}>
                      {updateMessage.text}
                  </div>
              )}

              <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded focus:border-kallpa-gold focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Confirmar Contraseña</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded focus:border-kallpa-gold focus:outline-none transition-colors"
                    required
                  />
                </div>
                <div className="pt-2 flex gap-3">
                    <KatanaButton 
                        type="button" 
                        onClick={() => setSelectedUser(null)} 
                        className="flex-1 justify-center bg-gray-800 text-white hover:text-kallpa-gold border-gray-700"
                    >
                        Cancelar
                    </KatanaButton>
                    <KatanaButton 
                        type="submit" 
                        className="flex-1 justify-center"
                        disabled={isUpdating}
                    >
                        {isUpdating ? 'Actualizando...' : 'Actualizar'}
                    </KatanaButton>
                </div>
              </form>
            </AntigravityCard>
          </div>
        )}

      </div>
    </div>
  );
}
