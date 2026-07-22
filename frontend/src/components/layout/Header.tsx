import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">NOVARIS</h1>
          <span className="text-sm bg-blue-700 px-2 py-1 rounded">Gestion Comptable</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">
            {user?.prenom} {user?.nom}
          </span>
          <span className="text-xs bg-blue-700 px-2 py-1 rounded">{user?.role}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </header>
  );
};
