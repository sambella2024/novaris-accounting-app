import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const menuItems = [
    { label: 'Tableau de bord', path: '/dashboard', roles: ['ADMIN', 'COMMERCIAL', 'RESPONSABLE_FINANCIER'] },
    { label: 'Devis', path: '/devis', roles: ['COMMERCIAL', 'RESPONSABLE_FINANCIER', 'ADMIN'] },
    { label: 'Bons de Commande', path: '/bc', roles: ['RESPONSABLE_FINANCIER', 'ADMIN'] },
    { label: 'Factures', path: '/factures', roles: ['RESPONSABLE_FINANCIER', 'ADMIN'] },
    { label: 'Produits', path: '/produits', roles: ['ADMIN'] },
    { label: 'Clients', path: '/clients', roles: ['COMMERCIAL', 'ADMIN'] },
    { label: 'Utilisateurs', path: '/utilisateurs', roles: ['ADMIN'] },
  ];

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role || ''));

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <nav className="space-y-2">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="block px-4 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};
