import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from '../config';
import KatanaButton from './KatanaButton';
import AntigravityCard from './AntigravityCard';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginContainer() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password });
      localStorage.setItem('token', response.data.access_token);
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent">
      <AntigravityCard className="w-full max-w-md">
        <h2 className="text-3xl font-display text-center text-kallpa-gold mb-8">Ingresar</h2>
        {error && <div className="bg-red-900/50 text-red-200 p-3 mb-4 rounded border border-red-500">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-kallpa-muted text-sm uppercase tracking-widest mb-2">Usuario (Apodo)</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded focus:border-kallpa-gold focus:outline-none transition-colors uppercase"
              placeholder="Ej: ALONSO"
              required
            />
          </div>
          <div>
            <label className="block text-kallpa-muted text-sm uppercase tracking-widest mb-2">Contraseña</label>
            <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 text-white p-3 rounded focus:border-kallpa-gold focus:outline-none transition-colors"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-kallpa-gold transition-colors"
                  title={showPassword ? "Ocultar contraseña" : "Ver contraseña"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>
          <KatanaButton type="submit" className="w-full justify-center">
            Entrar
          </KatanaButton>
        </form>
      </AntigravityCard>
    </div>
  );
}
