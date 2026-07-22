export interface BonCommande {
  id: string;
  numero_piece: number;
  reference: string;
  devis_id: string;
  date_creation: Date;
  date_modification: Date;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  net_a_payer: number;
  statut: 'EN_ATTENTE' | 'VALIDE' | 'PAYE' | 'TRANSFORME';
  validé_rf: boolean;
  date_validation_rf: Date | null;
  utilisateur_validation_rf: string | null;
  created_by: string;
}

export interface LigneBC {
  id: string;
  bc_id: string;
  produit_id: string;
  designation: string;
  quantite: number;
  prix_unitaire: number;
  remise_pourcentage: number;
  remise_montant: number;
  montant_ht: number;
  ordre: number;
}
