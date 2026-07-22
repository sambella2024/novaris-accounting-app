# NOVARIS - Guide de Démarrage Rapide

## Prérequis

✅ Node.js v16+
✅ PostgreSQL v12+
✅ npm ou yarn

## Installation Rapide (5 minutes)

### 1️⃣ Configuration de la Base de Données

```bash
# Créer la base de données
creatdb novaris_db

# Copier le fichier d'environnement
cd backend
cp .env.example .env

# ⚠️ IMPORTANT: Éditer le fichier .env avec vos identifiants PostgreSQL
# Modifier cette ligne:
# DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/novaris_db

# Exécuter les migrations
node migrations/run.js
```

### 2️⃣ Démarrage du Backend

```bash
cd backend
npm install
npm run dev
```

🟢 Backend prêt sur `http://localhost:5000`

### 3️⃣ Démarrage du Frontend

```bash
cd frontend
npm install
npm run dev
```

🟢 Frontend prêt sur `http://localhost:3000`

## 🔐 Connexion de Test

Après les migrations, 3 utilisateurs de test sont créés:

### Admin
- **Email:** `admin@novaris.mg`
- **Mot de passe:** `admin123`
- **Rôle:** ADMIN
- **Accès:** Tous les modules

### Commercial
- **Email:** `jean@novaris.mg`
- **Mot de passe:** `admin123`
- **Rôle:** COMMERCIAL
- **Accès:** Créer devis, modifier, imprimer

### Responsable Financier
- **Email:** `paul@novaris.mg`
- **Mot de passe:** `admin123`
- **Rôle:** RESPONSABLE_FINANCIER
- **Accès:** Valider, transformer documents

## 📋 Workflow Complet

```
1. Commercial crée un DEVIS
   ↓
2. Responsable Financier VALIDE le devis
   ↓
3. Transformation automatique → BON DE COMMANDE
   ↓
4. Responsable Financier VALIDE le BC
   ↓
5. Transformation automatique → FACTURE
   ↓
6. Archivage / Paiement
```

## 🎯 Fonctionnalités Clés

✅ **Numérotation Automatique**
- Devis: `DEV-2026-000001`
- BC: `BC-2026-000001`
- Factures: `FAC-2026-000001`

✅ **Calculs Automatiques**
- TVA 20% sur tous les documents
- Remises (% ou montant fixe)
- Montant en lettres (Ariary)

✅ **Validation Obligatoire**
- RF doit valider avant chaque transformation
- Impossible de modifier après validation
- Traçabilité complète

✅ **Historique Inaltérable**
- Chaque action enregistrée
- Utilisateur, date, action
- Impossible de supprimer

✅ **Génération PDF**
- Format professionnel A4
- Impression directe
- Export PDF

## 📁 Structure des Fichiers

```
novaris-accounting-app/
├── backend/              # Node.js + Express + PostgreSQL
│   ├── src/
│   │   ├── controllers/  # Logique métier
│   │   ├── routes/       # Routes API
│   │   ├── services/     # Services (calculs, PDF, etc.)
│   │   ├── middleware/   # Auth, validation
│   │   └── config/       # Connexion DB
│   ├── migrations/       # SQL init
│   └── package.json
│
├── frontend/             # React + Vite + TypeScript
│   ├── src/
│   │   ├── pages/        # Pages React
│   │   ├── components/   # Composants réutilisables
│   │   ├── context/      # Context API (Auth)
│   │   └── App.tsx
│   └── package.json
│
└── docs/                 # Documentation
```

## 🔧 Troubleshooting

### Erreur: "Database connection failed"
```bash
# Vérifier PostgreSQL
psql -U postgres -l

# Vérifier le fichier .env
cat backend/.env
```

### Erreur: "Port 5000 already in use"
```bash
# Changer le port dans backend/.env
PORT=5001
```

### Erreur: "npm ERR! peer dep missing"
```bash
npm install --legacy-peer-deps
```

## 🚀 Déploiement

### Build Production

```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

### Executable Windows (Future)

Utiliser Electron ou NW.js pour packager:
```bash
npm install electron --save-dev
```

## 📞 Support

Pour toute question ou bug, consultez la documentation dans `ARCHITECTURE.md` et `INSTALLATION.md`

---

**Application NOVARIS - Gestion Comptable Complète** ✅
