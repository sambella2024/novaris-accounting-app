export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  mot_de_passe: string;
  role: 'ADMIN' | 'COMMERCIAL' | 'RESPONSABLE_FINANCIER';
  actif: boolean;
  date_creation: Date;
  date_modification: Date;
}
