import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

interface Devis {
  id: string;
  reference: string;
  date_devis: string;
  client_nom: string;
  montant_ttc: number;
  statut: string;
}

export const DevisListPage: React.FC = () => {
  const [devis, setDevis] = useState<Devis[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    const fetchDevis = async () => {
      try {
        const response = await fetch('/api/devis', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setDevis(data);
      } catch (error) {
        console.error('Error fetching devis:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDevis();
  }, [token]);

  if (loading) return <Layout><div>Chargement...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Devis</h1>
          <Button>+ Nouveau Devis</Button>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Référence</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Client</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Montant TTC</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Statut</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {devis.map((d) => (
                <tr key={d.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{d.reference}</td>
                  <td className="px-6 py-3 text-sm">{d.client_nom}</td>
                  <td className="px-6 py-3 text-sm">{new Date(d.date_devis).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-3 text-sm font-semibold">{d.montant_ttc.toLocaleString('fr-FR')} Ar</td>
                  <td className="px-6 py-3 text-sm">
                    <span className="inline-block px-2 py-1 rounded text-xs font-semibold bg-blue-100 text-blue-800">
                      {d.statut}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm space-x-2">
                    <button className="text-blue-600 hover:underline">Voir</button>
                    <button className="text-green-600 hover:underline">Modifier</button>
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
