import React from 'react';
import { Layout } from '../../components/layout/Layout';

export const DashboardPage: React.FC = () => {
  const stats = [
    { label: 'Devis en attente', value: '12', color: 'blue' },
    { label: 'Bons de Commande', value: '8', color: 'green' },
    { label: 'Factures', value: '5', color: 'orange' },
    { label: 'Montant total TTC', value: '25M Ar', color: 'purple' },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Tableau de bord</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
              <p className={`text-3xl font-bold text-${stat.color}-600 mt-2`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Devis récents</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center border-b pb-2">
                  <span>DEV-2026-00000{i}</span>
                  <span className="text-gray-500">Client {i}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Actions en attente</h2>
            <div className="space-y-3">
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3">
                <p className="font-semibold text-sm">Validation requise</p>
                <p className="text-xs text-gray-600">3 documents en attente de validation</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
