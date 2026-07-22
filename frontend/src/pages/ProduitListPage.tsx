import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface Produit {
  id: string;
  reference: string;
  designation: string;
  prix_unitaire: number;
  unite: string;
  categorie: string;
}

export const ProduitListPage: React.FC = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { token } = useAuth();

  useEffect(() => {
    const fetchProduits = async () => {
      try {
        const response = await fetch(`/api/produits?search=${search}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setProduits(data.produits);
      } catch (error) {
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setLoading(false);
      }
    };

    fetchProduits();
  }, [search, token]);

  if (loading) return <Layout><div>Chargement...</div></Layout>;

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Produits</h1>
          <Button>+ Nouveau Produit</Button>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <input
            type="text"
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Référence</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Désignation</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Prix Unitaire</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Unité</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Catégorie</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {produits.map((p) => (
                <tr key={p.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm font-mono">{p.reference}</td>
                  <td className="px-6 py-3 text-sm">{p.designation}</td>
                  <td className="px-6 py-3 text-sm font-semibold">{p.prix_unitaire.toLocaleString('fr-FR')} Ar</td>
                  <td className="px-6 py-3 text-sm">{p.unite}</td>
                  <td className="px-6 py-3 text-sm">{p.categorie}</td>
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
