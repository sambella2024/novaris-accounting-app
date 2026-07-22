-- Insert default enterprise data
INSERT INTO entreprise (nom, adresse, telephone, email, nif, stat, rcs)
VALUES (
  'NOVARIS',
  '123 Rue du Bâtiment, Antananarivo',
  '+261 20 XX XX XX',
  'contact@novaris.mg',
  'NIF123456',
  'STAT123456',
  'RCS123456'
);

-- Insert sample admin user (password: admin123)
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
VALUES (
  'Admin',
  'System',
  'admin@novaris.mg',
  '$2a$10$H9BhKH7lJ5J5K5L5M5N5O.5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d5e5',
  'ADMIN'
);

-- Insert sample commercial user
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
VALUES (
  'Jean',
  'Commercial',
  'jean@novaris.mg',
  '$2a$10$H9BhKH7lJ5J5K5L5M5N5O.5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d5e5',
  'COMMERCIAL'
);

-- Insert sample financial user
INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, role)
VALUES (
  'Paul',
  'Responsable',
  'paul@novaris.mg',
  '$2a$10$H9BhKH7lJ5J5K5L5M5N5O.5P5Q5R5S5T5U5V5W5X5Y5Z5a5b5c5d5e5',
  'RESPONSABLE_FINANCIER'
);

-- Insert sample products
INSERT INTO produits (reference, designation, prix_unitaire, unite, categorie, tva)
VALUES
  ('PROD-001', 'Ciment 50kg', 8500.00, 'sac', 'Matériaux', 20),
  ('PROD-002', 'Fer 10mm', 12000.00, 'mètre', 'Matériaux', 20),
  ('PROD-003', 'Sable', 5000.00, 'm3', 'Matériaux', 20),
  ('PROD-004', 'Brique', 200.00, 'unité', 'Matériaux', 20),
  ('PROD-005', 'Tôle ondulée', 35000.00, 'unité', 'Toiture', 20);

-- Insert sample client
INSERT INTO clients (nom, adresse, telephone, email, nif, contact_person)
VALUES
  ('ABC Construction', '456 Avenue de la Paix, Antananarivo', '+261 20 22 22 22', 'contact@abc.mg', 'NIF-ABC-001', 'Mr. André');

-- Insert default parameters
INSERT INTO parametres (cle, valeur, description)
VALUES
  ('TVA_RATE', '20', 'Taux de TVA standard en pourcentage'),
  ('CURRENCY', 'Ariary', 'Devise utilisée'),
  ('CURRENCY_SYMBOL', 'Ar', 'Symbole de la devise'),
  ('DECIMAL_PLACES', '2', 'Nombre de décimales pour les calculs');
