-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: entreprise
CREATE TABLE IF NOT EXISTS entreprise (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  telephone VARCHAR(20),
  email VARCHAR(100),
  nif VARCHAR(50),
  stat VARCHAR(50),
  rcs VARCHAR(50),
  logo BYTEA,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: utilisateurs
CREATE TABLE IF NOT EXISTS utilisateurs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  mot_de_passe VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('ADMIN', 'COMMERCIAL', 'RESPONSABLE_FINANCIER')),
  actif BOOLEAN DEFAULT true,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: clients
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom VARCHAR(255) NOT NULL,
  adresse TEXT NOT NULL,
  telephone VARCHAR(20),
  email VARCHAR(100),
  nif VARCHAR(50),
  contact_person VARCHAR(255),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: produits
CREATE TABLE IF NOT EXISTS produits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference VARCHAR(100) UNIQUE NOT NULL,
  designation VARCHAR(255) NOT NULL,
  prix_unitaire DECIMAL(12, 2) NOT NULL,
  unite VARCHAR(50),
  categorie VARCHAR(100),
  tva DECIMAL(5, 2) DEFAULT 20,
  actif BOOLEAN DEFAULT true,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: devis
CREATE TABLE IF NOT EXISTS devis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_piece BIGSERIAL UNIQUE,
  reference VARCHAR(50) UNIQUE NOT NULL,
  date_devis TIMESTAMP NOT NULL,
  date_livraison TIMESTAMP,
  client_id UUID NOT NULL REFERENCES clients(id),
  client_nom VARCHAR(255),
  client_adresse TEXT,
  client_telephone VARCHAR(20),
  client_email VARCHAR(100),
  representant_id UUID REFERENCES utilisateurs(id),
  representant_nom VARCHAR(255),
  echeance TIMESTAMP,
  montant_ht DECIMAL(15, 2) DEFAULT 0,
  montant_tva DECIMAL(15, 2) DEFAULT 0,
  montant_ttc DECIMAL(15, 2) DEFAULT 0,
  net_a_payer DECIMAL(15, 2) DEFAULT 0,
  montant_lettres TEXT,
  statut VARCHAR(50) NOT NULL DEFAULT 'BROUILLON' CHECK (statut IN ('BROUILLON', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'TRANSFORME')),
  valide_rf BOOLEAN DEFAULT false,
  date_validation_rf TIMESTAMP,
  utilisateur_validation_rf UUID REFERENCES utilisateurs(id),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES utilisateurs(id)
);

-- Table: lignes_devis
CREATE TABLE IF NOT EXISTS lignes_devis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  devis_id UUID NOT NULL REFERENCES devis(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES produits(id),
  reference_produit VARCHAR(100),
  designation VARCHAR(255) NOT NULL,
  quantite DECIMAL(10, 2) NOT NULL,
  prix_unitaire DECIMAL(12, 2) NOT NULL,
  remise_pourcentage DECIMAL(5, 2) DEFAULT 0,
  remise_montant DECIMAL(12, 2) DEFAULT 0,
  montant_ht DECIMAL(15, 2) NOT NULL,
  ordre INT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: bons_commande
CREATE TABLE IF NOT EXISTS bons_commande (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_piece BIGSERIAL UNIQUE,
  reference VARCHAR(50) UNIQUE NOT NULL,
  devis_id UUID NOT NULL REFERENCES devis(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  client_nom VARCHAR(255),
  client_adresse TEXT,
  client_telephone VARCHAR(20),
  client_email VARCHAR(100),
  representant_id UUID REFERENCES utilisateurs(id),
  representant_nom VARCHAR(255),
  montant_ht DECIMAL(15, 2) DEFAULT 0,
  montant_tva DECIMAL(15, 2) DEFAULT 0,
  montant_ttc DECIMAL(15, 2) DEFAULT 0,
  net_a_payer DECIMAL(15, 2) DEFAULT 0,
  montant_lettres TEXT,
  statut VARCHAR(50) NOT NULL DEFAULT 'EN_ATTENTE' CHECK (statut IN ('EN_ATTENTE', 'VALIDE', 'PAYE', 'TRANSFORME')),
  valide_rf BOOLEAN DEFAULT false,
  date_validation_rf TIMESTAMP,
  utilisateur_validation_rf UUID REFERENCES utilisateurs(id),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES utilisateurs(id)
);

-- Table: lignes_bc
CREATE TABLE IF NOT EXISTS lignes_bc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  bc_id UUID NOT NULL REFERENCES bons_commande(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES produits(id),
  reference_produit VARCHAR(100),
  designation VARCHAR(255) NOT NULL,
  quantite DECIMAL(10, 2) NOT NULL,
  prix_unitaire DECIMAL(12, 2) NOT NULL,
  remise_pourcentage DECIMAL(5, 2) DEFAULT 0,
  remise_montant DECIMAL(12, 2) DEFAULT 0,
  montant_ht DECIMAL(15, 2) NOT NULL,
  ordre INT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: factures
CREATE TABLE IF NOT EXISTS factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  numero_piece BIGSERIAL UNIQUE,
  reference VARCHAR(50) UNIQUE NOT NULL,
  bc_id UUID NOT NULL REFERENCES bons_commande(id),
  devis_id UUID REFERENCES devis(id),
  client_id UUID NOT NULL REFERENCES clients(id),
  client_nom VARCHAR(255),
  client_adresse TEXT,
  client_telephone VARCHAR(20),
  client_email VARCHAR(100),
  representant_id UUID REFERENCES utilisateurs(id),
  representant_nom VARCHAR(255),
  montant_ht DECIMAL(15, 2) DEFAULT 0,
  montant_tva DECIMAL(15, 2) DEFAULT 0,
  montant_ttc DECIMAL(15, 2) DEFAULT 0,
  net_a_payer DECIMAL(15, 2) DEFAULT 0,
  montant_lettres TEXT,
  statut VARCHAR(50) NOT NULL DEFAULT 'NON_PAYEE' CHECK (statut IN ('NON_PAYEE', 'PARTIELLEMENT_PAYEE', 'PAYEE')),
  valide_rf BOOLEAN DEFAULT false,
  date_validation_rf TIMESTAMP,
  utilisateur_validation_rf UUID REFERENCES utilisateurs(id),
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by UUID NOT NULL REFERENCES utilisateurs(id)
);

-- Table: lignes_factures
CREATE TABLE IF NOT EXISTS lignes_factures (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facture_id UUID NOT NULL REFERENCES factures(id) ON DELETE CASCADE,
  produit_id UUID REFERENCES produits(id),
  reference_produit VARCHAR(100),
  designation VARCHAR(255) NOT NULL,
  quantite DECIMAL(10, 2) NOT NULL,
  prix_unitaire DECIMAL(12, 2) NOT NULL,
  remise_pourcentage DECIMAL(5, 2) DEFAULT 0,
  remise_montant DECIMAL(12, 2) DEFAULT 0,
  montant_ht DECIMAL(15, 2) NOT NULL,
  ordre INT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: historique
CREATE TABLE IF NOT EXISTS historique (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_type VARCHAR(50) NOT NULL CHECK (document_type IN ('DEVIS', 'BC', 'FACTURE')),
  document_id UUID NOT NULL,
  action VARCHAR(255) NOT NULL,
  utilisateur_id UUID REFERENCES utilisateurs(id),
  utilisateur_nom VARCHAR(255),
  details TEXT,
  date_action TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: parametres
CREATE TABLE IF NOT EXISTS parametres (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cle VARCHAR(100) UNIQUE NOT NULL,
  valeur TEXT,
  description TEXT,
  date_creation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes
CREATE INDEX idx_devis_reference ON devis(reference);
CREATE INDEX idx_devis_client ON devis(client_id);
CREATE INDEX idx_devis_statut ON devis(statut);
CREATE INDEX idx_bc_reference ON bons_commande(reference);
CREATE INDEX idx_bc_devis ON bons_commande(devis_id);
CREATE INDEX idx_bc_statut ON bons_commande(statut);
CREATE INDEX idx_facture_reference ON factures(reference);
CREATE INDEX idx_facture_bc ON factures(bc_id);
CREATE INDEX idx_facture_statut ON factures(statut);
CREATE INDEX idx_historique_document ON historique(document_type, document_id);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);
CREATE INDEX idx_clients_nom ON clients(nom);
CREATE INDEX idx_produits_reference ON produits(reference);
