import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  adresse: string;
}

export const ClientListPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`/api/clients?search=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setClients(data.clients);
      } catch (error) {
        toast.error('Erreur lors du chargement des clients');
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [search, token]);

  if (loading) return <Layout><div>Chargement...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
          <Button>+ Nouveau Client</Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Rechercher un client..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nom</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Téléphone</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Adresse</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-semibold">{c.nom}</td>
                  <td className="px-6 py-3 text-sm">{c.email}</td>
                  <td className="px-6 py-3 text-sm">{c.telephone}</td>
                  <td className="px-6 py-3 text-sm text-gray-600 truncate">{c.adresse}</td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:underline">Modifier</button>
                    <button className="text-red-600 hover:underline">Supprimer</button>
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
