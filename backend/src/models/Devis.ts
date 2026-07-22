export interface Devis {
  id: string;
  numero_piece: number;
  reference: string;
  date_devis: Date;
  date_livraison: Date;
  client_id: string;
  representant_id: string;
  echeance: Date;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  net_a_payer: number;
  montant_lettres: string;
  statut: 'BROUILLON' | 'ENVOYE' | 'ACCEPTE' | 'REFUSE' | 'TRANSFORME';
  validé_rf: boolean;
  date_validation_rf: Date | null;
  utilisateur_validation_rf: string | null;
  date_creation: Date;
  date_modification: Date;
  created_by: string;
}

export interface LigneDevis {
  id: string;
  devis_id: string;
  produit_id: string;
  designation: string;
  quantite: number;
  prix_unitaire: number;
  remise_pourcentage: number;
  remise_montant: number;
  montant_ht: number;
  ordre: number;
}
