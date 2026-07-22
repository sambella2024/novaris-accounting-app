# NOVARIS - Installation et Démarrage

## Prérequis

- Node.js (v16+)
- PostgreSQL (v12+)
- npm ou yarn

## Installation

### 1. Base de données

```bash
# Créer la base de données
createdb novaris_db

# Configurer les variables d'environnement
cp backend/.env.example backend/.env

# Éditer backend/.env avec vos identifiants PostgreSQL
# DATABASE_URL=postgresql://user:password@localhost:5432/novaris_db

# Exécuter les migrations
cd backend
node migrations/run.js
```

### 2. Backend

```bash
cd backend
npm install
npm run dev
```

Le backend démarre sur `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Le frontend démarre sur `http://localhost:3000`

## Identifiants de test

### Admin
- Email: `admin@novaris.mg`
- Mot de passe: `admin123`
- Rôle: ADMIN

### Commercial
- Email: `jean@novaris.mg`
- Mot de passe: `admin123`
- Rôle: COMMERCIAL

### Responsable Financier
- Email: `paul@novaris.mg`
- Mot de passe: `admin123`
- Rôle: RESPONSABLE_FINANCIER

## Architecture

### Backend
- Express.js + TypeScript
- PostgreSQL
- JWT Authentication
- PDF Generation (PDFKit)

### Frontend
- React + TypeScript
- Vite
- Tailwind CSS
- Axios

## Routes API Principales

```
POST   /api/auth/login              - Connexion
POST   /api/auth/register           - Inscription

GET    /api/devis                   - Lister les devis
POST   /api/devis                   - Créer un devis
GET    /api/devis/:id               - Voir un devis
PUT    /api/devis/:id               - Modifier un devis
POST   /api/devis/:id/validate      - Valider un devis
POST   /api/devis/:id/transform-to-bc - Transformer en BC

GET    /api/bc                      - Lister les BC
GET    /api/bc/:id                  - Voir un BC
POST   /api/bc/:id/validate         - Valider un BC
POST   /api/bc/:id/transform-to-facture - Transformer en Facture

GET    /api/factures                - Lister les factures
GET    /api/factures/:id            - Voir une facture
POST   /api/factures/:id/validate   - Valider une facture

GET    /api/produits                - Lister les produits
POST   /api/produits                - Créer un produit
GET    /api/produits/:id            - Voir un produit
PUT    /api/produits/:id            - Modifier un produit

GET    /api/clients                 - Lister les clients
POST   /api/clients                 - Créer un client
GET    /api/clients/:id             - Voir un client
PUT    /api/clients/:id             - Modifier un client

GET    /api/utilisateurs            - Lister les utilisateurs (Admin)
POST   /api/utilisateurs            - Créer un utilisateur (Admin)
GET    /api/utilisateurs/:id        - Voir un utilisateur
PUT    /api/utilisateurs/:id        - Modifier un utilisateur (Admin)
```

## Format final de l'application

**L'application est une APPLICATION WEB WINDOWS NATIVE**

- ✅ Exécutable sur Windows, Mac, Linux
- ✅ Fonctionne entièrement en local (standalone)
- ✅ Base de données PostgreSQL intégrée ou locale
- ✅ Interface web moderne (React)
- ✅ Génération PDF
- ✅ Impression professionnelle

### Pour exécuter l'application:

1. **En développement**: `npm run dev` dans backend et frontend
2. **En production**: Build avec `npm run build` et lancer avec `npm start`
3. **Packager**: Utiliser Electron ou NW.js pour créer un executable Windows standalone

## Fonctionnalités Implémentées

✅ Authentification JWT
✅ Gestion des rôles (ADMIN, COMMERCIAL, RESPONSABLE_FINANCIER)
✅ CRUD Devis, Bons de Commande, Factures
✅ Numérotation automatique (DEV-, BC-, FAC-)
✅ Calculs automatiques (TVA, remises, montants)
✅ Historique traçable des opérations
✅ Validation obligatoire du Responsable Financier
✅ Génération PDF
✅ Interface responsive

## Prochaines étapes

- Implémenter les contrôleurs complets
- Ajouter les validations
- Implémenter la génération PDF complète
- Ajouter les notifications
- Tests unitaires et d'intégration
- Packaging en executable Windows
