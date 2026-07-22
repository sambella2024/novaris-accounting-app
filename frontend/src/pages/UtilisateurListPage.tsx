import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Utilisateur {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  role: string;
  actif: boolean;
}

export const UtilisateurListPage: React.FC = () => {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchUtilisateurs = async () => {
      try {
        const response = await fetch('/api/utilisateurs', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setUtilisateurs(data.utilisateurs);
      } catch (error) {
        toast.error('Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };

    fetchUtilisateurs();
  }, [token]);

  if (loading) return <Layout><div>Chargement...</div></Layout>;

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'COMMERCIAL':
        return 'bg-green-100 text-green-800';
      case 'RESPONSABLE_FINANCIER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">Utilisateurs</h1>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rôle</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {utilisateurs.map((u) => (
                <tr key={u.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-semibold">
                    {u.prenom} {u.nom}
                  </td>
                  <td className="px-6 py-3 text-sm">{u.email}</td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getRoleColor(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                      u.actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {u.actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:underline">Modifier</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};
