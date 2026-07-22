import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export const CreateDevisPage: React.FC = () => {
  const [formData, setFormData] = useState({
    client_id: '',
    date_devis: new Date().toISOString().split('T')[0],
    date_livraison: '',
    echeance: '',
    lignes: [{ designation: '', quantite: 0, prix_unitaire: 0, remise: 0 }],
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/devis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Devis créé avec succès');
        // Redirect to devis list
      } else {
        toast.error('Erreur lors de la création du devis');
      }
    } catch (error) {
      toast.error('Erreur lors de la création du devis');
    } finally {
      setLoading(false);
    }
  };

  const handleAddLigne = () => {
    setFormData({
      ...formData,
      lignes: [...formData.lignes, { designation: '', quantite: 0, prix_unitaire: 0, remise: 0 }],
    });
  };

  const handleRemoveLigne = (index: number) => {
    setFormData({
      ...formData,
      lignes: formData.lignes.filter((_, i) => i !== index),
    });
  };

  const handleLigneChange = (index: number, field: string, value: any) => {
    const newLignes = [...formData.lignes];
    newLignes[index] = { ...newLignes[index], [field]: value };
    setFormData({ ...formData, lignes: newLignes });
  };

  // Calculate totals
  const totalHT = formData.lignes.reduce((sum, ligne) => {
    const lineTotal = ligne.quantite * ligne.prix_unitaire - ligne.remise;
    return sum + lineTotal;
  }, 0);
  const montantTVA = totalHT * 0.2;
  const totalTTC = totalHT + montantTVA;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Créer un Devis</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations Générales */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Informations Générales</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Client ID"
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                required
              />
              <Input
                label="Date du Devis"
                type="date"
                value={formData.date_devis}
                onChange={(e) => setFormData({ ...formData, date_devis: e.target.value })}
                required
              />
              <Input
                label="Date de Livraison"
                type="date"
                value={formData.date_livraison}
                onChange={(e) => setFormData({ ...formData, date_livraison: e.target.value })}
              />
              <Input
                label="Échéance"
                type="date"
                value={formData.echeance}
                onChange={(e) => setFormData({ ...formData, echeance: e.target.value })}
              />
            </div>
          </div>

          {/* Lignes du Devis */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Articles</h2>
              <Button type="button" size="sm" onClick={handleAddLigne}>
                + Ajouter une ligne
              </Button>
            </div>

            <div className="space-y-4">
              {formData.lignes.map((ligne, index) => (
                <div key={index} className="grid grid-cols-6 gap-2 items-end">
                  <Input
                    label="Désignation"
                    value={ligne.designation}
                    onChange={(e) => handleLigneChange(index, 'designation', e.target.value)}
                    placeholder="Description du produit"
                  />
                  <Input
                    label="Quantité"
                    type="number"
                    value={ligne.quantite}
                    onChange={(e) => handleLigneChange(index, 'quantite', parseFloat(e.target.value))}
                    step="0.01"
                  />
                  <Input
                    label="Prix Unitaire"
                    type="number"
                    value={ligne.prix_unitaire}
                    onChange={(e) => handleLigneChange(index, 'prix_unitaire', parseFloat(e.target.value))}
                    step="0.01"
                  />
                  <Input
                    label="Remise"
                    type="number"
                    value={ligne.remise}
                    onChange={(e) => handleLigneChange(index, 'remise', parseFloat(e.target.value))}
                    step="0.01"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Montant HT</p>
                    <p className="text-lg font-bold text-blue-600">
                      {((ligne.quantite * ligne.prix_unitaire - ligne.remise) || 0).toLocaleString('fr-FR')} Ar
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={() => handleRemoveLigne(index)}
                  >
                    Supprimer
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Totaux */}
          <div className="bg-blue-50 rounded-lg shadow p-6">
            <div className="space-y-2 text-right">
              <div className="text-lg">
                <span className="font-semibold">Total HT:</span>
                <span className="float-right text-xl font-bold">{totalHT.toLocaleString('fr-FR')} Ar</span>
              </div>
              <div className="text-lg">
                <span className="font-semibold">TVA (20%):</span>
                <span className="float-right text-xl font-bold">{montantTVA.toLocaleString('fr-FR')} Ar</span>
              </div>
              <div className="border-t-2 pt-2 text-xl">
                <span className="font-bold">Total TTC:</span>
                <span className="float-right text-2xl font-bold text-blue-600">{totalTTC.toLocaleString('fr-FR')} Ar</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" loading={loading}>
              Créer le Devis
            </Button>
            <Button type="button" variant="secondary" onClick={() => window.history.back()}>
              Annuler
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};
