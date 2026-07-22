export interface Facture {
  id: string;
  numero_piece: number;
  reference: string;
  bc_id: string;
  date_creation: Date;
  date_modification: Date;
  montant_ht: number;
  montant_tva: number;
  montant_ttc: number;
  net_a_payer: number;
  statut: 'NON_PAYEE' | 'PARTIELLEMENT_PAYEE' | 'PAYEE';
  validé_rf: boolean;
  date_validation_rf: Date | null;
  utilisateur_validation_rf: string | null;
  created_by: string;
}

export interface LigneFacture {
  id: string;
  facture_id: string;
  produit_id: string;
  designation: string;
  quantite: number;
  prix_unitaire: number;
  remise_pourcentage: number;
  remise_montant: number;
  montant_ht: number;
  ordre: number;
}
